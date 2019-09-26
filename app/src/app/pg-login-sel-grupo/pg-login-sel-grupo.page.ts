import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, IonRouterOutlet } from '@ionic/angular';
import { UtilsService } from '../utils.service';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-pg-login-sel-grupo',
  templateUrl: './pg-login-sel-grupo.page.html',
  styleUrls: ['./pg-login-sel-grupo.page.scss'],
})
export class PgLoginSelGrupoPage implements OnInit {
  retorno;
  arrGrupos = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuCtrl: MenuController,
    private utilsSrv: UtilsService,
    private routerOutlet: IonRouterOutlet,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.retorno) {
        this.retorno = JSON.parse(params.retorno);
      }

      for(let idx in this.retorno["Grupos"]){
        var Grupo = this.retorno["Grupos"][idx];
        var item  = {
          idx: idx,
          grupo: Grupo["gru_descricao"],
          inicio: moment(Grupo["gru_dt_inicio"]).tz("America/Sao_Paulo").format("DD/MM/YY"),
          fim: moment(Grupo["gru_dt_termino"]).tz("America/Sao_Paulo").format("DD/MM/YY"),
        };
        this.arrGrupos.push(item);
      }
    });
  }

  ngOnInit() { }

  ionViewWillEnter()
  {
    this.routerOutlet.swipeGesture = false;
  }

  ionViewWillLeave()
  {
    this.routerOutlet.swipeGesture = true;
  }

  async abrirGrupo(idx)
  {
    var vGrpId   = this.retorno['Grupos'][idx].grp_id;
    var vUsuario = this.retorno['Usuario'];
    var vGrupos  = this.retorno['Grupos'];

    await this.utilsSrv.carregaHome(vGrpId, vUsuario, vGrupos);
  }

  async voltarLogin()
  {
    await this.menuCtrl.enable(false);
    await this.utilsSrv.limpaSession();
    await this.router.navigate(['']);

    this.retorno   = {};
    this.arrGrupos = [];
  }
}
