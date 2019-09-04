import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Carla C. L. Parra',
      url: '/home',
      icon: '',
      img:'avatar.jpg'
    },
    {
      title: 'Nutricionista 1',
      url: '/home',
      icon: '',
      img:'avatar2.jpg'
    },
    {
      title: 'Psicóloga 2',
      url: '/home',
      icon: '',
      img:'avatar3.jpg'
    },
    {
      title: 'Home',
      url: '/home',
      icon: 'assets/home.svg',
      img:''
    },
    {
      title: 'Minhas Postagens',
      url: '/home',
      icon: 'assets/accessibility.svg',
      img:''
    },
    {
      title: 'Programadas',
      url: '/home',
      icon: 'assets/alarm.svg',
      img:''
    },
    {
      title: 'Privadas',
      url: '/home',
      icon: 'assets/visibility_off.svg',
      img:''
    },
    {
      title: 'Favoritas',
      url: '/home',
      icon: 'assets/favorite.svg',
      img:''
    },
    {
      title: 'Sair',
      url: '/home',
      icon: 'assets/exit_to_app.svg',
      img:''
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  abrePerfil()
  {
    this.menuCtrl.close();
  }
}
