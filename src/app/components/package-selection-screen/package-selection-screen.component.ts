import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare var Razorpay: any;
@Component({
  selector: 'app-package-selection-screen',
  templateUrl: './package-selection-screen.component.html',
  styleUrls: ['./package-selection-screen.component.scss']
})
export class PackageSelectionScreenComponent implements OnInit {
  packageForm: any;
  paymentForm: any
  currentPackageDescription: string = '';

  packageDescriptions: any[] = [
    { pacakgeId: 1, amount: "1000", pacakeName: 'package one', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor totam ut quas rem repellat quae quam corrupti consequatur molestias numquam! Nobis voluptates excepturi autem culpa! Odit ullam eligendi dolore minima! 1' },
    { pacakgeId: 2, amount: "2050", pacakeName: 'package two', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor totam ut quas rem repellat quae quam corrupti consequatur molestias numquam! Nobis voluptates excepturi autem culpa! Odit ullam eligendi dolore minima! 2' },
    { pacakgeId: 3, amount: "5000", pacakeName: 'package three', description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor totam ut quas rem repellat quae quam corrupti consequatur molestias numquam! Nobis voluptates excepturi autem culpa! Odit ullam eligendi dolore minima! 3' },
  ];
  paymentOptions: any = [
    { id: '1', label: 'Stripe', formControlName: 'option1Control' },
    { id: '2', label: 'Razor Pay', formControlName: 'option2Control' },
  ];
  numbers: string[] = [];
  showPaymentSection = false
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.packageForm = this.fb.group({
      selectedPackage: ['', [Validators.required]],
    });

    this.packageForm.valueChanges.subscribe(() => {
      this.packageSelected();
    });
    this.paymentForm = this.fb.group({
      selectedOption: ['', [Validators.required]],
    });
  }
  showPaymentSectionToggle() {
    debugger
    if (this.packageForm.controls.selectedPackage.valid) {
      this.showPaymentSection = true

    }
  }
  packageSelected() {
    this.updatePackageDescription();
  }

  private updatePackageDescription() {
    const selectedPackage = this.packageForm.value.selectedPackage;
    this.currentPackageDescription = selectedPackage
      ? this.packageDescriptions.find(packageItem => packageItem.pacakgeId === selectedPackage.pacakgeId)?.description || ''
      : '';
  }
  pay() {
    if (this.paymentForm.valid) {
      debugger
      if (this.paymentForm.value.selectedOption === '2') {
        this.razorpayNow()

      }
    }
  }
  razorpayNow() {
    const RozarpayOptions = {
      description: 'Sample Razorpay demo',
      currency: 'INR',
      amount: 100000,
      name: 'Sai',
      key: environment.razorKey,
      image: 'https://i.imgur.com/FApqk3D.jpeg',
      prefill: {
        name: 'Ecourt',
        email: 'sai@gmail.com',
        phone: '9898989898'
      },
      theme: {
        color: '#6466e3'
      },
      modal: {
        ondismiss: () => {
          console.log('dismissed')
        }
      }
    }

    const successCallback = (paymentid: any) => {
      console.log(paymentid);
      this.router.navigate(["/mobile-management"])

    }

    const failureCallback = (e: any) => {
      this.router.navigate(["/transactions"])
      console.log(e);
    }

    Razorpay.open(RozarpayOptions, successCallback, failureCallback)
  }
}
