import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter?: Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT');
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');
    this.from =
      this.configService.get<string>('EMAIL_FROM') || 'no-reply@kintar.local';

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      this.logger.log('Email transport configured.');
    } else {
      this.logger.warn(
        'Email transport not fully configured; emails will be logged only.',
      );
    }
  }

  async sendEmail(input: SendEmailInput): Promise<void> {
    if (!this.transporter) {
      this.logger.log(
        `Email transport not configured. Would send to ${input.to} | Subject: ${input.subject}\n${input.text}`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: this.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html ?? input.text.replace(/\n/g, '<br/>'),
    });
  }

  async sendInvitationEmail(email: string, token: string, inviteUrl: string) {
    const subject = 'Your Kintar invitation';
    const text = [
      'You have been invited to Kintar.',
      'Click the link below to accept your invitation, set your password, and access the dashboard.',
      '',
      `Accept invitation: ${inviteUrl}`,
      '',
      'If the link does not work, you can paste this token in the app:',
      token,
    ].join('\n');

    const html = `
      <p>You have been invited to Kintar.</p>
      <p><a href="${inviteUrl}" style="color:#b36a3d;text-decoration:none;">Accept your invitation</a> to set your password and access the dashboard.</p>
      <p>If the button does not work, you can paste this token in the app:</p>
      <pre style="background:#f3f3f3;padding:8px 12px;border-radius:6px;font-family:monospace;">${token}</pre>
    `;

    await this.sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  }
}
