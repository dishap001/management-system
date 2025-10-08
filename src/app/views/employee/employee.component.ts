import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Employee, parentDept } from '../../model/master';
import { MasterService } from '../../services/master.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {
  showModal = false;
  isEdit = false;   // flag to track add/edit
  employeeObj: Employee = new Employee();
  parentDeptId: string = '';
  parentDepartmentList: parentDept[] = [];
  childDepartmentList: parentDept[] = [];
  employees: Employee[] = [];
  masterService = inject(MasterService);

  ngOnInit(): void {
    this.loadParentDepartments();
    this.loadEmployees();
  }

  loadParentDepartments() {
    this.masterService.getDepartments().subscribe((res: any) => {
      this.parentDepartmentList = res.data;
    });
  }

  onDeptChange() {
    if (this.parentDeptId) {
      const params = new HttpParams().set('deptId', this.parentDeptId);
      this.masterService.getChildDepartments(params).subscribe((res: any) => {
        this.childDepartmentList = res.data;
      });
    } else {
      this.childDepartmentList = [];
    }
  }

  loadEmployees() {
    this.masterService.getAllEmployees().subscribe((res: any) => {
      this.employees = res;
    });
  }

  // open modal for add
  openAddModal() {
    this.employeeObj = new Employee();  // reset
    this.parentDeptId = '';
    this.isEdit = false;
    this.showModal = true;
  }

  // open modal for edit
  onEdit(emp: Employee) {
    this.employeeObj = { ...emp }; // clone object so form binds
    this.parentDeptId = emp.deptId.toString(); 
    this.isEdit = true;
    this.showModal = true;
  }

  onSaveEmployee() {
    const payload = {
      employeeId: this.isEdit ? this.employeeObj.employeeId : 0,
      employeeName: this.employeeObj.employeeName,
      contactNo: this.employeeObj.contactNo,
      emailId: this.employeeObj.emailId,
      deptId: Number(this.parentDeptId),
      password: this.employeeObj.password,
      gender: this.employeeObj.gender,
      role: this.employeeObj.role || 'Employee',
      createdDate: new Date().toISOString(),
    };

    if (this.isEdit) {
      // call update API
      this.masterService.updateEmployee(payload).subscribe({
        next: () => {
          alert("Employee updated successfully");
          this.loadEmployees();
          this.showModal = false;
        },
        error: (err) => console.error("Update failed:", err)
      });
    } else {
      // call add API
      this.masterService.createNewEmployee(payload).subscribe({
        next: () => {
          alert("Employee created successfully");
          this.loadEmployees();
          this.showModal = false;
        },
        error: (err) => console.error("Create failed:", err)
      });
    }
  }

  onDelete(id: number) {
    const isDelete = confirm("Are you sure to delete this employee?");
    if (isDelete) {
      this.masterService.deleteEmployee(id).subscribe(() => {
        alert("Employee deleted successfully");
        this.loadEmployees();
      });
    }
  }
}
