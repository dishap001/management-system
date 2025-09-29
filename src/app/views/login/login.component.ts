import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router';         

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  
})
export class LoginComponent {
  loginObj: any = { username: '', password: '' };

  http = inject(HttpClient);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);

  onLogin() {
    if (isPlatformBrowser(this.platformId)) {
      // safe to access localStorage and window/document
      this.http.post('/api/EmployeeManagement/Login', this.loginObj)
        .subscribe((res: any) => {
          if (res.result) {
            localStorage.setItem('leaveUser', JSON.stringify(res.data));
            this.router.navigateByUrl('dashboard');
          } else {
            alert(res.message);
          }
        });
    }
  }
}
