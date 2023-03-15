import { Component, Inject } from '@angular/core';
import { ProductInterface } from './product.interface';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {v4 as uuidv4} from 'uuid';
import { StoreInterface } from '../store/store.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  constructor(public dialog: MatDialog) { }

  products: ProductInterface[] = [];
  newProduct: ProductInterface = { id: '', name: '', cost: 0, quantity: 0, storeId: ''};
  displayedColumns: string[] = ['Store Name', 'Name', 'Cost', 'Quantity', 'Action'];
  dialogOptions: any = {
    width: '40%',
    disableClose: true
  }

  ngOnInit(): void {
    this.getProducts();
  }

  openDialog() {
    this.newProduct = { id: '', name: '', cost: 0, quantity: 0, storeId: ''};
    const dialogRef = this.dialog.open(ProductDialog, { ...this.dialogOptions, data: this.newProduct });
    dialogRef.afterClosed().subscribe(result => {
      this.getProducts();
    });
  }

  editProduct(product: ProductInterface){
    const dialogRef = this.dialog.open(ProductDialog, { ...this.dialogOptions, data: product });
    dialogRef.afterClosed().subscribe(result => {
      this.getProducts();
    });
  }

  deleteProduct(id: string){
    this.products = this.products.filter(x => x.id !== id);
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  getProducts(){
    const getProduct = localStorage.getItem('products');
    const parseProduct = JSON.parse(getProduct || '[]');
    this.products = parseProduct;
  }

}

@Component({
  selector: 'product-dialog',
  templateUrl: './product-dialog.component.html',
})
export class ProductDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductInterface, public dialogRef: MatDialogRef<ProductDialog>, private _snackBar: MatSnackBar) {}

  stores: StoreInterface[] = [];

  ngOnInit(): void {
    const getStore = localStorage.getItem('stores');
    const parseStore = JSON.parse(getStore || '[]');
    this.stores = parseStore;
  }

  saveProduct(product: ProductInterface){
    const getProduct = localStorage.getItem('products');
    const getStore = localStorage.getItem('stores');
    let parseStore = JSON.parse(getStore || '[]');
    let parseProduct = JSON.parse(getProduct || '[]');

    product.store = parseStore.filter((x: StoreInterface) => x.id == product.storeId)[0];
    if(product.id.length == 0){
      product.id = uuidv4();
      parseProduct.push(product);
      this._snackBar.open("Product Created", "", {duration: 5 * 1000, });
    }else{
      parseProduct = parseProduct.map((element: ProductInterface) => {
        if(element.id == this.data.id){
          element = product;
        }
        return element;
      });
      this._snackBar.open("Product Updated", "", {duration: 5 * 1000, });
    }

    localStorage.setItem('products', JSON.stringify(parseProduct));
    this.dialogRef.close();
  }

 }
