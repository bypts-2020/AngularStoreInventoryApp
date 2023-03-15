import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreDialog, StoreComponent } from './store/store.component';
import { ReceiptComponent, ReceiptDialog, ReceiptViewDialog } from './receipt/receipt.component';
import { ProductComponent, ProductDialog } from './product/product.component';
import { CustomerComponent, CustomerDialog } from './customer/customer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    StoreComponent,
    ReceiptComponent,
    ProductComponent,
    ProductDialog,
    CustomerComponent,
    CustomerDialog,
    LayoutComponent,
    StoreDialog,
    ReceiptDialog,
    ReceiptViewDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
