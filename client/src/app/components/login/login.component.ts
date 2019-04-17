import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public messageClass: string ;
  public message: string;
  public processing: boolean;
  public form: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.createLoginForm();
  }

  ngOnInit() {
  }

  createLoginForm() {
    this.form = this.formBuilder.group({
      email : ['', Validators.compose([
        Validators.required,
        this.validateEmail
      ])],
      password: ['', Validators.required]
    });
  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateEmail: true };
    }
  }

  onLoginSubmit() {
    const user = {
      email : this.form.get('email').value,
      password : this.form.get('password').value
    };
    this.auth.login(user).subscribe( data => {
        if (data.status === true) {
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          this.auth.storeUserData(data.token, data.user);
          setTimeout( () => {
            this.router.navigate(['/dashboard']);
          }, 2000);

        } else {
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
        }
    });

  }

}
