import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from  "@angular/router";
import { TbLoginService } from '../TbLogin/tb-login.service';
import { UtilsService } from '../utils.service';
import { MenuController, Events, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-pg-login',
  templateUrl: './pg-login.page.html',
  styleUrls: ['./pg-login.page.scss'],
})
export class PgLoginPage implements OnInit {
  frmLogin = {
    usuario:'cliente1@gmail.com',
    senha:'Sdrobs69',
  }

  constructor(
    private loginSrv: TbLoginService,
    private utilsSrv: UtilsService,
    private router: Router,
    public menuCtrl: MenuController,
    private events: Events,
    private routerOutlet: IonRouterOutlet,
  ) { }

  ngOnInit()
  {
    this.menuCtrl.enable(false);
  }

  ionViewWillEnter()
  {
    this.routerOutlet.swipeGesture = false;
  }

  ionViewWillLeave()
  {
    this.routerOutlet.swipeGesture = true;
  }

  async executaLogin()
  {
    // pega info, faz login e pega retorno
    await this.utilsSrv.getLoader('Carregando ...', 'dots');

    let usuario = this.frmLogin.usuario;
    let senha   = this.frmLogin.senha;
    let retorno = await this.loginSrv.executaLogin(usuario, senha);

    let erro    = retorno['erro'];
    let msg     = retorno['msg'];
    let httpSts = retorno['httpStatus'];

    await this.utilsSrv.closeLoader();

    if(erro == true){
      this.utilsSrv.showAlert('Aviso!', '', msg, ['OK']);
    } else {
      var qtGrupos = Object.keys(retorno["Grupos"]).length;
      if(qtGrupos > 1){
        let navigationExtras: NavigationExtras = {
          queryParams: {
            retorno: JSON.stringify(retorno) //pq é um objeto
          }
        };
        this.router.navigate(['/pg-login-sel-grupo'], navigationExtras);
      } else {
        var vGrpId   = retorno['Grupos'][0].grp_id;
        var vUsuario = retorno['Usuario'];
        var vGrupos  = retorno['Grupos'];

        this.carregaHome(vGrpId, vUsuario, vGrupos);
      }
    }
    // ===================================
  }

  async carregaHome(vGrpId, vUsuario, vGrupos)
  {
    await this.utilsSrv.carregaHome(vGrpId, vUsuario, vGrupos);
  }
}
