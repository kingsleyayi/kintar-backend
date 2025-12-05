import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Types } from 'mongoose';
import { AppModule } from '../app.module';
import { MerchantsService } from '../merchants/merchants.service';
import { Model } from 'mongoose';
import { Batch, BatchDocument } from '../batches/schemas/batch.schema';
import {
  OutputType,
  OutputTypeDocument,
} from '../output-types/schemas/output-type.schema';

async function bootstrap() {
  const logger = new Logger('BackfillMerchant');
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const merchantsService = appContext.get(MerchantsService);
    const batchModel = appContext.get<Model<BatchDocument>>(
      getModelTokenSafe(Batch.name),
    );
    const outputTypeModel = appContext.get<Model<OutputTypeDocument>>(
      getModelTokenSafe(OutputType.name),
    );

    const defaultName =
      process.env.BACKFILL_MERCHANT_NAME || 'Default Merchant';
    const merchant = await merchantsService.ensure(defaultName);
    const merchantId = new Types.ObjectId(
      (
        merchant as {
          _id?: Types.ObjectId | string;
          id?: Types.ObjectId | string;
        }
      )._id?.toString?.() ??
        (
          merchant as {
            _id?: Types.ObjectId | string;
            id?: Types.ObjectId | string;
          }
        ).id?.toString?.() ??
        defaultName,
    );

    logger.log(`Using merchant "${merchant.name}" (${merchantId})`);

    logger.log('Backfilling users...');
    await appContext
      .get('UserModel')
      .updateMany(
        { $or: [{ merchantId: { $exists: false } }, { merchantId: '' }] },
        { $set: { merchantId } },
      )
      .exec();

    logger.log('Backfilling batches...');
    await batchModel
      .updateMany(
        { $or: [{ merchantId: { $exists: false } }, { merchantId: null }] },
        { $set: { merchantId } },
      )
      .exec();

    logger.log('Backfilling output types...');
    await outputTypeModel
      .updateMany(
        { $or: [{ merchantId: { $exists: false } }, { merchantId: null }] },
        { $set: { merchantId } },
      )
      .exec();

    logger.log('Backfill complete.');
  } catch (error) {
    logger.error('Backfill failed', error);
  } finally {
    await appContext.close();
  }
}

function getModelTokenSafe(modelName: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getModelToken } = require('@nestjs/mongoose');
    return getModelToken(modelName);
  } catch {
    return modelName;
  }
}

bootstrap();
