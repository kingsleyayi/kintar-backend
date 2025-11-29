import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async seedSystemUser(): Promise<UserResponseDto> {
    const name = this.configService.get<string>('SYSTEM_ADMIN_NAME');
    const email = this.configService.get<string>('SYSTEM_ADMIN_EMAIL');
    const password = this.configService.get<string>('SYSTEM_ADMIN_PASSWORD');

    if (!name || !email || !password) {
      throw new Error(
        'Missing SYSTEM_ADMIN_* environment variables for seeding.',
      );
    }

    this.logger.log(`Ensuring system user exists for ${email}`);
    const user = await this.usersService.ensureSystemUser(
      name,
      email.toLowerCase(),
      password,
    );
    this.logger.log(`System user ready with email ${user.email}`);

    return user;
  }
}
