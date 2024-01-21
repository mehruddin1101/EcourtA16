import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/services/auth.service';
import { CommonService } from 'src/services/common.service';
import { JwtService } from 'src/services/jwt.service';

declare var Razorpay: any;
@Component({
  selector: 'app-package-selection-screen',
  templateUrl: './package-selection-screen.component.html',
  styleUrls: ['./package-selection-screen.component.scss']
})
export class PackageSelectionScreenComponent implements OnInit {
  packageForm: any;
  paymentForm: any
  currentPackageDescription: any;

  packageDescriptions: any[] = [
    {
      id: 1,
      packageName: "package1",
      packageDes: "Description for package1",
      limit: 10,
      capacity: 5,
      amount: "1000",
      createdAt: "2024-01-19T16:19:44.000+0000",
      modifiedAt: "2024-01-19T16:19:44.000+0000",
      is_deleted: false,
      active: true
    },
    {
      id: 2,
      packageName: "package2",
      packageDes: "Description for package2",
      limit: 15,
      capacity: 10,
      amount: "1000",
      createdAt: "2024-01-19T16:19:44.000+0000",
      modifiedAt: "2024-01-19T16:19:44.000+0000",
      is_deleted: false,
      active: true
    },
    {
      id: 3,
      packageName: "package3",
      packageDes: "Description for package3",
      limit: 20,
      amount: "1000",
      capacity: 15,
      createdAt: "2024-01-19T16:19:44.000+0000",
      modifiedAt: "2024-01-19T16:19:44.000+0000",
      is_deleted: false,
      active: true
    }
  ]
  paymentOptions: any = [
    { id: '1', label: 'Stripe', formControlName: 'option1Control' },
    { id: '2', label: 'Razor Pay', formControlName: 'option2Control' },
  ];
  numbers: string[] = [];
  showPaymentSection = false
  constructor(private router: Router, private fb: FormBuilder,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private token: JwtService) { }

  ngOnInit() {
    this.initForm();
    this.loadStripe();

    this.commonService.getPackagesOptions().subscribe(
      (data) => {
        this.packageDescriptions = data
      },
      (error: any) => {
        this.toast.error(error.message)
        console.error('Error:', error);
      }
    );
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
      ? this.packageDescriptions.find(packageItem => packageItem.id === selectedPackage.id) || ''
      : '';
  }
  pay() {
    if (this.paymentForm.valid) {
      debugger


      if (this.paymentForm.value.selectedOption === '2') {
        this.razorpayNow()
      } else if (this.paymentForm.value.selectedOption === '1') {
        this.stripePay(100)
      }
    } else {
      this.toast.warning("select payment option")
    }
  }
  razorpayNow() {
    let userdata = this.token.decodeJwtToken()
    const RozarpayOptions = {
      packageDes: this.currentPackageDescription.packageDes,
      currency: 'INR',
      amount: this.currentPackageDescription.amount * 100,
      name: userdata.sub,
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
          debugger
          console.log('dismissed')
        }
      }
    }

    const successCallback = (paymentid: any) => {
      debugger
      console.log(paymentid);
      let obj: any = {}
      obj.packageId = this.paymentForm.value.selectedOption
      obj.userId = userdata.userId
      obj.total = this.currentPackageDescription.amount
      obj.subtotal = this.currentPackageDescription.amount
      obj.tax = 0;
      obj.transactionId = paymentid,
        obj.transactionStatus = "paid"
      obj.statusId = 1    //STATUS ID CHANGE
      obj.paymentPlatformId = 2
      obj.transactionObj = ""
      obj.errorMessage = ""
      obj.paymentMethod = ""
      this.commonService.placePackageOrder(obj).subscribe((data: any) => {
        console.log(data.data);
        this.router.navigate(["/mobile-management"])
      },
        (error: any) => {
          this.toast.error(error.message)
          console.error('Error:', error);
        })


    }

    const failureCallback = (e: any) => {
      debugger
      let obj: any = {}
      obj.packageId = this.paymentForm.value.selectedOption
      obj.userId = userdata.userId
      obj.total = this.currentPackageDescription.amount
      obj.subtotal = this.currentPackageDescription.amount
      obj.tax = 0;
      obj.transactionId = "",
        obj.transactionStatus = "failure"
      obj.statusId = 2
      obj.paymentPlatformId = 2
      obj.transactionObj = JSON.stringify(e)
      obj.errorMessage = e.message
      obj.paymentMethod = ""
      this.commonService.placePackageOrder(obj).subscribe((data: any) => {
        console.log(data.data);
        this.router.navigate(["/transactions"])
      },
        (error: any) => {
          this.toast.error(error.message)
          console.error('Error:', error);
        })
      console.log(e);
    }

    try {
      Razorpay.open(RozarpayOptions, successCallback, failureCallback);
    } catch (error) {
      debugger
      console.error('Razorpay error:', error);
    }
  }
  handler: any = null;

  currency: string = 'INR'

  stripePay(amount: any) {
    let userdata = this.token.decodeJwtToken()

    var handler = (<any>window).StripeCheckout.configure({
      key: environment.stripeKey,
      locale: 'auto',

      token: (token: any) => {
        debugger
        console.log('Token Created', token);
        var res = JSON.stringify(token)
        let obj: any = {}
        obj.packageId = this.paymentForm.value.selectedOption
        obj.userId = userdata.userId
        obj.total = this.currentPackageDescription.amount
        obj.subtotal = this.currentPackageDescription.amount
        obj.tax = 0;
        obj.transactionId = token.id,
          obj.transactionStatus = "paid"
        obj.statusId = 1    //STATUS ID CHANGE
        obj.paymentPlatformId = 2
        obj.transactionObj = res
        obj.errorMessage = ""
        obj.paymentMethod = ""
        this.commonService.placePackageOrder(obj).subscribe((data: any) => {
          console.log(data.data);
          this.router.navigate(["/mobile-management"])
        },
          (error: any) => {
            this.toast.error(error.message)
            console.error('Error:', error);
          })



      },
    });

    handler.open({
      name: 'Stripe Payment Gateway',
      description: this.currentPackageDescription.packageDes,
      amount: this.currentPackageDescription.amount.toFixed(2) * 100,
      currency: this.currency
    });
  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: environment.stripeKey,
          locale: 'auto',
          token: function (token: any) {
            debugger;
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log('Stripe Token', token.id);
            // alert('Payment Success!!');
          },
        });
      };

      window.document.body.appendChild(s);
    }
  }
}
