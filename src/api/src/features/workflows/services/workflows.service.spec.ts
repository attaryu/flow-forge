import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowsRepository } from '../repositories/workflows.repository';

const mockRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOneByIdAndTenant: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

const validWorkflowDto = {
  name: 'Test Workflow',
  description: 'A test workflow',
  definition: {
    nodes: [
      { id: '1', type: 'HTTP_CALL', config: { url: 'https://api.example.com', method: 'GET' } },
    ],
    edges: [],
  },
};

const invalidWorkflowDto = {
  name: '',
  definition: {
    nodes: [],
    edges: [],
  },
};

const existingWorkflow = {
  id: 'wf-1',
  tenantId: 'tenant-1',
  name: 'Existing Workflow',
  description: 'Existing description',
  definition: {
    nodes: [
      { id: 'a', type: 'HTTP_CALL', config: { url: 'https://example.com', method: 'GET' } },
    ],
    edges: [],
  },
  version: 1,
  status: 'active',
  createdBy: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  creator: { id: 'user-1', name: 'User', email: 'user@test.com' },
};

describe('WorkflowsService', () => {
  let service: WorkflowsService;
  let repository: jest.Mocked<WorkflowsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowsService,
        { provide: WorkflowsRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<WorkflowsService>(WorkflowsService);
    repository = module.get(WorkflowsRepository) as jest.Mocked<WorkflowsRepository>;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a valid workflow', async () => {
      mockRepository.create.mockResolvedValue({ id: 'new-1', ...validWorkflowDto });

      const result = await service.create('tenant-1', 'user-1', validWorkflowDto);

      expect(result).toEqual({ id: 'new-1', ...validWorkflowDto });
      expect(mockRepository.create).toHaveBeenCalledWith('tenant-1', 'user-1', validWorkflowDto);
    });

    it('should throw BadRequestException for invalid workflow', async () => {
      await expect(
        service.create('tenant-1', 'user-1', invalidWorkflowDto as any)
      ).rejects.toThrow(BadRequestException);

      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for cyclic workflow', async () => {
      const cyclicDto = {
        name: 'Cyclic',
        definition: {
          nodes: [
            { id: 'a', type: 'HTTP_CALL', config: { url: 'https://x.com', method: 'GET' } },
            { id: 'b', type: 'HTTP_CALL', config: { url: 'https://y.com', method: 'GET' } },
          ],
          edges: [
            { from: 'a', to: 'b' },
            { from: 'b', to: 'a' },
          ],
        },
      };

      await expect(
        service.create('tenant-1', 'user-1', cyclicDto)
      ).rejects.toThrow(BadRequestException);

      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for missing definition', async () => {
      const noDefDto = { name: 'Test', definition: { nodes: 'not-array', edges: [] } };

      await expect(
        service.create('tenant-1', 'user-1', noDefDto as any)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all workflows for tenant', async () => {
      mockRepository.findAll.mockResolvedValue([existingWorkflow]);

      const result = await service.findAll('tenant-1');

      expect(result).toEqual([existingWorkflow]);
      expect(mockRepository.findAll).toHaveBeenCalledWith('tenant-1');
    });
  });

  describe('findOne', () => {
    it('should return a workflow by id', async () => {
      mockRepository.findOneByIdAndTenant.mockResolvedValue(existingWorkflow);

      const result = await service.findOne('wf-1', 'tenant-1');

      expect(result).toEqual(existingWorkflow);
      expect(mockRepository.findOneByIdAndTenant).toHaveBeenCalledWith('wf-1', 'tenant-1');
    });

    it('should throw NotFoundException when workflow not found', async () => {
      mockRepository.findOneByIdAndTenant.mockResolvedValue(null);

      await expect(service.findOne('nonexistent', 'tenant-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update with valid data', async () => {
      mockRepository.findOneByIdAndTenant.mockResolvedValue(existingWorkflow);
      mockRepository.update.mockResolvedValue({ ...existingWorkflow, name: 'Updated' });

      const result = await service.update('wf-1', 'tenant-1', { name: 'Updated' });

      expect(result).toEqual({ ...existingWorkflow, name: 'Updated' });
      expect(mockRepository.update).toHaveBeenCalledWith('wf-1', 'tenant-1', { name: 'Updated' });
    });

    it('should validate new definition on update', async () => {
      mockRepository.findOneByIdAndTenant.mockResolvedValue(existingWorkflow);

      await expect(
        service.update('wf-1', 'tenant-1', {
          definition: {
            nodes: [
              { id: 'x', type: 'HTTP_CALL', config: { url: 'https://x.com', method: 'GET' } },
              { id: 'y', type: 'HTTP_CALL', config: { url: 'https://y.com', method: 'GET' } },
            ],
            edges: [
              { from: 'x', to: 'y' },
              { from: 'y', to: 'x' },
            ],
          },
        })
      ).rejects.toThrow(BadRequestException);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should skip validation when definition is not provided', async () => {
      mockRepository.findOneByIdAndTenant.mockResolvedValue(existingWorkflow);
      mockRepository.update.mockResolvedValue({ ...existingWorkflow, name: 'Renamed' });

      const result = await service.update('wf-1', 'tenant-1', { name: 'Renamed' });

      expect(result).toEqual({ ...existingWorkflow, name: 'Renamed' });
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating nonexistent workflow', async () => {
      mockRepository.findOneByIdAndTenant.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', 'tenant-1', { name: 'Nope' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft-delete an existing workflow', async () => {
      mockRepository.findOneByIdAndTenant.mockResolvedValue(existingWorkflow);
      mockRepository.softDelete.mockResolvedValue({ ...existingWorkflow, status: 'archived' });

      const result = await service.remove('wf-1', 'tenant-1');

      expect(result).toEqual({ ...existingWorkflow, status: 'archived' });
      expect(mockRepository.softDelete).toHaveBeenCalledWith('wf-1', 'tenant-1');
    });

    it('should throw NotFoundException when deleting nonexistent workflow', async () => {
      mockRepository.findOneByIdAndTenant.mockResolvedValue(null);

      await expect(service.remove('nonexistent', 'tenant-1')).rejects.toThrow(NotFoundException);
    });
  });
});
