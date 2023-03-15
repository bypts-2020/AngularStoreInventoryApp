import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {v4 as uuidv4} from 'uuid';
import { ProductInterface } from '../product/product.interface';
import { ReceiptInterface } from './receipt.interface';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent {

  constructor(public dialog: MatDialog) { }

  receipts: ReceiptInterface[] = [];
  newReceipt: ReceiptInterface = { id: '', name: '', dateCreated: '', productIds: [], totalCost:0, customerId: '' };
  displayedColumns: string[] = ['Customer', 'Total Cost', 'Date Created', 'Date Updated', 'Action'];
  dialogOptions: any = {
    disableClose: true,
    width: '100vw'
  }

  ngOnInit(): void {
    this.getReceipts();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ReceiptDialog, { ...this.dialogOptions, data: this.newReceipt });
    dialogRef.afterClosed().subscribe(result => {
      this.newReceipt = { id: '', name: '', dateCreated: '', productIds: [], totalCost:0, customerId: '' };
      this.getReceipts();
    });
  }

  editReceipt(Receipt: ReceiptInterface){
    const dialogRef = this.dialog.open(ReceiptDialog, { ...this.dialogOptions, data: Receipt });
    dialogRef.afterClosed().subscribe(result => {
      this.getReceipts();
    });
  }

  viewReceipt(Receipt: ReceiptInterface){
    const dialogRef = this.dialog.open(ReceiptViewDialog, { ...this.dialogOptions, data: Receipt });
    dialogRef.afterClosed().subscribe(result => {
      this.getReceipts();
    });
  }

  deleteReceipt(id: string){
    this.receipts = this.receipts.filter(x => x.id !== id);
    localStorage.setItem('receipts', JSON.stringify(this.receipts));
  }

  getReceipts(){
    const getReceipt = localStorage.getItem('receipts');
    const parseReceipt = JSON.parse(getReceipt || '[]');
    this.receipts = parseReceipt;
  }

}

@Component({
  selector: 'receipt-dialog',
  templateUrl: './receipt-dialog.component.html',
})
export class ReceiptDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ReceiptInterface, public dialogRef: MatDialogRef<ReceiptDialog>, private _snackBar: MatSnackBar) {}
  products: ProductInterface[] = [];
  selectedProducts: ProductInterface[] = [];
  total: number = 0;

  ngOnInit(): void {
    this.getProducts();
    this.selectedProducts = this.data.products || [];
    this.calculateTotal();
  }

  getProducts(){
    const getProducts = localStorage.getItem('products');
    const parseProducts = JSON.parse(getProducts || '[]');
    this.products = parseProducts.filter((x: ProductInterface) => x.quantity !== 0);
  }

  calculateTotal(){
    this.total = 0;
    this.selectedProducts.forEach(element => {
      this.total += element.totalCost || 0;
    });
  }

  onSelectChange(){
    this.data.productIds.forEach(element => {
      const findProduct = this.products.filter(x => x.id == element);
      const isSelected = this.selectedProducts.filter(x => x.id == element);
      if(isSelected.length == 0){
        this.selectedProducts.push(findProduct[0]);
      }
    });
  }

  updateProducts(){
    localStorage.setItem('products', JSON.stringify(this.products));
    this.getProducts();
  }

  updateSelectedProducts(id: string, value: number){
    this.getProducts();
    this.selectedProducts.forEach(element => {
      if(element.id == id){
        const product = this.products.filter(x => x.id == id)[0];
        if(product.quantity > value){
          element.quantity = product.quantity;
          element.quantity -= Number(value);
          element.totalCost = Number(value) * Number(element.cost);
        }else{
          element.quantity = product.quantity
          element.totalCost = 0;
          element.selectedQuantity = 0;
        }
      }
    });
    this.calculateTotal();
  }

  removeProduct(id: string, quantity: number){
    this.selectedProducts = this.selectedProducts.filter(x => x.id !== id);
    this.data.productIds = this.data.productIds.filter(x => x !== id);
    this.products.forEach(element => {
      if(element.id == id){
        element.quantity += quantity;
      }
    });
    this.calculateTotal();
  }

  saveReceipt(receipt: ReceiptInterface){
    const getReceipt = localStorage.getItem('receipts');
    let parseReceipt = JSON.parse(getReceipt || '[]');
    receipt.products = this.selectedProducts;

    if(receipt.id.length == 0){
      receipt.name = parseReceipt.length;
      receipt.id = uuidv4();
      receipt.dateCreated = new Date().toLocaleDateString('en-us');
      receipt.totalCost = this.total;
      parseReceipt.push(receipt);
      this._snackBar.open("Receipt Created", "", {duration: 5 * 1000, });
    }else{
      parseReceipt = parseReceipt.map((element: ReceiptInterface) => {
        if(element.id == this.data.id){
          receipt.dateUpdated = new Date().toLocaleDateString('en-us');
          receipt.totalCost = this.total;
          element = receipt;
        }
        return element;
      });
      this._snackBar.open("Receipt Updated", "", {duration: 5 * 1000, });
    }

    for (const id of receipt.productIds) {
      const findSelected = this.selectedProducts.find(selected => selected.id == id);
      this.products.forEach(element => {
        if(element.id == id){
          element.quantity -= findSelected?.selectedQuantity || 0;
        }
      });
    }
    this.updateProducts();
    this.selectedProducts = [];
    localStorage.setItem('receipts', JSON.stringify(parseReceipt));
    this.dialogRef.close();
  }

 }

 @Component({
  selector: 'receipt-view-dialog',
  templateUrl: './receipt-view-dialog.component.html',
})
export class ReceiptViewDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ReceiptInterface, public dialogRef: MatDialogRef<ReceiptViewDialog>,) {}
  displayedColumns: string[] = ['store', 'product', 'quantity', 'total'];
  dataSource = this.data.products || [];
 }


