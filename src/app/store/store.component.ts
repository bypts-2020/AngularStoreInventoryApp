import { Component, Inject } from '@angular/core';
import { StoreInterface } from './store.interface';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {v4 as uuidv4} from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent {

  constructor(public dialog: MatDialog) { }

  stores: StoreInterface[] = [];
  newStore: StoreInterface = { id: '', name: '', email: '', street: '', city: '', state: '', country: '', telephone: '' };
  displayedColumns: string[] = ['Name', 'Email', 'Telephone', 'Country', 'Action'];
  dialogOptions: any = {
    width: '50%',
    disableClose: true
  }

  ngOnInit(): void {
    this.getStores();
  }

  openDialog() {
    const dialogRef = this.dialog.open(StoreDialog, { ...this.dialogOptions, data: this.newStore });
    dialogRef.afterClosed().subscribe(result => {
      this.getStores();
    });
  }

  editStore(store: StoreInterface){
    const dialogRef = this.dialog.open(StoreDialog, { ...this.dialogOptions, data: store });
    dialogRef.afterClosed().subscribe(result => {
      this.getStores();
    });
  }

  deleteStore(id: string){
    this.stores = this.stores.filter(x => x.id !== id);
    localStorage.setItem('stores', JSON.stringify(this.stores));
  }

  getStores(){
    const getStore = localStorage.getItem('stores');
    const parseStore = JSON.parse(getStore || '[]');
    this.stores = parseStore;
  }

}

@Component({
  selector: 'store-dialog',
  templateUrl: './store-dialog.component.html',
})
export class StoreDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: StoreInterface, public dialogRef: MatDialogRef<StoreDialog>, private _snackBar: MatSnackBar) {}
  saveStore(store: StoreInterface){
    const getStore = localStorage.getItem('stores');
    let parseStore = JSON.parse(getStore || '[]');
    if(store.id.length == 0){
      store.id = uuidv4();
      parseStore.push(store);
      this._snackBar.open("Store Created", "", {duration: 5 * 1000, });
    }else{
      parseStore = parseStore.map((element: StoreInterface) => {
        if(element.id == this.data.id){
          element = store;
        }
        return element;
      });
      this._snackBar.open("Store Updated", "", {duration: 5 * 1000, });
    }
      localStorage.setItem('stores', JSON.stringify(parseStore));
    this.dialogRef.close();
  }

 }
