import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { HasUnsavedChanges } from '../../guards/unsaved-changes-guard';

/*
 * CUSTOM SYNCHRONOUS VALIDATOR (Hands-On 5 Task 2):
 * Returns { noCourseCode: true } if the control value starts with 'XX' (disallowed prefix).
 */
export function noCourseCode(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value && typeof value === 'string' && value.toUpperCase().startsWith('XX')) {
    return { noCourseCode: true };
  }
  return null;
}

/*
 * CUSTOM ASYNC VALIDATOR (Hands-On 5 Task 2):
 * Simulates a server-side email availability check after 800ms.
 * Returns { emailTaken: true } if the email contains 'test@'.
 */
export function simulateEmailCheck(control: AbstractControl): Promise<ValidationErrors | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const email = control.value;
      if (email && typeof email === 'string' && email.toLowerCase().includes('test@')) {
        resolve({ emailTaken: true });
      } else {
        resolve(null);
      }
    }, 800);
  });
}

@Component({
  selector: 'app-reactive-enrollment-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-enrollment-form.html',
  styleUrl: './reactive-enrollment-form.css'
})
export class ReactiveEnrollmentForm implements OnInit, HasUnsavedChanges {
  enrollForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.enrollForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      studentEmail: ['', [Validators.required, Validators.email], [simulateEmailCheck]],
      courseId: ['', [Validators.required, noCourseCode]],
      preferredSemester: ['Odd', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue],
      additionalCourses: this.fb.array([])
    });
  }

  /*
   * WHY A TYPED GETTER IS BETTER THAN CASTING IN THE TEMPLATE (Hands-On 5 Step 57):
   *
   * 1. Strong Typing & Autocomplete: Returning `FormArray` enables TypeScript and the Angular template
   *    type-checker to know the exact properties available (e.g. `.controls`), preventing runtime binding errors.
   * 2. Template Cleanliness: Templates should remain declarative. Writing casting logic in HTML, like
   *    `as FormArray`, is syntactically messy and hard to read.
   * 3. Refactor-Friendliness: If the form structure changes in the future, we only update the TS code
   *    in one place (the getter) rather than hunt down and edit multiple type-cast definitions in the HTML templates.
   */
  get additionalCourses(): FormArray {
    return this.enrollForm.get('additionalCourses') as FormArray;
  }

  addCourse(): void {
    this.additionalCourses.push(this.fb.control('', Validators.required));
  }

  removeCourse(index: number): void {
    this.additionalCourses.removeAt(index);
  }

  onSubmit(): void {
    /*
     * DIFFERENCE BETWEEN enrollForm.value AND enrollForm.getRawValue() (Hands-On 5 Step 52):
     *
     * 1. enrollForm.value:
     *    - Returns the value of all enabled form controls as a key-value object.
     *    - If any control in the form is disabled (e.g. control.disable()), its value is EXCLUDED from this object.
     *
     * 2. enrollForm.getRawValue():
     *    - Returns the value of all form controls regardless of whether they are enabled or disabled.
     *    - This is useful when you want to send the entire form state to a backend API, including read-only/disabled fields.
     */
    console.log('Reactive Form Value (value):', this.enrollForm.value);
    console.log('Reactive Form Value (getRawValue):', this.enrollForm.getRawValue());
    console.log('Reactive Form Valid:', this.enrollForm.valid);

    if (this.enrollForm.valid) {
      this.submitted = true;
    }
  }

  onReset(): void {
    this.enrollForm.reset({
      preferredSemester: 'Odd',
      agreeToTerms: false
    });
    this.additionalCourses.clear();
    this.submitted = false;
  }

  hasUnsavedChanges(): boolean {
    return this.enrollForm && this.enrollForm.dirty && !this.submitted;
  }
}
