import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class SyncItemDto {
  @IsUUID()
  external_id: string;

  @IsInt()
  @Min(1)
  @Max(30)
  duration_minutes: number;

  @IsInt()
  @Min(1)
  @Max(5)
  score_before: number;

  @IsInt()
  @Min(1)
  @Max(5)
  score_after: number;

  @IsDateString()
  started_at: string;

  @IsDateString()
  @IsOptional()
  ended_at?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export class SyncDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncItemDto)
  sessions: SyncItemDto[];
}
