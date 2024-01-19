import { Component, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-complaints-screen',
  templateUrl: './complaints-screen.component.html',
  styleUrls: ['./complaints-screen.component.scss']
})
export class ComplaintsScreenComponent {

  complains: any[] = [];
  loading: boolean = false;
  statusOptions: any[] = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Received', value: 'Received' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Unresolved', value: 'Unresolved' },
    { label: 'Closed', value: 'Closed' }
  ];
 
  selectedStatus: any;
  
  

  constructor(private fb: FormBuilder, private commonService: CommonService, private toast: ToastrService) {
    
  }

  ngOnInit() {
    this.getAllComplaints();
  }

  complainData=[]
  getAllComplaints() {
    this.commonService.getComplainAllComplains().subscribe(
      (apiData: any[]) => {
        this.complains = [];
       
        apiData.forEach((item: any) => {
         

          item.complain.forEach((complain: any) => {
            this.complainData=complain
            console.log("complain data",this.complainData)
            
            this.complains.push({
              id: complain.id,
              complainNumber: `CNR${complain.id}`,
              customerId: `CASE${complain.id}`,
              customerName: `${complain.user.firstName} ${complain.user.lastName}`,
              email: complain.user.email,
              date: complain.createdAt,
              topic: complain.topics,
              message: complain.message,
              status: complain.status,
              // updateStatus: () => this.updateStatus(complain.id, 'RESOLVED')
            });
          });
        });

        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching complaints:', error);
        this.loading = false;
      }
    );
  }
  onStatusChange(complain: any) {
    let status = complain.status.toUpperCase();
    this.toast.success(`Status Update with ${complain.status}  `)
    this.updateStatus(complain.id, status);
}


  updateStatus(complaintId: number, newStatus: string) {
    this.commonService.updateComplaintStatus(complaintId, newStatus).subscribe((res)=>{
      this.toast.success(`Status Update with ${newStatus}  `)
    });
  }
  
}
