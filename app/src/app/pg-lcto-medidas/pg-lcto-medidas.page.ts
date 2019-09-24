import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../utils.service';
import { ModalController, NavParams } from '@ionic/angular';
import { TbGrupoPessoaInfoService } from '../TbGrupoPessoaInfo/tb-grupo-pessoa-info.service';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-pg-lcto-medidas',
  templateUrl: './pg-lcto-medidas.page.html',
  styleUrls: ['./pg-lcto-medidas.page.scss'],
})
export class PgLctoMedidasPage implements OnInit {
  grpLogado;
  pesIdLogado;
  gruIdLogado;
  inicial;
  tituloModal;
  infoLcto = {
    data:'',
    altura:'',
    peso:'',
    peso_obj:'',
  };

  constructor(
    public utilsSrv: UtilsService,
    public modalController: ModalController,
    public navParams: NavParams,
    public TbGrupoPessoaInfoSvc: TbGrupoPessoaInfoService,
  ) { }

  ngOnInit() {
    this.inicial = this.navParams.get('inicial');
    if(this.inicial){
      this.tituloModal = 'Lançar Medidas Iniciais';
    } else {
      this.tituloModal = 'Lançar Medidas';
    }

    if(this.infoLcto.data == ''){
      this.infoLcto.data = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD");
    }
  }

  async ionViewWillEnter()
  {
    let retGrpLogado = await this.utilsSrv.getGrpIdLogado();
    var grpLogado    = retGrpLogado["grpId"];
    this.grpLogado   = grpLogado;

    let retGruLogado = await this.utilsSrv.getGrupoLogado();
    this.pesIdLogado = retGruLogado["grp_pes_id"];
    this.gruIdLogado = retGruLogado["grp_gru_id"];
  }

  closeModal()
  {
    this.modalController.dismiss({
      'reload': false
    });
  }

  async salvaMedidas()
  {
    var data;
    var altura;
    var peso_kg;
    var peso_kg_obj;
    var primeira = true;
    var pesId;
    var gruId;

    if(this.infoLcto.data != ''){
      data = this.infoLcto.data;
    } else {
      data = null;
    }

    if(this.infoLcto.altura != ''){
      altura = this.infoLcto.altura;
    } else {
      altura = null;
    }

    if(this.infoLcto.peso != ''){
      peso_kg = this.utilsSrv.acerta_moeda(this.infoLcto.peso);
    } else {
      peso_kg = null;
    }

    if(this.infoLcto.peso_obj != ''){
      peso_kg_obj = this.utilsSrv.acerta_moeda(this.infoLcto.peso_obj);
    } else {
      peso_kg_obj = null;
    }

    primeira    = this.inicial;
    pesId       = this.pesIdLogado;
    gruId       = this.gruIdLogado;

    var retGPI  = await this.TbGrupoPessoaInfoSvc.salvaMedidas(data, altura, peso_kg, peso_kg_obj, primeira, pesId, gruId);
    if(retGPI["erro"]){
      this.utilsSrv.showAlert('Aviso!', '', retGPI["msg"], ['OK']);
    } else {
      this.modalController.dismiss({
        'reload': true
      });
    }
  }

  clearInput(element){
    this.infoLcto[element] = '';
  }
}
