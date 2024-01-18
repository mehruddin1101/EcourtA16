import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-transactions-screen',
  templateUrl: './transactions-screen.component.html',
  styleUrls: ['./transactions-screen.component.scss']
})
export class TransactionsScreenComponent {
  transactions!: any[];

  selectedCustomers!: any[];

  representatives!: any[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  addCaseForm: any;
  statusOptions: any[];
  selectedStatus: any;

  constructor(private fb: FormBuilder) {
    this.statusOptions = [
      { label: 'Pending', value: 'Pending' },
      { label: 'Received', value: 'Received' },
      { label: 'Resolved', value: 'Resolved' },
      { label: 'Unresolved', value: 'Unresolved' },
      { label: 'Closed', value: 'Closed' }
    ];
  }
  ngOnInit() {
    this.transactions = [
      {
        transactionId: 1,
        package: 'Gold Package',
        customerName: 'John Doe',
        email: 'john.doe@example.com',
        method: 'Credit Card',
        date: new Date('2022-01-15'),
        status: 'Completed'
      },
      {
        transactionId: 2,
        package: 'Silver Package',
        customerName: 'Jane Smith',
        email: 'jane.smith@example.com',
        method: 'PayPal',
        date: new Date('2022-02-20'),
        status: 'Pending'
      },
      {
        transactionId: 3,
        package: 'Platinum Package',
        customerName: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        method: 'Bank Transfer',
        date: new Date('2022-03-05'),
        status: 'Failed'
      },
      // Add more dummy data as needed
    ];
    this.loading = false;

    this.transactions.forEach(
      (transactions) => (transactions.date = new Date(<Date>transactions.date))
    );

  }
}
