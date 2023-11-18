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

  loginForm!: FormGroup;
  isSubmitted = false;
  returnUrl = ''

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
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    this.authService.login({
      email: this.fc.email.value,
      password: this.fc.password.value
    }).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl)
    })
  }

}
