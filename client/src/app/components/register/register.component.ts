import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  public messageClass: string;
  public message: string;
  public emailValid: boolean;
  public emailMessage: string = '';
  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
    this.createRegistrationForm();

   }

   ngOnInit() {
  }

   createRegistrationForm() {
     this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        this.validateEmail
      ])],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        this.validateName
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20)
      ])],
      confirm: ['', Validators.required ]
     }, { validator : this.matchingPasswords('password', 'confirm')} );
  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateEmail: true };
    }
  }

  validateName(controls) {

    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    console.log(regExp.test(controls.value));
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { validateName: true };
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if ( group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { matchingPasswords: true };
      }
    };
  }

  onRegistrationSubmit() {
    const user = {
      email: this.form.get('email').value,
      name: this.form.get('name').value,
      password: this.form.get('password').value
    };

    this.auth.registerrUser(user).subscribe( data => {
      const res = data;
      if (data.status ===  true) {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      }
      // console.log(this.message);
    });
  }

  checkEmail() {
    const email = this.form.get('email').value;
    this.auth.checkUserEmail(email).subscribe( data => {
      if (data.status ==  true) {
        this.emailValid = true;
        this.emailMessage = data.message;
      } else {
        this.emailValid = false;
        this.emailMessage = data.message;
      }
      console.log(this.emailValid);
    });
  }

}
