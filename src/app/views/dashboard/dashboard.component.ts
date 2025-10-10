import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { CommonModule } from '@angular/common';

interface EmployeeDashboardData {
  earnedLeave: number;
  totalNewLeaves: number;
  totalApprovedLeaves: number;
  totalCanceledLeave: number;
}

interface HRDashboardData {
  totalEmployee: number;
  totalLeaves: number;
  totalNewLeaves: number;
  totalApprovedLeaves: number;
  totalCanceledLeave: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  masterService = inject(MasterService);

  isEmployee: boolean = false;

  employeeData: EmployeeDashboardData | null = null;
  hrData: HRDashboardData | null = null;

  ngOnInit() {
    const role = this.masterService.loggedUserData?.role;
    this.isEmployee = role === 'Employee';

    if (this.isEmployee) {
      const empId = this.masterService.loggedUserData?.employeeId;
      if (empId) {
        this.masterService.getEmployeeDashboardData(empId).subscribe({
          next: (res: any) => {
            this.employeeData = res.data || res;
            console.log('Employee Dashboard:', this.employeeData);
          },
          error: (err) => console.error('Error fetching employee dashboard:', err)
        });
      }
    } else {
      this.masterService.getHRDashboardData().subscribe({
        next: (res: any) => {
          this.hrData = res.data || res;
          console.log('HR Dashboard:', this.hrData);
        },
        error: (err) => console.error('Error fetching HR dashboard:', err)
      });
    }
  }
}
