import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NotificationPage } from '../notification/notification';
import { ProfilePage } from '../profile/profile';
import { OrderhistoryPage } from '../orderhistory/orderhistory';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = OrderhistoryPage;
  tab3Root = ProfilePage;
  tab4Root = NotificationPage;

  constructor() {

  }
}
