export class OrganizationResponseDto {
  id!: string;
  name!: string;
  role!: 'owner' | 'editor' | 'viewer';
}
