import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { targetConstructorToSchema } from 'class-validator-jsonschema';

import { SDXLStyle } from '../../../enums/index.js';

export class CreateImageDto {
  @Type(() => String)
  @IsNotEmpty()
  @Length(1, 1000)
  prompt!: string;

  @Type(() => String)
  @IsOptional()
  @IsEnum(SDXLStyle)
  style?: string;
}

export const createImageSchema = targetConstructorToSchema(CreateImageDto);