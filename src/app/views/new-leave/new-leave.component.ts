import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
  styleUrls: ['./new-leave.component.scss']
})
export class NewLeaveComponent implements OnInit {
  showModal = false;
  isEdit = false;
  masterService = inject(MasterService);

  employees = [
    { id: 1, name: 'Kishan Mishra' },
    { id: 2, name: 'Kotesha' },
    { id: 3, name: 'Disha Patil' }
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
    }
  ];

  // Reactive Form
  leaveForm = new FormGroup({
    leaveId: new FormControl<number>(0),
    employeeId: new FormControl<number | null>(null, Validators.required),
    leaveTypeId: new FormControl<number | null>(null, Validators.required),
    startDate: new FormControl<string>('', Validators.required),
    endDate: new FormControl<string>('', Validators.required),
    reason: new FormControl<string>('', Validators.required),
    status: new FormControl<string>('Pending'),
    requestDate: new FormControl<string>(new Date().toISOString().substring(0, 10))
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
          name: e.employeeName
        }));
      }
    },
    error: (err) => console.error('Error loading employees:', err)
  });

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
        leaveId: leave.id,
        employeeId: leave.employeeId,
        leaveTypeId: this.leaveTypeList().find(t => t.typeName === leave.type)?.leaveTypeId ?? null,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        status: leave.status,
        requestDate: leave.requestDate
      });
    } else {
      this.leaveForm.reset({
        status: 'Pending',
        requestDate: new Date().toISOString().substring(0, 10)
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  submitForm() {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const formData = this.leaveForm.value;
    const employeeId = formData.employeeId ?? 0;
    const leaveTypeId = formData.leaveTypeId ?? 0;

    const selectedEmp = this.employees.find(e => e.id === employeeId);
    const selectedType = this.leaveTypeList().find(t => t.leaveTypeId === leaveTypeId);

    if (this.isEdit) {
      alert('Leave updated successfully!');
    } else {
      const newLeave: Leave = {
        id: new Date().getTime(),
        employeeId,
        employeeName: selectedEmp?.name || '',
        type: selectedType?.typeName || 'N/A',
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        status: formData.status!,
        reason: formData.reason!,
        requestDate: formData.requestDate!
      };
      this.leaves.push(newLeave);
      alert('Leave added successfully!');
    }

    this.closeModal();
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
