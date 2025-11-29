import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { SendInviteDto } from './dto/send-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AuthService } from '../auth/auth.service';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SystemAdmin)
  @ApiOkResponse({
    schema: {
      properties: {
        token: { type: 'string' },
        email: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  async sendInvite(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SendInviteDto,
  ): Promise<{ token: string; email: string; expiresAt: Date }> {
    return this.invitationsService.sendInvitation(dto, user.userId);
  }

  @Post('accept')
  @ApiOkResponse({
    schema: {
      properties: {
        accessToken: { type: 'string' },
        user: { $ref: '#/components/schemas/UserResponseDto' },
      },
    },
  })
  async acceptInvite(
    @Body() dto: AcceptInviteDto,
  ): Promise<{ accessToken: string; user: UserResponseDto }> {
    const user = await this.invitationsService.acceptInvitation(dto);
    return {
      accessToken: this.authService.createAccessToken(user),
      user,
    };
  }
}
