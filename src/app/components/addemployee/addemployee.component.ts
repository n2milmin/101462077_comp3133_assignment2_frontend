import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';  
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';

const ADD_EMP_MUTATION = gql`
  mutation addEmp($first_name: String!, $last_name: String!, $email: String!, $gender: String!, $designation: String!, $salary: Float!, $date_of_joining: Date!, $department: String!, $employee_photo: String, $created_at: Date, $updated_at: Date){
    addEmp(first_name: $first_name, last_name: $last_name, email: $email, gender: $gender, designation: $designation, salary: $salary, date_of_joining: $date_of_joining, department: $department, employee_photo: $employee_photo, created_at: $created_at, updated_at: $updated_at){
        id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
        created_at
        updated_at
    }
}`

const GET_EMP_QUERY = gql`
  {
    getAllEmp {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
}}`


@Component({
  selector: 'app-addemployee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatOptionModule, MatSelectModule],
  templateUrl: './addemployee.component.html',
  styleUrl: './addemployee.component.css'
})
export class AddemployeeComponent {
  private form = inject(FormBuilder);
  error: string | null = null;
  designations: string[] = ['Admin', 'Manager', 'Developer', 'HR', 'Sales'];
  departments: string[] = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance'];

  constructor(private apollo: Apollo, private router: Router) {}

  addEmployeeForm = this.form.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    department: ['', [Validators.required]],
    salary: ['', [Validators.required, Validators.min(0)]],
    date_of_joining: [null, Validators.required],
    employee_photo: ['']
  });

  onSubmit() {
    if (this.addEmployeeForm.invalid) return;
    this.error = null;
    const created_at = Date.now();
    const updated_at = Date.now();
    const { first_name, last_name, email, gender, designation, department, salary, date_of_joining, employee_photo } = this.addEmployeeForm.value;

    this.apollo.mutate({
      mutation: ADD_EMP_MUTATION,
      variables: { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo, created_at, updated_at },
      refetchQueries: [{ query: GET_EMP_QUERY }]
    })
    .subscribe({
      next: (result: any) => {
        console.log('Employee added:', result);
        this.router.navigate(['/employees']);  
      },
      error: (err) => {
        this.error = 'Failed to add employee. Please try again.';
        console.log(err);
      },
    });
  }
}
