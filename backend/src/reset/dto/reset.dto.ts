import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class ResetDto {
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
