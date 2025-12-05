import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { Batch, BatchSchema } from './schemas/batch.schema';

@Module({
  imports: [
    CatalogsModule,
    MongooseModule.forFeature([{ name: Batch.name, schema: BatchSchema }]),
  ],
  controllers: [BatchesController],
  providers: [BatchesService],
})
export class BatchesModule {}
