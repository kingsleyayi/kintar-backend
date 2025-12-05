import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Merchant, MerchantSchema } from './schemas/merchant.schema';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Merchant.name, schema: MerchantSchema },
    ]),
    CurrenciesModule,
  ],
  controllers: [MerchantsController],
  providers: [MerchantsService],
  exports: [MerchantsService],
})
export class MerchantsModule {}
