import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

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

const DELETE_EMP_MUTATION = gql`
  mutation DeleteEmpByID($id: ID!){
    deleteEmpById(id: $id){
      id
}}`


@Component({
  selector: 'app-employeedetails',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule],
  templateUrl: './employeedetails.component.html',
  styleUrl: './employeedetails.component.css'
})
export class EmployeedetailsComponent {
  employeeId: string | null = null;
  employee: any;
  error: string | null= null;
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'email', 'gender', 'designation', 'salary', 'date_of_joining', 'department', 'employee_photo', 'created_at', 'updated_at'];

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id')

    if(this.employeeId){
      this.apollo.watchQuery({
        query: FIND_USER_QUERY,
        variables: { id: this.employeeId }
      }).valueChanges.subscribe({
        next: (result: any) => {
          this.employee = result?.data?.searchEmpById;
        },
        error: (err) => {
          this.error = 'Failed to fetch employee details';
          console.log(err);
        }
      });
    } else {
      this.error = 'Failed to fetch employee details';
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
  
  updateEmployee(): void {
    this.router.navigate(['/employees/update', this.employee.id]);
  }

  deleteEmployee(): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo.mutate({
        mutation: DELETE_EMP_MUTATION,
        variables: this.employee.id ,
        refetchQueries: ['GetAllEmployees'], 
      }).subscribe({
        next: (result) => {
          console.log('Employee deleted:', result);
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        },
      });
    }
  }
}
