import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

type SortField = 'name' | 'department' | 'salary' | 'position';
type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, UpperCasePipe],
  template: `
    <div class="table-container">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="🔍 Search by name..." 
          [value]="searchTerm()"
          (input)="onSearch($event)"
          aria-label="Search employees by name"
          class="search-input"
        />
      </div>

      <div class="table-wrapper">
        <table class="employees-table">
          <thead>
            <tr>
              <th (click)="toggleSort('name')" class="sortable">
                Name {{ getSortIndicator('name') }}
              </th>
              <th (click)="toggleSort('position')" class="sortable">
                Position {{ getSortIndicator('position') }}
              </th>
              <th (click)="toggleSort('department')" class="sortable">
                Department {{ getSortIndicator('department') }}
              </th>
              <th (click)="toggleSort('salary')" class="sortable">
                Salary {{ getSortIndicator('salary') }}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (employee of sortedEmployees(); track employee.id) {
              <tr>
                <td class="name-cell">{{ employee.name }}</td>
                <td>{{ employee.position }}</td>
                <td><span class="dept-badge">{{ employee.department }}</span></td>
                <td class="salary-cell">{{ employee.salary | currency }}</td>
                <td>
                  <span class="status-badge" [class.active]="employee.status === 'active'" [class.inactive]="employee.status === 'inactive'">
                    {{ employee.status | uppercase }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-view" (click)="onViewDetails(employee)" title="View details">👁️</button>
                  <button class="btn-delete" (click)="onDelete(employee.id)" title="Delete employee">🗑️</button>
                </td>
              </tr>
            }
            @if (sortedEmployees().length === 0) {
              <tr class="no-data-row">
                <td colspan="6" class="no-data">No employees found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        <p>Showing {{ sortedEmployees().length }} of {{ totalEmployees() }} employees</p>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .search-bar {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .employees-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }

    thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    th {
      color: white;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: default;
      user-select: none;
    }

    th.sortable {
      cursor: pointer;
      transition: all 0.2s;
    }

    th.sortable:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6b3fa0 100%);
    }

    td {
      padding: 14px 16px;
      border-bottom: 1px solid #ecf0f1;
      color: #2c3e50;
    }

    tbody tr {
      transition: background 0.2s;
    }

    tbody tr:hover {
      background: #f8f9fa;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .name-cell {
      font-weight: 600;
      color: #2c3e50;
    }

    .dept-badge {
      display: inline-block;
      background: #e3f2fd;
      color: #1976d2;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .salary-cell {
      color: #27ae60;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-badge.active {
      background: #d5f4e6;
      color: #27ae60;
    }

    .status-badge.inactive {
      background: #fadbd8;
      color: #e74c3c;
    }

    .actions-cell {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 6px;
      transition: all 0.2s;
      border-radius: 4px;
    }

    .btn-view:hover {
      background: #e3f2fd;
      transform: scale(1.2);
    }

    .btn-delete:hover {
      background: #fadbd8;
      transform: scale(1.2);
    }

    .no-data-row td {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
      font-style: italic;
    }

    .table-footer {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #ecf0f1;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .table-footer p {
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeTableComponent {
  employees = input<Employee[]>([]);
  search = output<string>();
  viewDetails = output<Employee>();
  deleteEmployee = output<number>();

  protected readonly searchTerm = signal<string>('');
  private readonly sortField = signal<SortField>('name');
  private readonly sortOrder = signal<SortOrder>('asc');

  readonly totalEmployees = computed(() => this.employees().length);

  readonly sortedEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const filtered = term 
      ? this.employees().filter(e => 
          e.name.toLowerCase().includes(term) ||
          e.position.toLowerCase().includes(term) ||
          e.department.toLowerCase().includes(term)
        )
      : this.employees();

    const field = this.sortField();
    const order = this.sortOrder();

    return [...filtered].sort((a, b) => {
      let aVal: any = a[field];
      let bVal: any = b[field];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  });

  getSortIndicator(field: SortField): string {
    if (this.sortField() !== field) return '⇅';
    return this.sortOrder() === 'asc' ? '↑' : '↓';
  }

  toggleSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortOrder.update(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortOrder.set('asc');
    }
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.search.emit(term);
  }

  onViewDetails(employee: Employee): void {
    this.viewDetails.emit(employee);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.deleteEmployee.emit(id);
    }
  }
}
