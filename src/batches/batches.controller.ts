import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchResponseDto } from './dto/batch-response.dto';
import { BatchesService } from './batches.service';

@ApiTags('Batches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new batch/group tied to a catalog' })
  @ApiOkResponse({ type: BatchResponseDto })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBatchDto,
  ): Promise<BatchResponseDto> {
    if (!user.merchantId) {
      throw new Error('merchantId missing on user token');
    }
    return this.batchesService.create(dto, user.userId, user.merchantId);
  }

  @Get()
  @ApiOperation({ summary: 'List batches created by the current user' })
  @ApiOkResponse({ type: [BatchResponseDto] })
  async findMine(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BatchResponseDto[]> {
    return this.batchesService.findAllForUser(user.userId);
  }
}
