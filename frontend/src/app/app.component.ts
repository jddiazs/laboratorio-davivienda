import { Component } from '@angular/core';
import { BranchListComponent } from './components/branch-list/branch-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BranchListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Bank Branch Management';
}
