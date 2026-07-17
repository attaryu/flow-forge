export class UserResponseDto {
  id!: string;
  name!: string;
  email!: string;
}

export class WorkflowResponseDto {
  id!: string;
  tenantId!: string;
  name!: string;
  description?: string | null;
  definition!: any;
  version!: number;
  status!: string;
  createdBy!: string;
  createdAt!: Date;
  updatedAt!: Date;
  creator?: UserResponseDto;
}
