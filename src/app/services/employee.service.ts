import { Injectable, signal, computed } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly employeesSignal = signal<Employee[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@company.com', phone: '555-0101', department: 'Engineering', position: 'Senior Developer', salary: 85000, status: 'active', joinDate: '2022-01-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@company.com', phone: '555-0102', department: 'Marketing', position: 'Marketing Manager', salary: 65000, status: 'active', joinDate: '2022-06-20' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@company.com', phone: '555-0103', department: 'Engineering', position: 'Full Stack Developer', salary: 90000, status: 'active', joinDate: '2021-03-10' },
    { id: 4, name: 'Diana Prince', email: 'diana@company.com', phone: '555-0104', department: 'HR', position: 'HR Manager', salary: 70000, status: 'active', joinDate: '2021-11-05' },
    { id: 5, name: 'Ethan Hunt', email: 'ethan@company.com', phone: '555-0105', department: 'Operations', position: 'Operations Lead', salary: 75000, status: 'active', joinDate: '2022-02-14' },
    { id: 6, name: 'Fiona Gallagher', email: 'fiona@company.com', phone: '555-0106', department: 'HR', position: 'HR Coordinator', salary: 68000, status: 'active', joinDate: '2022-09-01' },
    { id: 7, name: 'George Miller', email: 'george@company.com', phone: '555-0107', department: 'Marketing', position: 'Content Specialist', salary: 62000, status: 'active', joinDate: '2023-01-10' },
  ]);

  readonly employees = this.employeesSignal.asReadonly();

  readonly departments = computed(() => {
    const deps = [...new Set(this.employeesSignal().map(e => e.department))];
    return deps.sort();
  });

  readonly totalEmployees = computed(() => this.employeesSignal().length);

  readonly totalDepartments = computed(() => this.departments().length);

  readonly activeEmployees = computed(() => 
    this.employeesSignal().filter(e => e.status === 'active').length
  );

  readonly departmentStats = computed(() => {
    const stats: Record<string, { count: number; avgSalary: number }> = {};
    this.employeesSignal().forEach(emp => {
      if (!stats[emp.department]) {
        stats[emp.department] = { count: 0, avgSalary: 0 };
      }
      stats[emp.department].count++;
      stats[emp.department].avgSalary += emp.salary;
    });
    Object.keys(stats).forEach(dept => {
      stats[dept].avgSalary = Math.round(stats[dept].avgSalary / stats[dept].count);
    });
    return stats;
  });

  getEmployeesByDepartment(department: string) {
    return computed(() => 
      this.employeesSignal().filter(e => e.department === department)
    );
  }

  addEmployee(employee: Omit<Employee, 'id'>) {
    const newId = Math.max(...this.employeesSignal().map(e => e.id), 0) + 1;
    this.employeesSignal.update(employees => [...employees, { ...employee, id: newId }]);
  }

  updateEmployee(id: number, updates: Partial<Employee>) {
    this.employeesSignal.update(employees => 
      employees.map(e => e.id === id ? { ...e, ...updates } : e)
    );
  }

  deleteEmployee(id: number) {
    this.employeesSignal.update(employees => 
      employees.filter(e => e.id !== id)
    );
  }
}
