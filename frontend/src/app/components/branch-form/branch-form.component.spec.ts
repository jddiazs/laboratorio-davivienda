import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BranchFormComponent } from './branch-form.component';

describe('BranchFormComponent', () => {
  let component: BranchFormComponent;
  let fixture: ComponentFixture<BranchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchFormComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BranchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.branchForm.valid).toBeFalse();
  });

  it('should have a valid form when name and address are filled', () => {
    component.branchForm.patchValue({
      name: 'Test Branch',
      address: 'Test Address'
    });

    expect(component.branchForm.valid).toBeTrue();
  });

  it('should be invalid when name is missing', () => {
    component.branchForm.patchValue({
      name: '',
      address: 'Test Address'
    });

    expect(component.branchForm.get('name')?.valid).toBeFalse();
    expect(component.branchForm.valid).toBeFalse();
  });

  it('should be invalid when address is missing', () => {
    component.branchForm.patchValue({
      name: 'Test Branch',
      address: ''
    });

    expect(component.branchForm.get('address')?.valid).toBeFalse();
    expect(component.branchForm.valid).toBeFalse();
  });

  it('should show "New Branch" title when no branch is provided', () => {
    component.branch = null;

    expect(component.dialogTitle).toBe('New Branch');
  });

  it('should show "Edit Branch" title when a branch is provided', () => {
    component.branch = { id: 1, name: 'Test', address: 'Test' };

    expect(component.dialogTitle).toBe('Edit Branch');
  });

  it('should reset form when dialog opens for new branch', () => {
    component.branchForm.patchValue({ name: 'Old', address: 'Old' });

    component.branch = null;
    component.visible = true;
    component.ngOnChanges({
      visible: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.branchForm.get('name')?.value).toBeFalsy();
    expect(component.branchForm.get('address')?.value).toBeFalsy();
  });

  it('should populate form when dialog opens for edit', () => {
    component.branch = { id: 1, name: 'Main Office', address: '100 Main St' };
    component.visible = true;
    component.ngOnChanges({
      visible: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.branchForm.get('name')?.value).toBe('Main Office');
    expect(component.branchForm.get('address')?.value).toBe('100 Main St');
  });

  it('should emit save with form values for new branch', () => {
    spyOn(component.save, 'emit');
    component.branch = null;
    component.branchForm.patchValue({ name: 'New', address: 'New Address' });

    component.onSave();

    expect(component.save.emit).toHaveBeenCalledWith({
      name: 'New',
      address: 'New Address'
    });
  });

  it('should emit save with id for existing branch', () => {
    spyOn(component.save, 'emit');
    component.branch = { id: 5, name: 'Old', address: 'Old' };
    component.branchForm.patchValue({ name: 'Updated', address: 'Updated Address' });

    component.onSave();

    expect(component.save.emit).toHaveBeenCalledWith({
      id: 5,
      name: 'Updated',
      address: 'Updated Address'
    });
  });

  it('should not emit save when form is invalid', () => {
    spyOn(component.save, 'emit');
    component.branchForm.patchValue({ name: '', address: '' });

    component.onSave();

    expect(component.save.emit).not.toHaveBeenCalled();
  });

  it('should emit cancel when cancel is clicked', () => {
    spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should mark all fields as touched on save attempt with empty form', () => {
    expect(component.branchForm.get('name')?.touched).toBeFalse();
    expect(component.branchForm.get('address')?.touched).toBeFalse();

    component.onSave();

    expect(component.branchForm.get('name')?.touched).toBeTrue();
    expect(component.branchForm.get('address')?.touched).toBeTrue();
  });

  it('should mark fields as touched when a required field is cleared during edit', () => {
    component.branch = { id: 1, name: 'Main Office', address: '100 Main St' };
    component.visible = true;
    component.ngOnChanges({
      visible: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    component.branchForm.patchValue({ name: '' });

    component.onSave();

    expect(component.branchForm.get('name')?.touched).toBeTrue();
    expect(component.branchForm.get('name')?.invalid).toBeTrue();
  });
});
