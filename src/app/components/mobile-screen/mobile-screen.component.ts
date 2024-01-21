import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { CommonService } from 'src/services/common.service';
import { JwtService } from 'src/services/jwt.service';

@Component({
  selector: 'app-mobile-screen',
  templateUrl: './mobile-screen.component.html',
  styleUrls: ['./mobile-screen.component.scss']
})
export class MobileScreenComponent {
  numbers: string[] = [];
  addNumberForm: any;
  displayModal: boolean = false;

  constructor(private fb: FormBuilder, private token: JwtService, private primengConfig: PrimeNGConfig, private common: CommonService, private toast: ToastrService) {
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
    let obj: any = {}
    obj.number = mobileNumber
    obj.numbers = mobileNumber
    obj.userId = this.token.decodeJwtToken().userId,
      obj.packageId = ""
    if (this.addNumberForm.valid && !this.numbers.includes(mobileNumber)) {
      this.common.addPackageMobile(obj).subscribe((data) => {
        this.toast.success("Number Added")
        this.displayModal = false;
        this.addNumberForm.reset();
      }, (error) => {
        this.toast.error(error.message)
      })
      this.numbers.push(mobileNumber);
      this.displayModal = false;
      this.addNumberForm.reset();
    }
  }

  deleteNumber(mobileNumber: string) {
    const index = this.numbers.indexOf(mobileNumber);
    this.common.deletePackageMobile(mobileNumber).subscribe((data) => {
      this.toast.success("Number deleted")

    }, (error) => {
      this.toast.error(error.message)
    })
    if (index !== -1) {
      this.numbers.splice(index, 1);
    }
  }
}
