import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentRoutingModule } from './enrollment-routing-module';
import { EnrollmentForm } from '../../pages/enrollment-form/enrollment-form';
import { ReactiveEnrollmentForm } from '../../pages/reactive-enrollment-form/reactive-enrollment-form';

@NgModule({
  imports: [
    CommonModule,
    EnrollmentRoutingModule,
    EnrollmentForm,        // Import standalone components here
    ReactiveEnrollmentForm // Import standalone components here
  ]
})
export class EnrollmentModule { }
