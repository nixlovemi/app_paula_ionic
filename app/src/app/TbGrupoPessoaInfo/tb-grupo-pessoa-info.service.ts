import { Injectable } from '@angular/core';
import { Http /*, Headers, RequestOptions*/ } from '@angular/http';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class TbGrupoPessoaInfoService {
  wsPath    = '';
  appKey    = '';
  grpLogado = 0;

  constructor(
    public http: Http,
    public utils: UtilsService,
  ) {
    this.wsPath = this.utils.getWsPath();
    this.appKey = this.utils.getAppKey();

    this.utils.getGrpIdLogado().then((arrRet: any) => {
      this.grpLogado = arrRet["grpId"];
    });
  }

  salvaMedidas(gpi_data, gpi_altura, gpi_peso, gpi_peso_objetivo, gpi_inicial, pes_id, gru_id)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'postAddGpi'
      let postData = {
        'appkey'      : this.appKey,
        'data'        : gpi_data,
        'altura_cm'   : gpi_altura,
        'peso_kg'     : gpi_peso,
        'peso_kg_obj' : gpi_peso_objetivo,
        'primeira'    : gpi_inicial,
        'pessoa'      : pes_id,
        'grupo'       : gru_id,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg  = jsonRet.msg;
        objRet.erro = jsonRet.erro;

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
