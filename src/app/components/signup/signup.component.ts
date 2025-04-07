import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!){
    signup(username: $username, email: $email, password: $password){
      token
}}`

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private form = inject(FormBuilder);

  loading = false;
  error: string | null = null;

  constructor(private apollo: Apollo, private router: Router) {}
  
  signupForm = this.form.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if(this.signupForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { username, email, password } = this.signupForm.value;

    this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password }
    })
    .subscribe({
      next: (result: any) => {
        const token = result?.data;
        if(token){
          localStorage.setItem('token', token);
          this.router.navigate(['/employees']);
        } else {
          this.error = 'Server error, please try again.'
        }
      },
       error: err => {
        this.loading = false;
        this.error = 'Signup failed, please try again.';
        console.log(err)
      },
      complete: () => {
          this.loading = false;
      },
    })
  }
}
