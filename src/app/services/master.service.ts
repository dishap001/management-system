import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private http: HttpClient) {}

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
}
