import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EarnedLeave } from '../model/master';

@Injectable({
  providedIn: 'root',
})
export class MasterService {

    loggedUserData: any = null;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('leaveUser');
    if (storedUser) {
      this.loggedUserData = JSON.parse(storedUser);
    }
  }
 

  getDepartments(): Observable<any> {
    // just call the API path; proxy will handle the target
    return this.http.get<any>('/api/EmployeeManagement/GetParentDepartment');
  }

  getChildDepartments(params: HttpParams): Observable<any> {
    return this.http.get<any>(
      '/api/EmployeeManagement/GetChildDepartmentByParentId',
      { params }
    );
  }
  createNewEmployee(obj: any): Observable<any> {
    return this.http.post('/api/EmployeeManagement/CreateEmployee', obj);
  }
  getAllEmployees(): Observable<any> {
    return this.http.get('/api/EmployeeManagement/GetAllEmployees');
  }
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`/api/EmployeeManagement/DeleteEmployee/${id}`);
  }
  updateEmployee(obj: any): Observable<any> {
    return this.http.put('/api/EmployeeManagement/UpdateEmployee', obj);
  }
  addEarnedLeave(emp: EarnedLeave): Observable<EarnedLeave> {
    return this.http.post<any>('/api/EmployeeManagement/AddNewEarnedLeave', emp);
  }
  getAllEarnedLeaves(): Observable<any> {
    return this.http.get('/api/EmployeeManagement/GetAllEarnedLeaves');
  }
  getLeaveTypes(): Observable<any> {
    return this.http.get('/api/EmployeeManagement/GetLeaveTypes');
  }
  createNewLeaveRequest(obj: any): Observable<any> {
    return this.http.post('/api/EmployeeManagement/CreateNewLeaveRequest', obj);
  }
}
