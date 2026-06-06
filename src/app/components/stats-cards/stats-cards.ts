import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="stats-container">
      <div class="card">
        <div class="card-header">
          <h3>👥 Active Employees</h3>
        </div>
        <p class="count">{{ activeEmployees() }}</p>
        <p class="subtext">{{ totalEmployees() }} total</p>
      </div>
      <div class="card">
        <div class="card-header">
          <h3>🏢 Departments</h3>
        </div>
        <p class="count">{{ totalDepartments() }}</p>
        <p class="subtext">Across company</p>
      </div>
      <div class="card highlight">
        <div class="card-header">
          <h3>💰 Avg Salary</h3>
        </div>
        <p class="count">{{ avgSalary() | currency:'USD':'symbol':'1.0-0' }}</p>
        <p class="subtext">Monthly average</p>
      </div>
      <div class="card">
        <div class="card-header">
          <h3>📊 Total Payroll</h3>
        </div>
        <p class="count">{{ totalPayroll() | currency:'USD':'symbol':'1.0-0' }}</p>
        <p class="subtext">Annual</p>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-left: 4px solid #3498db;
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }

    .card.highlight {
      border-left-color: #2ecc71;
    }

    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .card h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .card .count {
      margin: 12px 0 8px;
      font-size: 2.2rem;
      font-weight: 700;
      color: #2c3e50;
    }

    .card .subtext {
      margin: 0;
      font-size: 0.85rem;
      color: #7f8c8d;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsCardsComponent {
  activeEmployees = input<number>(0);
  totalEmployees = input<number>(0);
  totalDepartments = input<number>(0);
  salaries = input<number[]>([]);

  readonly avgSalary = computed(() => {
    const sals = this.salaries();
    return sals.length > 0 ? Math.round(sals.reduce((a, b) => a + b, 0) / sals.length) : 0;
  });

  readonly totalPayroll = computed(() => {
    const sals = this.salaries();
    return sals.reduce((a, b) => a + b, 0);
  });
}
