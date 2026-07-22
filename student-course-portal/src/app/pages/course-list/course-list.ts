import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseCard } from '../../components/course-card/course-card';
import { Highlight } from '../../directives/highlight';
import { Course } from '../../models/course.model';
import * as CourseActions from '../../store/course/course.actions';
import { selectAllCourses, selectCoursesLoading, selectCoursesError } from '../../store/course/course.selectors';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule, FormsModule, CourseCard, Highlight],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList implements OnInit {
  courses$!: Observable<Course[]>;
  filteredCourses$!: Observable<Course[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  
  selectedCourseId: number | null = null;
  searchTerm = '';

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Read query parameter on load
    const searchParam = this.route.snapshot.queryParamMap.get('search');
    if (searchParam) {
      this.searchTerm = searchParam;
    }

    // Select state variables from NgRx Store (Hands-On 9 Step 96)
    this.courses$ = this.store.select(selectAllCourses);
    this.loading$ = this.store.select(selectCoursesLoading);
    this.error$ = this.store.select(selectCoursesError);

    // Dispatch load action to fetch data via Effect (Hands-On 9 Step 96)
    this.store.dispatch(CourseActions.loadCourses());

    this.filterCourses();
  }

  trackByCourseId(index: number, course: Course): number {
    return course.id;
  }

  onEnroll(courseId: number): void {
    console.log('Enrolling in course via selector: ' + courseId);
    this.selectedCourseId = courseId;
  }

  goToDetails(courseId: number): void {
    this.router.navigate(['/courses', courseId]);
  }

  onSearchChange(): void {
    this.router.navigate(['/courses'], {
      queryParams: { search: this.searchTerm || null },
      queryParamsHandling: 'merge'
    });
    this.filterCourses();
  }

  filterCourses(): void {
    // Filter the courses stream reactively using RxJS map operator
    this.filteredCourses$ = this.courses$.pipe(
      map(courses => {
        if (!this.searchTerm.trim()) {
          return courses;
        }
        return courses.filter(c =>
          c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          c.code.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      })
    );
  }
}
