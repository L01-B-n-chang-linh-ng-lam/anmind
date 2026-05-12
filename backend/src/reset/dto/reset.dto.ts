import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Client-generated UUID for deduplication' })
  @IsUUID()
  external_id: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 30, description: 'Session duration in minutes' })
  @IsInt()
  @Min(1)
  @Max(30)
  duration_minutes: number;

  @ApiProperty({ example: 2, minimum: 1, maximum: 5, description: 'Mood score before session (1=stressed, 5=calm)' })
  @IsInt()
  @Min(1)
  @Max(5)
  score_before: number;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5, description: 'Mood score after session (1=stressed, 5=calm)' })
  @IsInt()
  @Min(1)
  @Max(5)
  score_after: number;

  @ApiProperty({ example: '2026-05-12T10:00:00.000Z' })
  @IsDateString()
  started_at: string;

  @ApiPropertyOptional({ example: '2026-05-12T10:05:00.000Z' })
  @IsDateString()
  @IsOptional()
  ended_at?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
