import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CourseCard } from './course-card';
import { CreditLabelPipe } from '../../pipes/credit-label-pipe';

describe('CourseCardComponent', () => {
  let component: CourseCard;
  let fixture: ComponentFixture<CourseCard>;
  let store: MockStore;
  const mockCourse = {
    id: 1,
    name: 'Data Structures',
    code: 'CS101',
    credits: 4,
    gradeStatus: 'passed' as const
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCard, CreditLabelPipe],
      providers: [
        provideMockStore({
          initialState: { enrollment: { enrolledCourseIds: [] } }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCard);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.course = mockCourse;
    fixture.detectChanges();
  });

  // Step 102: should create
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Step 103: should render @Input() course
  it('should display the course name when @Input() course is set', () => {
    const titleEl = fixture.debugElement.query(By.css('.course-title')).nativeElement;
    expect(titleEl.textContent).toContain('Data Structures');
  });

  // Step 104: should emit @Output() enrollRequested
  it('should emit enrollRequested and call onEnrollClick when Enroll is clicked', () => {
    spyOn(component.enrollRequested, 'emit');
    
    // Find the enroll button (the last button in card actions)
    const buttons = fixture.debugElement.queryAll(By.css('.card-actions button'));
    const enrollButton = buttons[1].nativeElement; // 0 is Details, 1 is Enroll
    
    enrollButton.click();
    fixture.detectChanges();

    expect(component.enrollRequested.emit).toHaveBeenCalledWith(1);
  });

  // Step 105: should test ngOnChanges console spy
  it('should log changes on ngOnChanges', () => {
    spyOn(console, 'log');
    
    const changes: SimpleChanges = {
      course: new SimpleChange(null, mockCourse, true)
    };
    
    component.ngOnChanges(changes);
    
    expect(console.log).toHaveBeenCalled();
  });
});
