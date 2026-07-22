import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css'
})
export class CourseDetail implements OnInit {
  course: Course | undefined;
  courseId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Read route parameter :id and subscribe to course details (Hands-On 7 Step 69 & Hands-On 8 Step 79)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId = +idParam;
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course) => this.course = course,
        error: (err) => console.error(`Failed to load course ID ${this.courseId}`, err)
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
