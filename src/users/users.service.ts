import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    options?: { isSystem?: boolean; merchantId?: string },
  ): Promise<UserResponseDto> {
    const existing = await this.userModel
      .findOne({ email: createUserDto.email.toLowerCase() })
      .lean();

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const merchantId = options?.merchantId ?? createUserDto.merchantId;
    if (!merchantId) {
      throw new ConflictException('merchantId is required');
    }

    const user = await this.userModel.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      isSystem: options?.isSystem ?? false,
      merchantId,
    });

    return this.toResponseDto(user);
  }

  async ensureSystemUser(
    name: string,
    email: string,
    password: string,
    merchantId?: string,
  ): Promise<UserResponseDto> {
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      return this.toResponseDto(existing);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.SystemAdmin,
      isSystem: true,
      merchantId: merchantId ?? '',
    });

    return this.toResponseDto(user);
  }

  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  async findById(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toResponseDto(user);
  }

  private isMongooseDocument(user: UserDocument | User): user is UserDocument {
    return typeof (user as UserDocument).toObject === 'function';
  }

  toResponseDto(
    user:
      | UserDocument
      | (User & {
          _id?: Types.ObjectId | string;
          id?: Types.ObjectId | string;
          createdAt?: Date;
          updatedAt?: Date;
          merchantId?: Types.ObjectId | string | null;
        }),
  ): UserResponseDto {
    type RawUser = User & {
      _id?: Types.ObjectId | string;
      id?: Types.ObjectId | string;
      createdAt?: Date;
      updatedAt?: Date;
      merchantId?: Types.ObjectId | string | null;
    };

    const raw = (
      this.isMongooseDocument(user) ? user.toObject() : user
    ) as RawUser;
    const id = raw._id?.toString?.() ?? raw.id?.toString?.() ?? '';

    return {
      id,
      name: raw.name,
      email: raw.email,
      role: raw.role,
      isSystem: raw.isSystem,
      merchantId: this.normalizeId(raw.merchantId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  private normalizeId(
    value?: string | Types.ObjectId | null,
  ): string | undefined {
    if (value === null || value === undefined) return undefined;
    if (typeof value === 'string') return value;
    return value.toString?.();
  }
}
