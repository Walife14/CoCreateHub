import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  isSubmitted = false;

  isLoading = false;

  successMessage?: string;
  errorMessage?: string;

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required]
    })
  }

  get fc() {
    return this.form.controls
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true


    // lowercase email, as they're all stored in lower case!
    this.authService.forgotPassword(this.fc.email.value.toLowerCase()).subscribe({
      next: (success) => {
        this.isLoading = false
        this.successMessage = 'Successfully sent! Check your email for further instructions!'
      },
      error: (error) => {
        this.isLoading = false
        this.errorMessage = error.error.error
      }
    })
  }

}
