import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Branch } from '../../models/branch.model';
import { BranchService } from '../../services/branch.service';
import { BranchFormComponent } from '../branch-form/branch-form.component';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    BranchFormComponent
  ],
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table!: Table;
  branches: Branch[] = [];
  displayDialog = false;
  selectedBranch: Branch | null = null;
  searchValue = '';
  private subscription!: Subscription;

  constructor(
    private branchService: BranchService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.subscription = this.branchService.getBranches().subscribe(branches => {
      this.branches = branches;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openNew(): void {
    this.selectedBranch = null;
    this.displayDialog = true;
  }

  editBranch(branch: Branch): void {
    this.selectedBranch = { ...branch };
    this.displayDialog = true;
  }

  deleteBranch(branch: Branch): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete branch "${branch.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.branchService.delete(branch.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Branch deleted'
        });
      }
    });
  }

  onSave(branch: Omit<Branch, 'id'> & { id?: number }): void {
    if (branch.id) {
      this.branchService.update(branch as Branch);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Branch updated'
      });
    } else {
      this.branchService.create(branch);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Branch created'
      });
    }
    this.displayDialog = false;
  }

  onCancel(): void {
    this.displayDialog = false;
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(value, 'contains');
  }

  clearSearch(): void {
    this.searchValue = '';
    this.table.filterGlobal('', 'contains');
  }
}
