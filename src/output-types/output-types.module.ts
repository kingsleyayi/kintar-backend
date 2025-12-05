import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { OutputTypesService } from './output-types.service';
import { OutputTypesController } from './output-types.controller';
import { OutputType, OutputTypeSchema } from './schemas/output-type.schema';

@Module({
  imports: [
    CatalogsModule,
    MongooseModule.forFeature([
      { name: OutputType.name, schema: OutputTypeSchema },
    ]),
  ],
  controllers: [OutputTypesController],
  providers: [OutputTypesService],
})
export class OutputTypesModule {}
