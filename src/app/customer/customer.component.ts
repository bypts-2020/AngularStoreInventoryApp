import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerInterface } from './customer.interface';
import {v4 as uuidv4} from 'uuid';
import { ReceiptInterface } from '../receipt/receipt.interface';
import { ReceiptDialog } from '../receipt/receipt.component';
import { MatSnackBar } from '@angular/material/snack-bar';

  const durationInSeconds = 5;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {

  constructor(public dialog: MatDialog) { }

  customers: CustomerInterface[] = [];
  newCustomer: CustomerInterface = { id: '', name: '', email: '', street: '', city: '', state: '', country: '', telephone: '' };
  newReceipt: ReceiptInterface = { id: '', name: '', dateCreated: '', productIds: [], totalCost:0, customerId: '' };
  displayedColumns: string[] = ['Name', 'Email', 'Telephone', 'Country', 'Action'];
  dialogOptions: any = {
    width: '50%',
    disableClose: true
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  openDialog() {
    this.newCustomer = { id: '', name: '', email: '', street: '', city: '', state: '', country: '', telephone: '' };
    const dialogRef = this.dialog.open(CustomerDialog, { ...this.dialogOptions, data: this.newCustomer });
    dialogRef.afterClosed().subscribe(result => {
      this.getCustomers();
    });
  }

  editCustomer(customer: CustomerInterface){
    const dialogRef = this.dialog.open(CustomerDialog, { ...this.dialogOptions, data: customer });
    dialogRef.afterClosed().subscribe(result => {
      this.getCustomers();
    });
  }

  deleteCustomer(id: string){
    this.customers = this.customers.filter(x => x.id !== id);
    localStorage.setItem('customers', JSON.stringify(this.customers));
  }

  addCustomerReceipt(customer: CustomerInterface){
   this.newReceipt = { id: '', name: '', dateCreated: '', productIds: [], totalCost:0, customerId: '' };
    this.newReceipt.customer = customer;
    this.newReceipt.customerId = customer.id;
    const dialogRef = this.dialog.open(ReceiptDialog, { ...this.dialogOptions, data: this.newReceipt });
    dialogRef.afterClosed().subscribe(result => {
      this.getCustomers();
    });
  }

  getCustomers(){
    const getCustomer = localStorage.getItem('customers');
    const parseCustomer = JSON.parse(getCustomer || '[]');
    this.customers = parseCustomer;
  }

}

@Component({
  selector: 'customer-dialog',
  templateUrl: './customer-dialog.component.html',
})
export class CustomerDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CustomerInterface, public dialogRef: MatDialogRef<CustomerDialog>, private _snackBar: MatSnackBar) {}
  saveCustomer(customer: CustomerInterface){
    const getCustomer = localStorage.getItem('customers');
    let parseCustomer = JSON.parse(getCustomer || '[]');
    if(customer.id.length == 0){
      customer.id = uuidv4();
      parseCustomer.push(customer);
      this._snackBar.open("Customer Created", "", {duration: durationInSeconds * 1000, });
    }else{
      parseCustomer = parseCustomer.map((element: CustomerInterface) => {
        if(element.id == this.data.id){
          element = customer;
        }
        return element;
      });

      this._snackBar.open("Customer Updated", "", {duration: durationInSeconds * 1000, });
    }
      localStorage.setItem('customers', JSON.stringify(parseCustomer));
    this.dialogRef.close();
  }

 }
