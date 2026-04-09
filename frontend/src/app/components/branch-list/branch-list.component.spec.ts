import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BranchListComponent } from './branch-list.component';
import { BranchService } from '../../services/branch.service';

describe('BranchListComponent', () => {
  let component: BranchListComponent;
  let fixture: ComponentFixture<BranchListComponent>;
  let branchService: BranchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchListComponent, NoopAnimationsModule],
      providers: [ConfirmationService, MessageService]
    }).compileComponents();

    fixture = TestBed.createComponent(BranchListComponent);
    component = fixture.componentInstance;
    branchService = TestBed.inject(BranchService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty message when no branches exist', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No branches found.');
  });

  it('should display branches in the table', () => {
    branchService.create({ name: 'Main Office', address: '100 Main St' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Main Office');
    expect(compiled.textContent).toContain('100 Main St');
  });

  it('should have a New Branch button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button.p-button-success');
    expect(button).toBeTruthy();
    expect(button?.textContent).toContain('New Branch');
  });

  it('should open dialog when New Branch is clicked', () => {
    expect(component.displayDialog).toBeFalse();

    component.openNew();

    expect(component.displayDialog).toBeTrue();
    expect(component.selectedBranch).toBeNull();
  });

  it('should open dialog with branch data when edit is clicked', () => {
    const branch = branchService.create({ name: 'Test', address: 'Test Address' });

    component.editBranch(branch);

    expect(component.displayDialog).toBeTrue();
    expect(component.selectedBranch).toEqual(branch);
  });

  it('should display edit and delete buttons for each branch', () => {
    branchService.create({ name: 'Branch A', address: 'Address A' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const editButton = compiled.querySelector('button.p-button-info');
    const deleteButton = compiled.querySelector('button.p-button-danger');

    expect(editButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
  });

  it('should close dialog on cancel', () => {
    component.displayDialog = true;

    component.onCancel();

    expect(component.displayDialog).toBeFalse();
  });

  it('should create a branch on save without id', () => {
    spyOn(branchService, 'create').and.callThrough();

    component.onSave({ name: 'New', address: 'New Address' });

    expect(branchService.create).toHaveBeenCalledWith({ name: 'New', address: 'New Address' });
    expect(component.displayDialog).toBeFalse();
  });

  it('should update a branch on save with id', () => {
    spyOn(branchService, 'update').and.callThrough();

    component.onSave({ id: 1, name: 'Updated', address: 'Updated Address' });

    expect(branchService.update).toHaveBeenCalledWith({ id: 1, name: 'Updated', address: 'Updated Address' });
    expect(component.displayDialog).toBeFalse();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['subscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });

  describe('search and filter', () => {
    it('should render a search input in the toolbar', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const searchInput = compiled.querySelector('input[pInputText]');
      expect(searchInput).toBeTruthy();
      expect(searchInput?.getAttribute('placeholder')).toBe('Search branches...');
    });

    it('should filter branches by name', () => {
      branchService.create({ name: 'Main Office', address: '100 Main St' });
      branchService.create({ name: 'Downtown', address: '200 Oak Ave' });
      fixture.detectChanges();

      spyOn(component.table, 'filterGlobal');
      const event = { target: { value: 'Main' } } as unknown as Event;
      component.onSearch(event);

      expect(component.table.filterGlobal).toHaveBeenCalledWith('Main', 'contains');
    });

    it('should filter branches by address', () => {
      branchService.create({ name: 'Main Office', address: '100 Main St' });
      branchService.create({ name: 'Downtown', address: '200 Oak Ave' });
      fixture.detectChanges();

      spyOn(component.table, 'filterGlobal');
      const event = { target: { value: 'Oak' } } as unknown as Event;
      component.onSearch(event);

      expect(component.table.filterGlobal).toHaveBeenCalledWith('Oak', 'contains');
    });

    it('should show no results message when filter matches nothing', () => {
      branchService.create({ name: 'Main Office', address: '100 Main St' });
      fixture.detectChanges();

      component.table.filterGlobal('nonexistent', 'contains');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const emptyMessage = compiled.querySelector('tr td');
      expect(emptyMessage?.textContent).toContain('No branches found.');
    });

    it('should clear the search filter', () => {
      fixture.detectChanges();
      component.searchValue = 'test';

      spyOn(component.table, 'filterGlobal');
      component.clearSearch();

      expect(component.searchValue).toBe('');
      expect(component.table.filterGlobal).toHaveBeenCalledWith('', 'contains');
    });
  });
});
