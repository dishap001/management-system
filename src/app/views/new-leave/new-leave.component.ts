import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MasterService } from '../../services/master.service';

interface Leave {
  id?: number;
  employeeId: number;
  employeeName: string;
  typeName: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
  requestDate: string;
}

interface LeaveType {
  leaveTypeId: number;
  typeName: string;
}

@Component({
  selector: 'app-new-leave',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-leave.component.html',
  styleUrls: ['./new-leave.component.scss']
})
export class NewLeaveComponent implements OnInit {
  showModal = false;
  isEdit = false;
  masterService = inject(MasterService);

  leaveForm = new FormGroup({
    employeeId: new FormControl<number | null>(this.masterService.loggedUserData.employeeId, Validators.required),
    leaveTypeId: new FormControl<number | null>(null, Validators.required),
    startDate: new FormControl<string>('', Validators.required),
    endDate: new FormControl<string>('', Validators.required),
    reason: new FormControl<string>('', Validators.required),
    status: new FormControl<string>('Pending'),
    requestDate: new FormControl<string>(new Date().toISOString().substring(0, 10))
  });

  requestList = signal<Leave[]>([]);
  leaveTypeList = signal<LeaveType[]>([]);
  employees: { id: number; name: string }[] = [];

  ngOnInit(): void {
    // Fetch all employees for dropdown
    this.masterService.getAllEmployees().subscribe({
      next: (res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.employees = res.data.map((emp: any) => ({
            id: emp.employeeId,
            name: emp.employeeName
          }));
        }
      },
      error: (err) => console.error('Error loading employees:', err)
    });

    // Fetch leave requests
    if (this.masterService.loggedUserData?.role === 'Employee') {
      // Only their own leave requests
      this.masterService.getAllLeaveRequestByEmpId(this.masterService.loggedUserData.employeeId)
        .subscribe({
          next: (res: any) => {
            if (res?.data) {
              this.requestList.set(res.data);
            }
          },
          error: (err: any) => console.error('Error fetching employee leave requests:', err)
        });
    } else if (this.masterService.loggedUserData?.role === 'Admin') {
      // Admin: fetch all leave requests
      this.masterService.getAllLeaveRequests().subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.requestList.set(res.data);
          }
        },
        error: (err: any) => console.error('Error fetching all leave requests:', err)
      });
    }

    // Load leave types
    this.getLeaveTypes();
  }

  getLeaveTypes() {
    this.masterService.getLeaveTypes().subscribe({
      next: (res: any) => {
        if (res?.result && Array.isArray(res.data)) {
          this.leaveTypeList.set(res.data.filter((x: LeaveType) => x.typeName?.trim() !== ''));
        }
      },
      error: (err: any) => console.error('Error fetching leave types:', err)
    });
  }

  openModal(editMode = false, leave?: Leave) {
    this.showModal = true;
    this.isEdit = editMode;

    if (editMode && leave) {
      this.leaveForm.patchValue({
        employeeId: leave.employeeId,
        leaveTypeId: this.leaveTypeList().find(t => t.typeName === leave.typeName)?.leaveTypeId ?? null,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        status: leave.status,
        requestDate: leave.requestDate
      });
    } else {
      this.leaveForm.reset({
        status: 'Pending',
        requestDate: new Date().toISOString().substring(0, 10),
        employeeId: this.masterService.loggedUserData.employeeId
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  onSave() {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const formValue = this.leaveForm.value;

    this.masterService.createNewLeaveRequest(formValue).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        if (res?.status === true) {
          alert(res?.message || '✅ Leave request submitted successfully.');
          this.closeModal();
          // Refresh leave requests
          this.ngOnInit();
        } else {
          alert(res?.message || '❌ Failed to submit leave request.');
        }
      },
      error: (err: any) => {
        console.error('Error submitting leave request:', err);
        alert('⚠️ Unexpected error occurred.');
      }
    });
  }

  onEdit(leave: Leave) {
    this.openModal(true, leave);
  }

  onApprove(leave: Leave) {
    leave.status = 'Approved';
  }

  onCancel(leave: Leave) {
    leave.status = 'Cancelled';
  }
}
