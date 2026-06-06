import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { StatsCardsComponent } from './components/stats-cards/stats-cards';
import { EmployeeTableComponent } from './components/employee-table/employee-table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StatsCardsComponent, EmployeeTableComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>Employee Dashboard</h1>
      </header>
      
      <main>
        <app-stats-cards 
          [totalEmployees]="employeeService.totalEmployees()"
          [totalDepartments]="employeeService.totalDepartments()"
        />

        <app-employee-table 
          [employees]="filteredEmployees()"
          (search)="onSearch($event)"
        />
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f7f6;
      min-height: 100vh;
    }
    header {
      margin-bottom: 30px;
    }
    h1 {
      margin: 0;
      color: #333;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly employeeService = inject(EmployeeService);
  private readonly searchTerm = signal<string>('');

  readonly filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.employeeService.employees();
    }
    return this.employeeService.employees().filter(e => 
      e.name.toLowerCase().includes(term)
    );
  });

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }
}
