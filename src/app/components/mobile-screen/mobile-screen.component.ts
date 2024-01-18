import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-mobile-screen',
  templateUrl: './mobile-screen.component.html',
  styleUrls: ['./mobile-screen.component.scss']
})
export class MobileScreenComponent {
  numbers: string[] = [];
  addNumberForm: any;
  displayModal: boolean = false;

  constructor(private fb: FormBuilder, private primengConfig: PrimeNGConfig) {
    this.addNumberForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });

    // Configure PrimeNG to use ripple effect
    this.primengConfig.ripple = true;
  }

  openAddNumberModal() {
    this.displayModal = true;
  }

  addNumber() {
    const mobileNumber = this.addNumberForm.get('mobileNumber').value;

    if (this.addNumberForm.valid && !this.numbers.includes(mobileNumber)) {
      this.numbers.push(mobileNumber);
      this.displayModal = false;
      this.addNumberForm.reset();
    }
  }

  deleteNumber(mobileNumber: string) {
    const index = this.numbers.indexOf(mobileNumber);
    if (index !== -1) {
      this.numbers.splice(index, 1);
    }
  }
}
