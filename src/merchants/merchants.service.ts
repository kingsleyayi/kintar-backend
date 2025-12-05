import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Merchant, MerchantDocument } from './schemas/merchant.schema';
import { MerchantResponseDto } from './dto/merchant-response.dto';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,
    private readonly currenciesService: CurrenciesService,
  ) {}

  async create(
    name: string,
    ownerId?: string,
    displayCurrency?: string,
  ): Promise<Merchant> {
    const normalizedCurrency = displayCurrency
      ? displayCurrency.trim().toUpperCase()
      : undefined;
    if (normalizedCurrency) {
      await this.currenciesService.assertSupported(normalizedCurrency);
    }

    return this.merchantModel.create({
      name: name.trim(),
      ownerId: ownerId ? new Types.ObjectId(ownerId) : undefined,
      displayCurrency: normalizedCurrency,
    });
  }

  async ensure(
    name: string,
    ownerId?: string,
    displayCurrency?: string,
  ): Promise<Merchant> {
    const existing = await this.merchantModel.findOne({ name }).lean();
    if (existing) {
      return existing as Merchant;
    }
    return this.create(name, ownerId, displayCurrency);
  }

  async findById(merchantId: string): Promise<MerchantDocument | null> {
    return this.merchantModel.findById(merchantId).exec();
  }

  async setOwner(merchantId: string, ownerId: string): Promise<void> {
    await this.merchantModel
      .updateOne(
        { _id: merchantId },
        { $set: { ownerId: new Types.ObjectId(ownerId) } },
      )
      .exec();
  }

  async updateDisplayCurrency(
    merchantId: string,
    displayCurrency: string,
  ): Promise<MerchantResponseDto> {
    const normalizedCurrency = displayCurrency.trim().toUpperCase();
    await this.currenciesService.assertSupported(normalizedCurrency);

    const merchant = await this.merchantModel
      .findByIdAndUpdate(
        merchantId,
        { $set: { displayCurrency: normalizedCurrency } },
        { new: true },
      )
      .exec();

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return this.toResponseDto(merchant);
  }

  toResponseDto(
    merchant:
      | MerchantDocument
      | (Merchant & {
          _id?: Types.ObjectId | string;
          id?: Types.ObjectId | string;
          createdAt?: Date;
          updatedAt?: Date;
          ownerId?: Types.ObjectId | string | null;
          displayCurrency?: string;
        }),
  ): MerchantResponseDto {
    type RawMerchant = Merchant & {
      _id?: Types.ObjectId | string;
      id?: Types.ObjectId | string;
      createdAt?: Date;
      updatedAt?: Date;
      ownerId?: Types.ObjectId | string | null;
      displayCurrency?: string;
    };

    const raw = (
      this.isMongooseDocument(merchant) ? merchant.toObject() : merchant
    ) as RawMerchant;

    return {
      id: raw._id?.toString?.() ?? raw.id?.toString?.() ?? '',
      name: raw.name,
      ownerId: this.normalizeId(raw.ownerId),
      displayCurrency: raw.displayCurrency,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  private isMongooseDocument(
    merchant: MerchantDocument | Merchant,
  ): merchant is MerchantDocument {
    return typeof (merchant as MerchantDocument).toObject === 'function';
  }

  private normalizeId(
    value?: string | Types.ObjectId | null,
  ): string | undefined {
    if (value === null || value === undefined) return undefined;
    if (typeof value === 'string') return value;
    return value.toString?.();
  }
}
