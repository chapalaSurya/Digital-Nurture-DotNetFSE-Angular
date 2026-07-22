import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { CourseList } from './course-list';
import { CourseCard } from '../../components/course-card/course-card';

describe('CourseListComponent with NgRx Store', () => {
  let component: CourseList;
  let fixture: ComponentFixture<CourseList>;
  let store: MockStore;

  const mockCourses = [
    { id: 1, name: 'Data Structures', code: 'CS101', credits: 4, gradeStatus: 'passed' as const },
    { id: 2, name: 'Database Systems', code: 'CS102', credits: 3, gradeStatus: 'passed' as const }
  ];

  const initialState = {
    course: {
      courses: mockCourses,
      loading: false,
      error: null
    },
    enrollment: {
      enrolledCourseIds: []
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseList, CourseCard],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseList);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  // Step 109: Test render course cards matches initial state
  it('should render course cards corresponding to initial state', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-course-card'));
    expect(cards.length).toBe(2);

    const firstCardTitle = cards[0].query(By.css('.course-title')).nativeElement.textContent;
    expect(firstCardTitle).toContain('Data Structures');
  });

  // Step 110: Test simulate loading state changes
  it('should show loading spinner when store loading status is true', () => {
    // Set store state to loading
    store.setState({
      course: {
        courses: [],
        loading: true,
        error: null
      },
      enrollment: {
        enrolledCourseIds: []
      }
    });

    fixture.detectChanges();

    const loadingSpinner = fixture.debugElement.query(By.css('.loading-state'));
    expect(loadingSpinner).toBeTruthy();

    const spinnerMessage = loadingSpinner.query(By.css('p')).nativeElement.textContent;
    expect(spinnerMessage).toContain('Loading course catalogue...');
  });
});
