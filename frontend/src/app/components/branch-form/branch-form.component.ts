import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss']
})
export class BranchFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() branch: Branch | null = null;
  @Output() save = new EventEmitter<Omit<Branch, 'id'> & { id?: number }>();
  @Output() cancel = new EventEmitter<void>();

  branchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      if (this.branch) {
        this.branchForm.patchValue({
          name: this.branch.name,
          address: this.branch.address
        });
      } else {
        this.branchForm.reset();
      }
    }
  }

  get dialogTitle(): string {
    return this.branch ? 'Edit Branch' : 'New Branch';
  }

  onSave(): void {
    if (this.branchForm.valid) {
      const formValue = this.branchForm.value;
      if (this.branch) {
        this.save.emit({ id: this.branch.id, ...formValue });
      } else {
        this.save.emit(formValue);
      }
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
