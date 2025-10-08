export class Employee {
  employeeId: number;
  employeeName: string;
  contactNo: string;
  emailId: string;
  deptId: number;
  password: string;
  gender: string;
  role: string;
  childDeptId?: number;
  constructor() {
    this.employeeId = 0;
    this.employeeName = '';
    this.contactNo = '';
    this.emailId = '';
    this.deptId = 0;
    this.password = '';
    this.role = 'Employee';
    this.gender = '';
  }
}

export interface parentDept {
  departmentId: number;
  departmentName: string;
  departmentLogo: string;
}

export interface LeaveType{
  leaveTypeId: number;
  typeName: string;
}
 export interface EarnedLeave {
  earnedLeaveId: number;
  employeeId: number;
  totalEarnedLeave: number;
  totalSickEarnedLeave?: number;
  lastUpdatedDate: string;
  employeeName?: string;
 }

 export interface LeaveRequest {
  leaveId: number;
  employeeId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
  requestedDate: string;
}
