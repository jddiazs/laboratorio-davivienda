import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Branch } from '../models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private branches: Branch[] = [];
  private branchesSubject = new BehaviorSubject<Branch[]>([]);
  private nextId = 1;

  getBranches(): Observable<Branch[]> {
    return this.branchesSubject.asObservable();
  }

  create(branch: Omit<Branch, 'id'>): Branch {
    const newBranch: Branch = {
      id: this.nextId++,
      name: branch.name,
      address: branch.address
    };
    this.branches = [...this.branches, newBranch];
    this.branchesSubject.next(this.branches);
    return newBranch;
  }

  update(branch: Branch): Branch | null {
    const index = this.branches.findIndex(b => b.id === branch.id);
    if (index === -1) {
      return null;
    }
    this.branches = this.branches.map(b => b.id === branch.id ? { ...branch } : b);
    this.branchesSubject.next(this.branches);
    return branch;
  }

  delete(id: number): boolean {
    const index = this.branches.findIndex(b => b.id === id);
    if (index === -1) {
      return false;
    }
    this.branches = this.branches.filter(b => b.id !== id);
    this.branchesSubject.next(this.branches);
    return true;
  }
}
