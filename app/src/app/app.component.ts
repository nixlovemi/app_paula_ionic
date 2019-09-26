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
  };
  vInfoProgresso = {
    percentual:0,
    peso_falta:0,
  };
  vInfoProgressoGrupo = {
    perc_progresso: 0,
    progresso: 0,
    dias_ini: 0,
    dias_fim: 0,
  };

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
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleBlackOpaque();
      this.statusBar.backgroundColorByHexString('#00acc1');
      this.splashScreen.hide();

      this.events.subscribe('carregarMenuInfo', () => {
        this.carregarMenuInfo();
      });
      this.events.subscribe('carregarProgressoInfo', () => {
        this.carregarProgressoInfo();
      });
      this.events.subscribe('atualizaMenuFotoPerfil', () => {
        this.atualizaMenuFotoPerfil();
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
    await this.router.navigate(['']);
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
        url: '/home/priv',
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

  async carregarProgressoInfo()
  {
    let retGrpLogado = await this.utilsSrv.getGrpIdLogado();
    var grpLogado    = retGrpLogado["grpId"];

    let retGruLogado = await this.utilsSrv.getGrupoLogado();
    var gruLogado    = retGruLogado["grp_gru_id"];

    var retProgresso = await this.tbGrupoPessoa.pegaProgresso(grpLogado, gruLogado);
    if(!retProgresso["erro"]){
      this.vInfoProgresso.percentual = retProgresso["Progresso"]["progresso"];
      this.vInfoProgresso.peso_falta = retProgresso["Progresso"]["dif_atual"];

      this.vInfoProgressoGrupo.perc_progresso = retProgresso["Progresso_Grupo"]["percGrupo"] / 100;
      this.vInfoProgressoGrupo.progresso      = retProgresso["Progresso_Grupo"]["percGrupo"];
      this.vInfoProgressoGrupo.dias_ini       = retProgresso["Progresso_Grupo"]["diasGrupo"];
      this.vInfoProgressoGrupo.dias_fim       = retProgresso["Progresso_Grupo"]["totalDiasGrupo"];
    }
  }

  async atualizaMenuFotoPerfil()
  {
    var retUsu  = await this.utilsSrv.getUsuario();
    var Usuario = retUsu["Usuario"];
    this.infoUsuario.foto  = this.utilsSrv.getWebsiteUrl() + Usuario['foto'];
  }
}
