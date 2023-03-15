import { Component } from '@angular/core';
import { MenuItems } from './layout.interface';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  constructor() { }

  menus: MenuItems[] = [
    { route: "store", icon: "store", name: "Stores" },
    { route: "product", icon: "shoppingcart", name: "Products" },
    { route: "customer", icon: "person", name: "Customer" },
    { route: "receipt", icon: "payments", name: "Receipt" },
    ];

}
