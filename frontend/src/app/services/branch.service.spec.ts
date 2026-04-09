import { TestBed } from '@angular/core/testing';
import { BranchService } from './branch.service';
import { Branch } from '../models/branch.model';

describe('BranchService', () => {
  let service: BranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBranches', () => {
    it('should return an empty array initially', (done) => {
      service.getBranches().subscribe(branches => {
        expect(branches).toEqual([]);
        done();
      });
    });

    it('should return branches after creation', (done) => {
      service.create({ name: 'Main Branch', address: '123 Main St' });

      service.getBranches().subscribe(branches => {
        expect(branches.length).toBe(1);
        expect(branches[0].name).toBe('Main Branch');
        done();
      });
    });
  });

  describe('create', () => {
    it('should create a branch with auto-generated id', () => {
      const branch = service.create({ name: 'Downtown', address: '456 Oak Ave' });

      expect(branch.id).toBe(1);
      expect(branch.name).toBe('Downtown');
      expect(branch.address).toBe('456 Oak Ave');
    });

    it('should assign incremental ids to new branches', () => {
      const first = service.create({ name: 'Branch A', address: 'Address A' });
      const second = service.create({ name: 'Branch B', address: 'Address B' });

      expect(first.id).toBe(1);
      expect(second.id).toBe(2);
    });

    it('should notify subscribers when a branch is created', (done) => {
      let callCount = 0;
      service.getBranches().subscribe(branches => {
        callCount++;
        if (callCount === 2) {
          expect(branches.length).toBe(1);
          done();
        }
      });

      service.create({ name: 'New Branch', address: 'New Address' });
    });
  });

  describe('update', () => {
    it('should update an existing branch', () => {
      const created = service.create({ name: 'Old Name', address: 'Old Address' });
      const updated = service.update({ ...created, name: 'New Name', address: 'New Address' });

      expect(updated).toBeTruthy();
      expect(updated!.name).toBe('New Name');
      expect(updated!.address).toBe('New Address');
    });

    it('should return null when updating a non-existent branch', () => {
      const result = service.update({ id: 999, name: 'Test', address: 'Test' });

      expect(result).toBeNull();
    });

    it('should notify subscribers when a branch is updated', (done) => {
      const created = service.create({ name: 'Original', address: 'Original' });
      let callCount = 0;

      service.getBranches().subscribe(branches => {
        callCount++;
        if (callCount === 2) {
          expect(branches[0].name).toBe('Updated');
          done();
        }
      });

      service.update({ ...created, name: 'Updated' });
    });
  });

  describe('delete', () => {
    it('should delete an existing branch', (done) => {
      const created = service.create({ name: 'To Delete', address: 'Address' });
      const result = service.delete(created.id);

      expect(result).toBeTrue();

      service.getBranches().subscribe(branches => {
        expect(branches.length).toBe(0);
        done();
      });
    });

    it('should return false when deleting a non-existent branch', () => {
      const result = service.delete(999);

      expect(result).toBeFalse();
    });

    it('should not affect other branches when deleting one', (done) => {
      service.create({ name: 'Branch A', address: 'Address A' });
      const branchB = service.create({ name: 'Branch B', address: 'Address B' });

      service.delete(1);

      service.getBranches().subscribe(branches => {
        expect(branches.length).toBe(1);
        expect(branches[0].id).toBe(branchB.id);
        done();
      });
    });
  });
});
