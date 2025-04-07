import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeelistComponent } from './components/employeelist/employeelist.component';
import { EmployeedetailsComponent } from './components/employeedetails/employeedetails.component';
import { AddemployeeComponent } from './components/addemployee/addemployee.component';
import { UpdateemployeeComponent } from './components/updateemployee/updateemployee.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeelistComponent },
  { path: 'employees/:id', component: EmployeedetailsComponent },
  { path: 'employees/add', component: AddemployeeComponent },
  { path: 'employees/update/:id', component: UpdateemployeeComponent }
];