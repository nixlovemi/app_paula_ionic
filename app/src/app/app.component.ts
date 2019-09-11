import { Component } from '@angular/core';
import { Platform, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { UtilsService } from './utils.service';
import { Router } from  "@angular/router";
import { TbGrupoPessoaService } from  "./TbGrupoPessoa/tb-grupo-pessoa.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [];
  infoUsuario = {
    nome: '',
    email: '',
    foto: '',
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuCtrl: MenuController,
    private utilsSrv: UtilsService,
    private router: Router,
    public events: Events,
    public tbGrupoPessoa: TbGrupoPessoaService,
  ) {
    this.initializeApp();
  }

  initializeApp()
  {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.events.subscribe('carregarMenuInfo', () => {
        this.carregarMenuInfo();
      });
    });
  }

  abrePerfil()
  {
    this.menuCtrl.close();
  }

  async logout()
  {
    await this.menuCtrl.enable(false);
    await this.utilsSrv.limpaSession();
    this.router.navigate(['']);
  }

  async carregarMenuInfo()
  {
    var retUsuario = await this.utilsSrv.getUsuario();
    var Usuario    = retUsuario['Usuario'];

    this.infoUsuario.nome  = Usuario['usuario'];
    this.infoUsuario.email = Usuario['email'];
    this.infoUsuario.foto  = this.utilsSrv.getPathImgPadrao();
    if(Usuario['foto'] != "" && Usuario['foto'] != null){
      this.infoUsuario.foto  = this.utilsSrv.getWebsiteUrl() + Usuario['foto'];
    }

    var retGruLogado = await this.utilsSrv.getGruIdLogado();
    var GrupoLogado  = retGruLogado["gruId"];

    var retGrpLogado = await this.utilsSrv.getGrpIdLogado();
    var grpLogado    = retGrpLogado["grpId"];

    // menu staff
    this.appPages = [];
    console.log('MENU', GrupoLogado);

    var retStaff = await this.tbGrupoPessoa.pegaGrupoStaff(GrupoLogado);
    if(!retStaff["erro"]){
      for(let idx in retStaff["Staff"]){
        var Staff    = retStaff["Staff"][idx];
        var nome     = Staff["pes_nome"];
        var grpId    = Staff["grp_id"];
        var foto     = this.utilsSrv.getPathImgPadrao();
        if(Staff["pes_foto"] != "" && Staff["pes_foto"] != null){
          foto = this.utilsSrv.getWebsiteUrl() + Staff["pes_foto"];
        }

        var menuItem = {
          title: nome,
          url: '/home/' + grpId,
          icon: '',
          img: foto,
        };
        this.appPages.push(menuItem);
      }
    }
    // ==========

    // outros menus
    var menuItem2 = {
      title: 'Home',
      url: '/home',
      icon: 'assets/home.svg',
      img: '',
    };
    this.appPages.push(menuItem2);

    var menuItem2 = {
      title: 'Minhas Postagens',
      url: '/home/' + grpLogado,
      icon: 'assets/accessibility.svg',
      img: '',
    };
    this.appPages.push(menuItem2);

    if(Usuario['cliente'] == 0){
      var menuItem2 = {
        title: 'Programadas',
        url: '/home/prog',
        icon: 'assets/alarm.svg',
        img: '',
      };
      this.appPages.push(menuItem2);

      var menuItem2 = {
        title: 'Privadas',
        url: '/home',
        icon: 'assets/visibility_off.svg',
        img: '',
      };
      this.appPages.push(menuItem2);
    }

    var menuItem2 = {
      title: 'Favoritas',
      url: '/home/fav',
      icon: 'assets/favorite.svg',
      img: '',
    };
    this.appPages.push(menuItem2);
    // ============

    await this.menuCtrl.enable(true);
  }
}
