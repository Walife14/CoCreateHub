import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  isLoading = false;
  errorMessage?: string;

  loginForm!: FormGroup;
  isSubmitted = false;
  returnUrl = ''

  showAbout = false;

  constructor(
    private formBuilder: FormBuilder, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl
  }

  get fc() {
    return this.loginForm.controls
  }

  onSubmit() {
    this.isSubmitted = true
    this.errorMessage = ''
    
    if (this.loginForm.invalid) return;
    this.isLoading = true

    this.authService.login({ email: this.fc.email.value.toLowerCase(), password: this.fc.password.value }).subscribe({
      next: (response) => {
        this.isLoading = false
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl)
        } else {
          this.router.navigate(['/dashboard/home'])
        }
      },
      error: (error) => {
        this.isLoading = false
        this.errorMessage = error.error.error
      }
    })
  }

}
