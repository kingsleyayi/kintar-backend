import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes, createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { SendInviteDto } from './dto/send-invite.dto';
import {
  Invitation,
  InvitationDocument,
  InvitationStatus,
} from './schemas/invitation.schema';
import { UsersService } from '../users/users.service';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UserRole } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { MerchantsService } from '../merchants/merchants.service';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<InvitationDocument>,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
    private readonly merchantsService: MerchantsService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private computeExpiry(): Date {
    const hours = this.configService.get<number>('INVITE_EXPIRES_IN_HOURS', 72);
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  async sendInvitation(
    dto: SendInviteDto,
    invitedBy: string,
  ): Promise<{ token: string; email: string; expiresAt: Date }> {
    const normalizedEmail = dto.email.toLowerCase();
    const existingUser = await this.usersService.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException('User already exists for this email');
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = this.computeExpiry();

    await this.invitationModel.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        tokenHash,
        expiresAt,
        status: InvitationStatus.Pending,
        invitedBy,
        acceptedAt: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await this.notificationsService.sendInvitation(normalizedEmail, token);

    return { token, email: normalizedEmail, expiresAt };
  }

  async acceptInvitation(dto: AcceptInviteDto): Promise<UserResponseDto> {
    const tokenHash = this.hashToken(dto.token);
    const invitation = await this.invitationModel.findOne({ tokenHash }).exec();

    if (!invitation) {
      throw new UnauthorizedException('Invalid or unknown invitation token');
    }

    if (invitation.status === InvitationStatus.Accepted) {
      throw new ConflictException('Invitation already accepted');
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      invitation.status = InvitationStatus.Expired;
      await invitation.save();
      throw new UnauthorizedException('Invitation token has expired');
    }

    const existingUser = await this.usersService.findByEmail(invitation.email);
    if (existingUser) {
      throw new ConflictException('User already exists for this invitation');
    }

    const merchantName = `${dto.name} (${invitation.email})`;
    const merchant = await this.merchantsService.ensure(merchantName);
    const merchantId =
      (merchant as { _id?: string; id?: string })._id?.toString?.() ??
      (merchant as { _id?: string; id?: string }).id?.toString?.();

    const user = await this.usersService.create(
      {
        name: dto.name,
        email: invitation.email,
        password: dto.password,
        role: UserRole.User,
        merchantId,
      },
      { isSystem: false, merchantId },
    );

    if (merchantId) {
      await this.merchantsService.setOwner(merchantId, user.id);
    }

    invitation.status = InvitationStatus.Accepted;
    invitation.acceptedAt = new Date();
    await invitation.save();

    return user;
  }
}
