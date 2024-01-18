import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private authService: AuthService,
   
    private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }
  resetPasswordSendForm: any
  submitted = false;
  sendOtp= false;
  isVerified= false
 
  userID:any;
  private initForm() {
    this.resetPasswordSendForm = this.fb.group({
      mobileNumber: ["+91", [
        Validators.required,
        Validators.pattern(/^\+91[0-9]{10}$/),
    ]],
    otp:["",Validators.required]

    });
  }

  sendVerificationOtp() {
    this.submitted = true;
      this.authService.forgotPassword(this.resetPasswordSendForm.value).subscribe(
        (res) => {
          if (res.status ===200){
            this.sendOtp=true
            console.log(res)
            console.log(res.userId)
          
          }
        },
        (error) => {
          console.error(error);
          
        }
      );
    
  }
  verifyOtp(){
    if(this.resetPasswordSendForm.valid){
      this.authService.verifyForgotPasswordOtp(this.resetPasswordSendForm.value).subscribe((res)=>{
        if (res.status===200){
          this.isVerified=true
          console.log(res)
          this.userID=res.userID
          localStorage.setItem("id", JSON.stringify(res.userId))
          console.log('otpVeriied');
        }
        if (res.status==400){
          console.log('inavlid otp');
        }
      })
    }
  }
  navigateToReset(){
    if (this.isVerified){

      this.router.navigate(["/reset-password"])
    }
  }
  
}
