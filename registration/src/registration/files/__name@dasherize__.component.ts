import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-<%= dasherize(name) %> ',
  templateUrl: './<%= dasherize(name) %>.component.html',
  styleUrls: ['./<%= dasherize(name) %>.component.css']
})
export class <%= classify(name) %>Component {
  isPasswordVisible: boolean = false;
  passwordMinLength: number = 8;
  passwordMaxLength: number = 32;
  
  registrationForm: any = this.fb.group({
    email: [null,Validators.compose([Validators.required,
      Validators.email])],
    firstname: [null,Validators.compose([Validators.required])],
    lastname: [null,Validators.compose([Validators.required])],
    password: [null, Validators.compose([Validators.required,
      Validators.minLength(this.passwordMinLength),
      Validators.maxLength(this.passwordMaxLength),
      this.beAValidPasswordValidator])],
      gender: ['', Validators.compose([Validators.required])],
    birthday: [null,Validators.compose([Validators.required])],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    alert('Sign Up!');
  }

  beAValidPasswordValidator(control: AbstractControl): { [key: string]: any } | null {  
    let regexp = new RegExp("^[a-zA-Z0-9]*$"); // Alpha-numeric password
    if (!regexp.test(control.value)) {
    return { 'password': true };
    }
  return null;
  }

  showPassword(value): void {
    this.isPasswordVisible = value;
  }
}
