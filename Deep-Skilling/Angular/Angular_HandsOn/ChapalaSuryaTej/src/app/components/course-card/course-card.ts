import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CreditLabelPipe } from '../../pipes/credit-label-pipe';
import * as EnrollmentActions from '../../store/enrollment/enrollment.actions';
import { selectEnrolledIds } from '../../store/enrollment/enrollment.selectors';

@Component({
  selector: 'app-course-card',
  imports: [CommonModule, CreditLabelPipe],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css'
})
export class CourseCard implements OnChanges, OnInit, OnDestroy {
  @Input() course!: {
    id: number;
    name: string;
    code: string;
    credits: number;
    gradeStatus: 'passed' | 'failed' | 'pending';
  };

  @Output() enrollRequested = new EventEmitter<number>();

  isExpanded: boolean = false;
  enrolledIds$!: Observable<number[]>;
  isEnrolled = false;
  private enrollSub?: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Select enrolled IDs from store (Hands-On 9 Step 100)
    this.enrolledIds$ = this.store.select(selectEnrolledIds);
    
    // Subscribe to track enrolled state locally for classes and handlers
    this.enrollSub = this.enrolledIds$.subscribe(ids => {
      this.isEnrolled = this.course ? ids.includes(this.course.id) : false;
    });
  }

  ngOnDestroy(): void {
    if (this.enrollSub) {
      this.enrollSub.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      const prevValue = changes['course'].previousValue;
      const currentValue = changes['course'].currentValue;
      console.log('CourseCard input changed:', {
        previous: prevValue ? prevValue.name : null,
        current: currentValue ? currentValue.name : null
      });
      // Re-evaluate enrollment status when input course changes
      if (this.enrolledIds$) {
        this.store.select(selectEnrolledIds).subscribe(ids => {
          this.isEnrolled = this.course ? ids.includes(this.course.id) : false;
        }).unsubscribe(); // Immediately unsubscribe as we only need snapshot
      }
    }
  }

  toggleDetails(): void {
    this.isExpanded = !this.isExpanded;
  }

  onEnrollClick(): void {
    if (this.course) {
      if (this.isEnrolled) {
        // Dispatch unenroll action
        this.store.dispatch(EnrollmentActions.unenrollFromCourse({ courseId: this.course.id }));
      } else {
        // Dispatch enroll action (Hands-On 9 Step 100)
        this.store.dispatch(EnrollmentActions.enrollInCourse({ courseId: this.course.id }));
      }
      this.enrollRequested.emit(this.course.id);
    }
  }

  get cardClasses() {
    return {
      'card--enrolled': this.isEnrolled,
      'card--full': this.course && this.course.credits >= 4,
      'expanded': this.isExpanded
    };
  }

  get borderStyle() {
    let color = '#9ca3af'; // pending (grey)
    if (this.course) {
      if (this.course.gradeStatus === 'passed') {
        color = '#10b981'; // passed (green)
      } else if (this.course.gradeStatus === 'failed') {
        color = '#ef4444'; // failed (red)
      }
    }
    return { 'border-left-color': color };
  }
}
