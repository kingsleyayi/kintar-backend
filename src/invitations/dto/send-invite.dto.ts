import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendInviteDto {
  @ApiProperty({ example: 'new.user@example.com' })
  @IsEmail()
  email: string;
}
