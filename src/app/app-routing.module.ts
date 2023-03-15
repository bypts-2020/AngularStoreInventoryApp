import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { ProductComponent } from './product/product.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { StoreComponent } from './store/store.component';

const routes: Routes = [
  { path: '', component: StoreComponent },
  { path: 'store', component: StoreComponent },
  { path: 'product', component: ProductComponent },
  { path: 'receipt', component: ReceiptComponent },
  { path: 'customer', component: CustomerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
