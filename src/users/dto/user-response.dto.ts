import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  isSystem: boolean;

  @ApiProperty({ required: false })
  merchantId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
