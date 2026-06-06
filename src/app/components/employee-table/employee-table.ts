import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <div class="table-container">
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Search by name..." 
          [value]="searchTerm()"
          (input)="onSearch($event)"
          aria-label="Search employees by name"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          @for (employee of employees(); track employee.id) {
            <tr>
              <td>{{ employee.name }}</td>
              <td>{{ employee.department }}</td>
              <td>{{ employee.salary | currency }}</td>
            </tr>
          }
          @if (employees().length === 0) {
            <tr>
              <td colspan="3" class="no-data">No employees found.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .search-bar {
      margin-bottom: 20px;
    }
    .search-bar input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    th {
      background: #f9f9f9;
      color: #666;
    }
    tr:hover {
      background: #f5f5f5;
    }
    .no-data {
      text-align: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeTableComponent {
  employees = input<Employee[]>([]);
  search = output<string>();
  
  protected readonly searchTerm = signal<string>('');

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.search.emit(term);
  }
}
