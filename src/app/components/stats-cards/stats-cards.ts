import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [],
  template: `
    <div class="stats-container">
      <div class="card">
        <h3>Active Employees</h3>
        <p class="count">{{ totalEmployees() }}</p>
      </div>
      <div class="card">
        <h3>Departments</h3>
        <p class="count">{{ totalDepartments() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex: 1;
      text-align: center;
    }
    .card h3 {
      margin: 0;
      color: #666;
      font-size: 1rem;
    }
    .card .count {
      margin: 10px 0 0;
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsCardsComponent {
  totalEmployees = input<number>(0);
  totalDepartments = input<number>(0);
}
