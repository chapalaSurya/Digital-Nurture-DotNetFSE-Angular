import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseService } from '../../services/course';
import { CourseSummaryWidget } from '../../components/course-summary-widget/course-summary-widget';
import { NotificationComponent } from '../../components/notification/notification';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, CourseSummaryWidget, NotificationComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  portalName = 'Student Course Portal';
  isPortalActive = true;
  message = '';
  searchTerm = '';

  // Stats - dynamically loaded from shared service as Observables
  coursesAvailableCount$!: Observable<number>;
  enrolledCount = 3;
  gpa = 3.8;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    console.log('HomeComponent initialised — courses loaded');
    
    // Fetch available count as Observable stream
    this.coursesAvailableCount$ = this.courseService.getCourses().pipe(
      map(courses => courses.length)
    );
  }

  ngOnDestroy(): void {
    console.log('HomeComponent destroyed');
  }

  onEnrollClick(): void {
    this.message = 'Enrollment opened!';
  }

  addMockCourse(): void {
    const nextId = Math.floor(Math.random() * 1000) + 10;
    // Create new course via post (Hands-On 8 Task 1 Step 81)
    this.courseService.createCourse({
      name: `Advanced Topic ${nextId}`,
      code: `CS${100 + nextId}`,
      credits: 3,
      gradeStatus: 'pending'
    }).subscribe({
      next: (course) => {
        console.log('Successfully created course:', course);
        // Refresh available count observable
        this.coursesAvailableCount$ = this.courseService.getCourses().pipe(
          map(courses => courses.length)
        );
      },
      error: (err) => console.error('Failed to create course:', err)
    });
  }
}
