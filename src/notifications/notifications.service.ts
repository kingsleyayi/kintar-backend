import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  private buildInviteUrl(token: string): string {
    const frontendBase =
      this.configService.get<string>('FRONTEND_APP_URL') ||
      'http://localhost:5173';
    const base = frontendBase.replace(/\/$/, '');
    return `${base}/onboarding?invite=${encodeURIComponent(token)}`;
  }

  async sendInvitation(email: string, token: string): Promise<void> {
    const inviteUrl = this.buildInviteUrl(token);
    await this.emailService.sendInvitationEmail(email, token, inviteUrl);
  }
}
