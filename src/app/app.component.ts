import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');

    if (this.isLoggedIn) 
      this.router.navigate(['/employees']);
  }

  onLogout(): void {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      alert('You have been logged out.');
      this.router.navigate(['/login']);
    }
  }
}
