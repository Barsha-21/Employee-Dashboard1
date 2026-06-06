import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-department-filter',
  standalone: true,
  imports: [],
  template: `
    <div class="filter-container">
      <label for="dept-select">Filter by Department:</label>
      <select 
        id="dept-select"
        [value]="selectedDepartment()" 
        (change)="onFilterChange($event)"
        class="filter-select"
      >
        <option value="">All Departments</option>
        @for (dept of departments(); track dept) {
          <option [value]="dept">{{ dept }}</option>
        }
      </select>
    </div>
  `,
  styles: [`
    .filter-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    label {
      font-weight: 600;
      color: #2c3e50;
      white-space: nowrap;
    }

    .filter-select {
      padding: 10px 12px;
      border: 2px solid #ecf0f1;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: border-color 0.3s;
      min-width: 200px;
    }

    .filter-select:hover {
      border-color: #3498db;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentFilterComponent {
  departments = input<string[]>([]);
  selectedDepartment = input<string>('');
  filterChanged = output<string>();

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filterChanged.emit(value);
  }
}
