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
  employeeObj: Employee = new Employee();
  parentDeptId: string = '';
  parentDepartmentList: parentDept[] = [];
  childDepartmentList: parentDept[] = [];
  employees: Employee[] = [];
  employeeList: Employee[] = [];
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
      // Call service passing query param
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
  onSaveEmployee() {
    const payload = {
      employeeId: 0, // backend will generate ID
      employeeName: this.employeeObj.employeeName,
      contactNo: this.employeeObj.contactNo,
      emailId: this.employeeObj.emailId,
      deptId: Number(this.parentDeptId), // parent dept is required
      password: this.employeeObj.password,
      gender: this.employeeObj.gender,
      role: this.employeeObj.role || 'Employee', // default role if not chosen
      createdDate: new Date().toISOString(),
    };
    console.log('Form Payload:', payload);
    this.showModal = false;
    // this.masterService.createNewEmployee(payload).subscribe({
    //   next: (res: any) => {
    //     if (res.result) {
    //       alert('Employee Created successfully');
    //       this.employeeObj = new Employee();
    //       this.loadEmployees();
    //       this.showModal = false;
    //     }
    //   },
    //   error: (err) => {
    //     console.error("Error creating employee:", err);
    //     alert("Something went wrong while creating employee.");
    //   }
    // });
  }
}
