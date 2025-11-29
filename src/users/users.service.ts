import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    options?: { isSystem?: boolean },
  ): Promise<UserResponseDto> {
    const existing = await this.userModel
      .findOne({ email: createUserDto.email.toLowerCase() })
      .lean();

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userModel.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      isSystem: options?.isSystem ?? false,
    });

    return this.toResponseDto(user);
  }

  async ensureSystemUser(
    name: string,
    email: string,
    password: string,
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

  toResponseDto(user: UserDocument | any): UserResponseDto {
    const raw = (user as any).toObject ? (user as any).toObject() : user;
    const id =
      raw._id?.toString?.() ??
      (raw.id ? raw.id.toString?.() ?? raw.id : undefined);

    return {
      id,
      name: raw.name,
      email: raw.email,
      role: raw.role,
      isSystem: raw.isSystem,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
