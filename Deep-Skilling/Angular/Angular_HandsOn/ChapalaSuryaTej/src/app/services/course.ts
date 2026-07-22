import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, retry, catchError } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      // RxJS Operator: map (transform list to only show courses with > 0 credits) (Hands-On 8 Step 83)
      map(courses => courses.filter(c => c.credits > 0)),
      
      /*
       * WHY 'tap' IS PREFERRED OVER SIDE EFFECTS INSIDE 'map' (Hands-On 8 Step 85):
       *
       * 1. Separation of Concerns: 'map' is meant purely for data transformations (mapping values to other values).
       *    'tap' is designed explicitly for executing side-effects (like logging, analytics, setting state)
       *    without mutating the emitted values.
       * 2. Readability & Maintainability: Using 'tap' signals to other developers that this block has
       *    no impact on the pipeline's output, helping isolate data logic from side-effect logic.
       */
      tap(courses => console.log('Courses loaded via tap:', courses.length)),
      
      // RxJS Operator: retry strategy (retry up to 2 times on failures) (Hands-On 8 Step 86)
      retry(2),
      
      // RxJS Operator: catchError (handles errors gracefully) (Hands-On 8 Step 84)
      catchError(err => {
        console.error('CourseService failed to load courses:', err);
        return throwError(() => new Error('Failed to load courses. Please try again.'));
      })
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${course.id}`, course);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
