import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class TbGrupoPessoaService {
  wsPath = '';
  appKey = '';

  constructor(
    public http: Http,
    public utils: UtilsService,
  ) {
    this.wsPath = this.utils.getWsPath();
    this.appKey = this.utils.getAppKey();
  }

  pegaGrupoStaff(gru_id)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'pegaStaffGrupo'
      let postData = {
        'appkey' : this.appKey,
        'gru_id' : gru_id,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
        Staff: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg   = jsonRet.msg;
        objRet.erro  = jsonRet.erro;
        objRet.Staff = jsonRet.Staff;

        resolve(objRet);
      },
      (error) => {
        // {"_body":{"isTrusted":true},"status":0,"ok":false,"statusText":"","headers":{},"type":3,"url":null}
        // reject(error.json());
        objRet.erro       = true;
        objRet.httpStatus = error;
        objRet.msg        = 'Erro ao comunicar com o servidor';

        resolve(objRet);
      });
    });
  }

  pegaGrupoPessoa(grp_id, apenasCmpTb=false)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'pegaGrupoPessoa'
      let postData = {
        'appkey'        : this.appKey,
        'grp_id'        : grp_id,
        'campos_tabela' : apenasCmpTb,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
        GrupoPessoa: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg         = jsonRet.msg;
        objRet.erro        = jsonRet.erro;
        objRet.GrupoPessoa = jsonRet.GrupoPessoa;

        resolve(objRet);
      },
      (error) => {
        // {"_body":{"isTrusted":true},"status":0,"ok":false,"statusText":"","headers":{},"type":3,"url":null}
        // reject(error.json());
        objRet.erro       = true;
        objRet.httpStatus = error;
        objRet.msg        = 'Erro ao comunicar com o servidor';

        resolve(objRet);
      });
    });
  }

  pegaMeuPerfil(grp_id)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'meuPerfil'
      let postData = {
        'appkey' : this.appKey,
        'grp_id' : grp_id,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
        Medidas: {},
        Progresso: {},
        Imc: {},
        CalcAgua:''
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg       = jsonRet.msg;
        objRet.erro      = jsonRet.erro;
        objRet.Medidas   = jsonRet.medidas;
        objRet.Progresso = jsonRet.progresso;
        objRet.Imc       = jsonRet.imc;
        objRet.CalcAgua  = jsonRet.calc_agua;

        resolve(objRet);
      },
      (error) => {
        // {"_body":{"isTrusted":true},"status":0,"ok":false,"statusText":"","headers":{},"type":3,"url":null}
        // reject(error.json());
        objRet.erro       = true;
        objRet.httpStatus = error;
        objRet.msg        = 'Erro ao comunicar com o servidor';

        resolve(objRet);
      });
    });
  }
}
