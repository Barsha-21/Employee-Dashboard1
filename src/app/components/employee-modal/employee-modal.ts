import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Employee Details</h2>
            <button class="close-btn" (click)="closeModal()" aria-label="Close modal">×</button>
          </div>

          <div class="modal-body">
            <div class="detail-group">
              <label>Name</label>
              <p>{{ employee()?.name }}</p>
            </div>

            <div class="detail-row">
              <div class="detail-group">
                <label>Position</label>
                <p>{{ employee()?.position }}</p>
              </div>
              <div class="detail-group">
                <label>Department</label>
                <p>{{ employee()?.department }}</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-group">
                <label>Email</label>
                <p>{{ employee()?.email }}</p>
              </div>
              <div class="detail-group">
                <label>Phone</label>
                <p>{{ employee()?.phone }}</p>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-group">
                <label>Salary</label>
                <p class="salary">{{ employee()?.salary | currency }}</p>
              </div>
              <div class="detail-group">
                <label>Status</label>
                <p>
                  <span class="badge" [class.active]="employee()?.status === 'active'" [class.inactive]="employee()?.status === 'inactive'">
                    {{ employee()?.status | uppercase }}
                  </span>
                </p>
              </div>
            </div>

            <div class="detail-group">
              <label>Join Date</label>
              <p>{{ employee()?.joinDate | date:'MMM d, y' }}</p>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-close" (click)="closeModal()">Close</button>
            <button class="btn-delete" (click)="onDelete()">Delete Employee</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      animation: slideUp 0.3s;
    }

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 2px solid #ecf0f1;
    }

    .modal-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #7f8c8d;
      transition: color 0.3s;
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #2c3e50;
    }

    .modal-body {
      padding: 24px;
    }

    .detail-group {
      margin-bottom: 16px;
    }

    .detail-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .detail-group label {
      display: block;
      font-weight: 600;
      color: #7f8c8d;
      font-size: 0.85rem;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-group p {
      margin: 0;
      color: #2c3e50;
      font-size: 1rem;
    }

    .salary {
      color: #27ae60;
      font-weight: 600;
    }

    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge.active {
      background: #d5f4e6;
      color: #27ae60;
    }

    .badge.inactive {
      background: #fadbd8;
      color: #e74c3c;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      padding: 16px 24px;
      border-top: 2px solid #ecf0f1;
      background: #f8f9fa;
      border-radius: 0 0 12px 12px;
    }

    button {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-close {
      background: #ecf0f1;
      color: #2c3e50;
    }

    .btn-close:hover {
      background: #d5dbdb;
    }

    .btn-delete {
      background: #e74c3c;
      color: white;
    }

    .btn-delete:hover {
      background: #c0392b;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeModalComponent {
  isOpen = input<boolean>(false);
  employee = input<Employee | null>(null);
  closed = output<void>();
  deleted = output<number>();

  closeModal(): void {
    this.closed.emit();
  }

  onDelete(): void {
    if (this.employee()) {
      this.deleted.emit(this.employee()!.id);
      this.closeModal();
    }
  }
}
