import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { Observable } from 'rxjs';

interface EarnedLeave {
  earnedLeaveId: number;
  employeeId: number;
  totalEarnedLeaves: number;
  totalSickEarnedLeaves?: number;
  lastUpdatedDate: string;
  employeeName: string;
}

@Component({
  selector: 'app-earned-leave',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './earned-leave.component.html',
  styleUrls: ['./earned-leave.component.scss']
})
export class EarnedLeaveComponent implements OnInit {
  masterSrv = inject(MasterService);

  employeeList: any[] = [];
  employee$: Observable<any> = new Observable();
  earnedLeaves: EarnedLeave[] = [];

  // ✅ Form structure with required validators
  addLeaveForm: FormGroup = new FormGroup({
    employeeId: new FormControl('', Validators.required),
    earnedLeaveCount: new FormControl(0, [Validators.required, Validators.min(1)]),
    lastUpdatedDate: new FormControl(new Date())
  });

  showModal = false;

  ngOnInit(): void {
    this.loadEmployees();
    this.loadEarnedLeaves();
  }

  loadEmployees() {
    this.employee$ = this.masterSrv.getAllEmployees();
    this.employee$.subscribe({
      next: (res: any) => {
        // API gives direct array
        this.employeeList = res?.result || res || [];
      },
      error: (err) => console.error('Error loading employees:', err)
    });
  }

  loadEarnedLeaves() {
    this.masterSrv.getAllEarnedLeaves().subscribe({
      next: (res: any) => {
        if (res?.data) this.earnedLeaves = res.data;
        else console.error('Unexpected response format:', res);
      },
      error: (err) => console.error('Error loading earned leaves:', err)
    });
  }

  openAddModal() {
    this.showModal = true;
    this.addLeaveForm.reset({
      employeeId: '',
      earnedLeaveCount: 0,
      lastUpdatedDate: new Date()
    });
  }

  onSaveAddForm() {
    if (this.addLeaveForm.invalid) {
      this.addLeaveForm.markAllAsTouched();
      return;
    }

    const formValues = this.addLeaveForm.value;

    // ✅ formValues.employeeId will automatically have the correct selected employeeId
    console.log('Submitting:', formValues);

    this.masterSrv.addEarnedLeave(formValues).subscribe({
      next: (res: any) => {
        if (res?.result) {
          alert('Earned Leave added successfully!');
          this.showModal = false;
          this.loadEarnedLeaves(); // refresh list
        } else {
          alert(res?.message || 'Error occurred while saving.');
        }
      },
      error: (err) => {
        console.error('Error adding earned leave:', err);
        alert('An unexpected error occurred.');
      }
    });
  }
}
