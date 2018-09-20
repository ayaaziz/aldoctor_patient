import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NotificationPage } from '../notification/notification';
import { ProfilePage } from '../profile/profile';
import { OrderhistoryPage } from '../orderhistory/orderhistory';
import { Events } from 'ionic-angular';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = OrderhistoryPage;
  tab3Root = ProfilePage;
  tab4Root = NotificationPage;

  favCount ;
  tabindex ;
  enableTab = true;

  constructor(public events: Events) {
    this.events.subscribe('lengthdata', (count) => {
      
      this.favCount = count;
    });
    this.events.subscribe('changeIndex',(index)=>{
      console.log("index",index);
      console.log("index.index",index.index);
      console.log("this.tabindex before set",this.tabindex);
      this.tabindex = "1";
      console.log("this.tabindex after set",this.tabindex);
    });

    this.events.subscribe('enableTabs', (enabel) => {
      
      this.enableTab = enabel;
    });

  }
  

}
