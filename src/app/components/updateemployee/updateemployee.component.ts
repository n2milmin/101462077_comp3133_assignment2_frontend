import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';  
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

const FIND_USER_QUERY = gql`
  query searchEmpById($id: ID!){
    searchEmpById(id: $id){
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

const UPDATE_EMP_MUTATION = gql`
mutation updateEmpById($id: ID!, $first_name: String!, $last_name: String!, $email: String!, $gender: String!, $designation: String!, $salary: Float!, $date_of_joining: Date!, $department: String!, $employee_photo: String){
    updateEmpById(id: $id, first_name: $first_name, last_name: $last_name, email: $email, gender: $gender, designation: $designation, salary: $salary, date_of_joining: $date_of_joining, department: $department, employee_photo: $employee_photo){
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
  selector: 'app-updateemployee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatOptionModule, MatSelectModule],
  templateUrl: './updateemployee.component.html',
  styleUrl: './updateemployee.component.css'
})
export class UpdateemployeeComponent {
  private form = inject(FormBuilder);
  employeeId: any;
  employee: any;
  error: string | null = null;
  designations: string[] = ['Admin', 'Manager', 'Developer', 'HR', 'Sales'];
  departments: string[] = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance'];

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) {}

  updateEmployeeForm = this.form.group({
    id: ['', {disabled: true}],
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    department: ['', [Validators.required]],
    salary: ['', [Validators.required, Validators.min(0)]],
    date_of_joining: [null as Date | null, Validators.required],
    employee_photo: ['']
  });

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id');
  
    this.apollo.query({
      query: FIND_USER_QUERY,
      variables: { id: this.employeeId }
    }).subscribe((result: any) => {
      this.employee= result?.data?.searchEmpById;
      console.log(this.employee)
      this.updateEmployeeForm.patchValue({
        id: this.employee.id,
        first_name: this.employee.first_name,
        last_name: this.employee.last_name,
        email: this.employee.email,
        gender: this.employee.gender,
        designation: this.employee.designation,
        department: this.employee.department,
        salary: this.employee.salary,
        date_of_joining: new Date(this.employee.date_of_joining),
        employee_photo: this.employee.employee_photo
      });
    });
  }

  onSubmit() {
    if(this.updateEmployeeForm.invalid) return;

    this.error = null;
    const { id, first_name, last_name, email, gender, designation, department, salary, date_of_joining, employee_photo } = this.updateEmployeeForm.getRawValue();

    this.apollo.mutate({
      mutation: UPDATE_EMP_MUTATION,
      variables: { id, first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo },
      refetchQueries: [{ query: GET_EMP_QUERY }]
    })
    .subscribe({
      next: (result: any) => {
        console.log('Employee updated:', result);
        this.router.navigate(['/employees']);  
      },
      error: (err) => {
        this.error = 'Failed to update employee. Please try again.';
        console.log(err);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/employees']); 
  }
}
