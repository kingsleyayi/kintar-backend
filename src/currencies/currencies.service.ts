import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency, CurrencyDocument } from './schemas/currency.schema';
import { CurrencyResponseDto } from './dto/currency-response.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<CurrencyDocument>,
  ) {}

  async findAll(): Promise<CurrencyResponseDto[]> {
    const currencies = await this.currencyModel.find().sort({ code: 1 }).exec();
    return currencies.map((currency) => this.toResponse(currency));
  }

  async upsertMany(currencies: Currency[]): Promise<void> {
    const operations = currencies.map((currency) => ({
      updateOne: {
        filter: { code: currency.code.toUpperCase() },
        update: {
          $set: {
            code: currency.code.toUpperCase(),
            name: currency.name,
            symbol: currency.symbol,
          },
        },
        upsert: true,
      },
    }));

    if (operations.length === 0) return;

    await this.currencyModel.bulkWrite(operations, { ordered: false });
  }

  async assertSupported(code: string): Promise<void> {
    const normalized = code.trim().toUpperCase();
    const exists = await this.currencyModel.exists({ code: normalized });
    if (!exists) {
      throw new BadRequestException('Unsupported currency code');
    }
  }

  toResponse(currency: CurrencyDocument): CurrencyResponseDto {
    return {
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
    };
  }
}
