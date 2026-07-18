import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsObject({
    message: 'Definition must be an object containing nodes and edges',
  })
  @IsNotEmpty({ message: 'Definition is required' })
  definition!: Record<string, any>;
}
