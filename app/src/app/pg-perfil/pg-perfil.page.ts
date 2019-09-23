import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { UtilsService } from '../utils.service';
import { TbGrupoPessoaService } from  "../TbGrupoPessoa/tb-grupo-pessoa.service";
import { CurrencyPipe } from '@angular/common';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-pg-perfil',
  templateUrl: './pg-perfil.page.html',
  styleUrls: ['./pg-perfil.page.scss'],
})
export class PgPerfilPage implements OnInit {
  @ViewChild("progressaoMedidas", {static: false}) progressaoMedidas: ElementRef;
  private lineChart: Chart;

  grpLogado;
  vGrupoPessoa;
  Medidas;
  infoInicial;
  infoDemais;
  infoProgresso;
  infoImc;

  fotoLogado;
  nomeLogado;
  emailLogado;
  nomeGrupoLogado;
  dtIniGrupoLogado;
  dtFimGrupoLogado;
  showLctoInicial;
  vInfoInicial = {
    data:'',
    altura:'',
    peso:'',
    peso_obj:'',
    peso_dif:''
  };
  vInfoProgresso = {
    percentual : '',
    peso_falta : '',
  };
  vInfoImc = {
    imc:'',
    resultado:''
  };
  vCalcAgua;
  vLoopMedidas = [];

  constructor(
    public utilsSrv: UtilsService,
    private TbGrupoPessoa: TbGrupoPessoaService,
    public currencyPipe: CurrencyPipe
  ) { }

  ngOnInit()
  {
    //this.iniciaGrafico();
    /*
    After:

    // query results available in ngOnInit
    @ViewChild('foo', {static: true}) foo: ElementRef;

    OR

    // query results available in ngAfterViewInit
    @ViewChild('foo', {static: false}) foo: ElementRef;
    */
  }

  async ngAfterViewInit()
  {
    if(typeof this.infoDemais != 'undefined' && this.infoDemais.length > 0){
      let grafLabel = [];
      let grafPeso  = [];
      var grafIdx   = 1;
      for(let idx in this.infoDemais){
        var medidaDemais = this.infoDemais[idx];

        grafLabel.push(grafIdx + '');
        grafPeso.push(medidaDemais["gpi_peso"]);
        grafIdx = grafIdx + 1;
      }

      // grafico
      this.lineChart = new Chart(this.progressaoMedidas.nativeElement, {
        type: "line",
        data: {
          labels: grafLabel,
          datasets: [
            {
              label: "Pesagens",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(6,176,197,0.4)",
              borderColor: "rgba(6,176,197,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(6,176,197,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(6,176,197,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: grafPeso,
              spanGaps: false
            }
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              onClick: null
            }
          }
        }
      });
      // =======
    }
  }

  async ionViewWillEnter()
  {
    let retGrpLogado = await this.utilsSrv.getGrpIdLogado();
    var grpLogado    = retGrpLogado["grpId"];
    this.grpLogado   = grpLogado;

    var retUsuario = await this.utilsSrv.getUsuario();
    if(!retUsuario["erro"]){
      this.vGrupoPessoa = retUsuario["Usuario"];
      this.nomeLogado   = this.vGrupoPessoa["usuario"];
      this.emailLogado  = this.vGrupoPessoa["email"];

      this.fotoLogado = this.utilsSrv.getPathImgPadrao();
      if(this.vGrupoPessoa["foto"] != "" && this.vGrupoPessoa["foto"] != null){
        this.fotoLogado = this.utilsSrv.getWebsiteUrl() + this.vGrupoPessoa["foto"];
      }
    }

    var retGrupoLogado    = await this.utilsSrv.getGrupoLogado();
    this.nomeGrupoLogado  = retGrupoLogado["gru_descricao"];
    this.dtIniGrupoLogado = moment(retGrupoLogado["gru_dt_inicio"]).tz("America/Sao_Paulo").format("DD/MM/YY");
    this.dtFimGrupoLogado = moment(retGrupoLogado["gru_dt_termino"]).tz("America/Sao_Paulo").format("DD/MM/YY");

    var retMedidas       = await this.TbGrupoPessoa.pegaMeuPerfil(this.grpLogado);
    this.Medidas         = retMedidas["Medidas"];
    this.infoInicial     = this.Medidas["primeira"]; //um obj
    this.infoDemais      = this.Medidas["demais"]; // array de obj
    this.infoProgresso   = retMedidas["Progresso"];
    this.infoImc         = retMedidas["Imc"];
    this.showLctoInicial = Object.keys(this.infoInicial).length <= 0;

    this.vInfoInicial.data     = moment(this.infoInicial["gpi_data"]).tz("America/Sao_Paulo").format("DD/MM/YYYY");
    this.vInfoInicial.altura   = this.infoInicial["gpi_altura"] + 'cm';
    this.vInfoInicial.peso     = this.infoInicial["gpi_peso"];
    this.vInfoInicial.peso_obj = this.infoInicial["gpi_peso_objetivo"];
    this.vInfoInicial.peso_dif = this.infoInicial["gpi_peso"] - this.infoInicial["gpi_peso_objetivo"];

    this.vInfoProgresso.percentual = this.infoProgresso["progresso"];
    this.vInfoProgresso.peso_falta = this.infoProgresso["dif_atual"];

    this.vInfoImc.imc       = this.infoImc["imc"];
    this.vInfoImc.resultado = this.infoImc["resultado"];
    this.vCalcAgua          = retMedidas["CalcAgua"];

    for(let idx in this.infoDemais){
      var medidaDemais = this.infoDemais[idx];
      var item = {
        data : moment(medidaDemais["gpi_data"]).tz("America/Sao_Paulo").format("DD/MM/YYYY"),
        peso : medidaDemais["gpi_peso"],
      };
      this.vLoopMedidas.push(item);
    }

    this.ngAfterViewInit();

    console.log(this.infoInicial);
    console.log(this.infoDemais);
    console.log(this.infoProgresso);
    console.log(this.infoImc);
  }
}
