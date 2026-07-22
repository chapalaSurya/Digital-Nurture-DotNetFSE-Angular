import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { CourseService } from './course';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private enrolledCourseIds: number[] = [];
  private enrollUrl = 'http://localhost:3000/enrollments';

  constructor(
    private http: HttpClient,
    private courseService: CourseService
  ) {}

  enroll(courseId: number): void {
    if (!this.enrolledCourseIds.includes(courseId)) {
      this.enrolledCourseIds.push(courseId);
      console.log(`EnrollmentService: Enrolled in course ID ${courseId}`);
      
      this.http.post(this.enrollUrl, { courseId }).subscribe({
        next: () => console.log(`EnrollmentService: Synced enrollment for course ${courseId} to backend`),
        error: (err) => console.error(`EnrollmentService: Failed to sync enrollment to backend:`, err)
      });
    }
  }

  unenroll(courseId: number): void {
    this.enrolledCourseIds = this.enrolledCourseIds.filter(id => id !== courseId);
    console.log(`EnrollmentService: Unenrolled from course ID ${courseId}`);
  }

  isEnrolled(courseId: number): boolean {
    return this.enrolledCourseIds.includes(courseId);
  }

  getEnrolledCourses(): Observable<Course[]> {
    if (this.enrolledCourseIds.length === 0) {
      return of([]);
    }
    // ForkJoin combines multiple HTTP request observables (Hands-On 8 Task 1)
    const requests = this.enrolledCourseIds.map(id => this.courseService.getCourseById(id));
    return forkJoin(requests);
  }

  getStudentsByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/students?enrolledCourseId=${courseId}`);
  }
}
