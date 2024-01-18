import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-case-history-screen',
  templateUrl: './case-history-screen.component.html',
  styleUrls: ['./case-history-screen.component.scss']
})
export class CaseHistoryScreenComponent implements OnInit {
  cases!: any[];

  selectedCases: any[] = [];

  representatives!: any[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  @ViewChild('addCasePanel') addCasePanel: any;
  addCaseForm: any;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }
  sendWhatsAppMessage(): void {
    const selectedCnrNumbers: any[] = this.selectedCases.map(selectedCase => selectedCase.cnrNumber);
    console.log('Sending WhatsApp messages to:', selectedCnrNumbers);
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
    this.cases = [
      {
        cnrNumber: 'CN11111',
        caseNumber: 'CASE1111',
        caseStatus: 'Open',
        date: new Date('2022-03-10'),
        previousDate: new Date('2022-03-05'),
        nextDate: new Date('2022-03-15'),
        partyName: 'Alice Johnson',
        status: 'Active',
        complaintName: 'Late Delivery',
        respondentName: 'Shipping Express',
        purposeOfHearing: 'Delivery Timeframe',
        business: 'Logistics',
      },
      {
        cnrNumber: 'CN22222',
        caseNumber: 'CASE2222',
        caseStatus: 'Pending',
        date: new Date('2022-04-18'),
        previousDate: new Date('2022-04-15'),
        nextDate: new Date('2022-04-20'),
        partyName: 'Bob Anderson',
        status: 'In Progress',
        complaintName: 'Billing Discrepancy',
        respondentName: 'Finance Solutions',
        purposeOfHearing: 'Billing Review',
        business: 'Financial Services',
      },
      {
        cnrNumber: 'CN33333',
        caseNumber: 'CASE3333',
        caseStatus: 'Resolved',
        date: new Date('2022-05-25'),
        previousDate: new Date('2022-05-20'),
        nextDate: new Date('2022-05-30'),
        partyName: 'Charlie Williams',
        status: 'Closed',
        complaintName: 'Defective Product',
        respondentName: 'Tech Innovations',
        purposeOfHearing: 'Product Replacement',
        business: 'Technology',
      },
      // Add more dummy data as needed
    ];

    this.loading = false;

    this.cases.forEach(
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
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' },
    ];
  }

  getSeverity(status: any): any {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;
    }
  }
}
