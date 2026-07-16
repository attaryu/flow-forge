import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateWorkflowDto {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsObject({ message: 'Definition must be an object' })
  @IsOptional()
  definition?: Record<string, any>;
}
