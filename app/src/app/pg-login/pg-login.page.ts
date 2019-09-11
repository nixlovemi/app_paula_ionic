import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { TbLoginService } from '../TbLogin/tb-login.service';
import { UtilsService } from '../utils.service';
import { MenuController, Events } from '@ionic/angular';

@Component({
  selector: 'app-pg-login',
  templateUrl: './pg-login.page.html',
  styleUrls: ['./pg-login.page.scss'],
})
export class PgLoginPage implements OnInit {
  frmLogin = {
    usuario:'nixlovemi@gmail.com',
    senha:'Sdrobs69',
  }

  constructor(
    private loginSrv: TbLoginService,
    private utilsSrv: UtilsService,
    private router: Router,
    public menuCtrl: MenuController,
    private events: Events,
  ) { }

  ngOnInit()
  {
    this.menuCtrl.enable(false);
  }

  async ionViewWillEnter(){ }

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
      var vGrpId   = retorno['Grupos'][0].grp_id;
      var vUsuario = retorno['Usuario'];
      var vGrupos  = retorno['Grupos'];

      await this.utilsSrv.gravaInfoLogin(vGrpId, vUsuario, vGrupos);
      await this.router.navigate(['/home']);
      await this.events.publish('carregarMenuInfo');
    }
    // ===================================
  }
}
