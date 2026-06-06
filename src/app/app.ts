import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { StatsCardsComponent } from './components/stats-cards/stats-cards';
import { EmployeeTableComponent } from './components/employee-table/employee-table';
import { DepartmentFilterComponent } from './components/department-filter/department-filter';
import { EmployeeModalComponent } from './components/employee-modal/employee-modal';
import { Employee } from './models/employee.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    StatsCardsComponent, 
    EmployeeTableComponent, 
    DepartmentFilterComponent,
    EmployeeModalComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>👔 Employee Dashboard</h1>
        <p class="subtitle">Manage and view employee information</p>
      </header>
      
      <main class="app-main">
        <app-stats-cards 
          [activeEmployees]="employeeService.activeEmployees()"
          [totalEmployees]="employeeService.totalEmployees()"
          [totalDepartments]="employeeService.totalDepartments()"
          [salaries]="salaries()"
        />

        <app-department-filter 
          [departments]="employeeService.departments()"
          [selectedDepartment]="selectedDepartment()"
          (filterChanged)="onDepartmentFilter($event)"
        />

        <app-employee-table 
          [employees]="filteredByDepartment()"
          (search)="onSearch($event)"
          (viewDetails)="onViewDetails($event)"
          (deleteEmployee)="onDeleteEmployee($event)"
        />

        <app-employee-modal 
          [isOpen]="modalOpen()"
          [employee]="selectedEmployee()"
          (closed)="closeModal()"
          (deleted)="onConfirmDelete($event)"
        />
      </main>

      <footer class="app-footer">
        <p>&copy; 2024 Employee Management System. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .app-header h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .subtitle {
      margin: 10px 0 0;
      font-size: 1.1rem;
      opacity: 0.95;
    }

    .app-main {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 30px 20px;
      flex: 1;
    }

    .app-footer {
      background: rgba(0, 0, 0, 0.05);
      padding: 20px;
      text-align: center;
      color: #666;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .app-footer p {
      margin: 0;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 1.8rem;
      }

      .app-main {
        padding: 20px 16px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly employeeService = inject(EmployeeService);
  
  private readonly searchTerm = signal<string>('');
  private readonly selectedDepartmentFilter = signal<string>('');
  private readonly modalOpenSignal = signal(false);
  private readonly selectedEmployeeSignal = signal<Employee | null>(null);

  readonly filteredByDepartment = computed(() => {
    const dept = this.selectedDepartmentFilter();
    const term = this.searchTerm().toLowerCase().trim();
    
    let employees = dept 
      ? this.employeeService.employees().filter(e => e.department === dept)
      : this.employeeService.employees();

    if (term) {
      employees = employees.filter(e => 
        e.name.toLowerCase().includes(term) ||
        e.position.toLowerCase().includes(term) ||
        e.department.toLowerCase().includes(term)
      );
    }

    return employees;
  });

  readonly salaries = computed(() => this.employeeService.employees().map(e => e.salary));

  readonly selectedDepartment = computed(() => this.selectedDepartmentFilter());

  readonly modalOpen = computed(() => this.modalOpenSignal());

  readonly selectedEmployee = computed(() => this.selectedEmployeeSignal());

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  onDepartmentFilter(department: string): void {
    this.selectedDepartmentFilter.set(department);
  }

  onViewDetails(employee: Employee): void {
    this.selectedEmployeeSignal.set(employee);
    this.modalOpenSignal.set(true);
  }

  closeModal(): void {
    this.modalOpenSignal.set(false);
    this.selectedEmployeeSignal.set(null);
  }

  onDeleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id);
    }
  }

  onConfirmDelete(id: number): void {
    this.employeeService.deleteEmployee(id);
  }
}
