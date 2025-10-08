import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { Observable } from 'rxjs';

interface Leave {
  id?: number;
  employeeId: number;
  employeeName: string;
  type: string;
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
  styleUrls: ['./new-leave.component.scss'],
})
export class NewLeaveComponent implements OnInit {
  showModal = false;
  isEdit = false;
  masterService = inject(MasterService);

  employees = [
    { id: 1, name: 'Kishan Mishra' },
    { id: 2, name: 'Kotesha' },
    { id: 3, name: 'Disha Patil' },
  ];

  leaves: Leave[] = [
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Kishan Mishra',
      type: 'Sick Leave',
      startDate: '2025-10-05',
      endDate: '2025-10-07',
      status: 'Pending',
      reason: 'Fever and rest',
      requestDate: '2025-10-01',
    },
  ];

  // Reactive Form
  leaveForm = new FormGroup({
    employeeId: new FormControl<number | null>(
      this.masterService.loggedUserData.employeeId,
      Validators.required
    ),
    leaveTypeId: new FormControl<number | null>(null, Validators.required),
    startDate: new FormControl<string>('', Validators.required),
    endDate: new FormControl<string>('', Validators.required),
    reason: new FormControl<string>('', Validators.required),
    status: new FormControl<string>('Pending'),
    requestDate: new FormControl<string>(
      new Date().toISOString().substring(0, 10)
    ),
  });

  leaveTypeList = signal<LeaveType[]>([]);
  employee$: Observable<any> = new Observable();

  ngOnInit(): void {
    // Load employees from service
    this.employee$ = this.masterService.getAllEmployees();
    this.employee$.subscribe({
      next: (res: any) => {
        if (res?.data) {
          // Map API response to match your local employee structure
          this.employees = res.data.map((e: any) => ({
            id: e.employeeId,
            name: e.employeeName,
          }));
        }
      },
      error: (err) => console.error('Error loading employees:', err),
    });

    // Load leave types
    this.getLeaveTypes();
  }

  getLeaveTypes() {
    this.masterService.getLeaveTypes().subscribe({
      next: (res: any) => {
        if (res?.result && Array.isArray(res.data)) {
          this.leaveTypeList.set(
            res.data.filter((x: LeaveType) => x.typeName?.trim() !== '')
          );
        }
      },
      error: (err: any) => console.error('Error fetching leave types:', err),
    });
  }

  openModal(editMode = false, leave?: Leave) {
    this.showModal = true;
    this.isEdit = editMode;
    if (editMode && leave) {
      this.leaveForm.patchValue({
        employeeId: leave.employeeId,
        leaveTypeId:
          this.leaveTypeList().find((t) => t.typeName === leave.type)
            ?.leaveTypeId ?? null,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        status: leave.status,
        requestDate: leave.requestDate,
      });
    } else {
      this.leaveForm.reset({
        status: 'Pending',
        requestDate: new Date().toISOString().substring(0, 10),
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
        } else {
          alert(
            res?.message ||
              '❌ Failed to submit leave request. Please try again.'
          );
        }
      },
      error: (err: any) => {
        console.error('Error submitting leave request:', err);
        alert(
          '⚠️ An unexpected error occurred while submitting leave request.'
        );
      },
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
