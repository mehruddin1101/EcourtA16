import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-message-status-screen',
  templateUrl: './message-status-screen.component.html',
  styleUrls: ['./message-status-screen.component.scss']
})
export class MessageStatusScreenComponent {
  customers!: any[];

  selectedCustomers!: any[];

  representatives!: any[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  @ViewChild('addCasePanel') addCasePanel: any;
  addCaseForm: any;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }
  initializeForm() {
    this.addCaseForm = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      courtComplex: ['', Validators.required],
      caseNumber: ['', Validators.required],
      cnrNumber: [null, Validators.required],
      caseDate: [null, Validators.required],
      caseType: ['', Validators.required],
    });
  }

  showAddCasePanel() {
    this.addCasePanel.toggle(event);
  }

  submitAddCaseForm() {
    if (this.addCaseForm.valid) {
      // Handle form submission logic here
      // You can access form values using this.addCaseForm.value
      this.addCasePanel.hide();
      this.initializeForm();
    }
  }
  countryOptions = [
    { label: 'USA', value: 'USA' },
    { label: 'Canada', value: 'Canada' },
    // Add more countries as needed
  ];
  
  stateOptions = [
    { label: 'New York', value: 'NY' },
    { label: 'California', value: 'CA' },
    // Add more states as needed
  ];
  
  districtOptions = [
    { label: 'District A', value: 'DistrictA' },
    { label: 'District B', value: 'DistrictB' },
    // Add more districts as needed
  ];
  
  caseTypeOptions = [
    { label: 'Civil', value: 'Civil' },
    { label: 'Criminal', value: 'Criminal' },
    // Add more case types as needed
  ];
  
  ngOnInit() {
    this.customers = [
      {
        Id: 1,
        cnrNumber: 1012,
        caseNumber: 21,
        partyName: 'Jones',
        nextDate: new Date(),
        validateAndApprove: 'approved',
      },
      {
        Id: 2,
        cnrNumber: 213,
        caseNumber: 2123,
        partyName: 'Smith',
        nextDate: new Date('2022-02-01'),
        validateAndApprove: 'pending',
      },
      {
        Id: 3,
        cnrNumber: 123,
        caseNumber: 3453,
        partyName: 'Johnson',
        nextDate: new Date('2022-02-15'),
        validateAndApprove: 'approved',
      },
      {
        Id: 4,
        cnrNumber: 434,
        caseNumber: 324,
        partyName: 'Williams',
        nextDate: new Date('2022-03-01'),
        validateAndApprove: 'rejected',
      },
    ];
    this.loading = false;

    this.customers.forEach(
      (customer) => (customer.date = new Date(<Date>customer.date))
    );

    this.representatives = [
      { name: 'Amy Elsner', image: 'amyelsner.png' },
      { name: 'Anna Fali', image: 'annafali.png' },
      { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
      { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
      { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
      { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
      { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
      { name: 'Onyama Limba', image: 'onyamalimba.png' },
      { name: 'Stephen Shaw', image: 'stephenshaw.png' },
      { name: 'Xuxue Feng', image: 'xuxuefeng.png' },
    ];

    this.statuses = [
      { label: 'Success', value: 'Success' },
      { label: 'Failed', value: 'Failed' },
      { label: 'Pending', value: 'Pending' }
    ];
  }

  getSeverity(status: any): any {
    switch (status) {
      case 'Success':
        return 'danger';

      case 'Failed':
        return 'success';

      case 'Pending':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;
    }
  }
}
