import { Injectable, signal, computed } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly employeesSignal = signal<Employee[]>([
    { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 85000 },
    { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000 },
    { id: 3, name: 'Charlie Brown', department: 'Engineering', salary: 90000 },
    { id: 4, name: 'Diana Prince', department: 'HR', salary: 70000 },
    { id: 5, name: 'Ethan Hunt', department: 'Operations', salary: 75000 },
    { id: 6, name: 'Fiona Gallagher', department: 'HR', salary: 68000 },
    { id: 7, name: 'George Miller', department: 'Marketing', salary: 62000 },
  ]);

  readonly employees = this.employeesSignal.asReadonly();

  readonly departments = computed(() => {
    const deps = [...new Set(this.employeesSignal().map(e => e.department))];
    return deps.sort();
  });

  readonly totalEmployees = computed(() => this.employeesSignal().length);

  readonly totalDepartments = computed(() => this.departments().length);
}
