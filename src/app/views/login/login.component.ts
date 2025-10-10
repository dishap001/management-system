import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginObj = { userName: '', password: '' };

  http = inject(HttpClient);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);

  onLogin(form: NgForm) {
    if (!form.valid) {
      // Mark all fields as touched to show validation errors
      form.control.markAllAsTouched();
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      const payload = {
        userName: this.loginObj.userName.trim(),
        password: this.loginObj.password.trim()
      };

      this.http.post('/api/EmployeeManagement/Login', payload).subscribe({
        next: (res: any) => {
          if (res.result) {
            localStorage.setItem('leaveUser', JSON.stringify(res.data));
            this.router.navigateByUrl('dashboard');
          } else {
            alert(res.message || 'Invalid credentials.');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Something went wrong. Please try again.');
        }
      });
    }
  }
}
