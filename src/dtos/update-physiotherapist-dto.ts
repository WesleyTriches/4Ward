import { PartialType } from '@nestjs/mapped-types';
import { CreatePhysiotherapistDto } from './create-physiotherapist-dto';

export class UpdatePhysiotherapistDto extends PartialType(
  CreatePhysiotherapistDto,
) {}
