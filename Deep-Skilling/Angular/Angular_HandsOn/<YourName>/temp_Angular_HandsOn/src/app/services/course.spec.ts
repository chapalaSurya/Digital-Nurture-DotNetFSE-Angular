import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course';
import { Course } from '../models/course.model';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  const mockCourses: Course[] = [
    { id: 1, name: 'Data Structures', code: 'CS101', credits: 4, gradeStatus: 'passed' },
    { id: 2, name: 'Database Systems', code: 'CS102', credits: 3, gradeStatus: 'passed' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CourseService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve filtered courses with credits > 0', () => {
    service.getCourses().subscribe((courses) => {
      expect(courses.length).toBe(2);
      expect(courses[0].name).toBe('Data Structures');
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  // Step 108: test error handling with retry(2) strategy
  it('should propagate errors when getCourses fails after 2 retries (3 requests total)', () => {
    service.getCourses().subscribe({
      next: () => fail('expected an error, not courses'),
      error: (err) => {
        expect(err.message).toContain('Failed to load courses. Please try again.');
      }
    });

    // 1st request fails
    const req1 = httpMock.expectOne('http://localhost:3000/courses');
    req1.flush('Error 1', { status: 500, statusText: 'Internal Server Error' });

    // 2nd request (1st retry) fails
    const req2 = httpMock.expectOne('http://localhost:3000/courses');
    req2.flush('Error 2', { status: 500, statusText: 'Internal Server Error' });

    // 3rd request (2nd retry) fails
    const req3 = httpMock.expectOne('http://localhost:3000/courses');
    req3.flush('Error 3', { status: 500, statusText: 'Internal Server Error' });
  });
});
