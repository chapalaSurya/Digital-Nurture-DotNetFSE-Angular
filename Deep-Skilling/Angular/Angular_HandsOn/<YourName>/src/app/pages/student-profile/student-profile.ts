import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { CreditLabelPipe } from '../../pipes/credit-label-pipe';
import * as EnrollmentActions from '../../store/enrollment/enrollment.actions';
import { selectEnrolledCourses } from '../../store/enrollment/enrollment.selectors';

@Component({
  selector: 'app-student-profile',
  imports: [CommonModule, CreditLabelPipe],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css'
})
export class StudentProfile implements OnInit {
  studentName = 'Alex Mercer';
  studentEmail = 'alex.mercer@university.edu';
  gpa = '3.8';
  standing = 'Senior';
  enrolledCourses$!: Observable<Course[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Select enrolled courses from cross-slice selector (Hands-On 9 Step 99)
    this.enrolledCourses$ = this.store.select(selectEnrolledCourses);
  }

  unenroll(courseId: number): void {
    // Dispatch unenroll action to NgRx Store (Hands-On 9 Step 100)
    this.store.dispatch(EnrollmentActions.unenrollFromCourse({ courseId }));
  }
}
