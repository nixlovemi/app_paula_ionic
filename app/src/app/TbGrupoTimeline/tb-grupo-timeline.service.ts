import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class TbGrupoTimelineService {
  wsPath = '';
  appKey = '';

  constructor(
    public http: Http,
    public utils: UtilsService,
  ) {
    this.wsPath = this.utils.getWsPath();
    this.appKey = this.utils.getAppKey();
  }

  pegaPostagensGrupo(gru_id, grp_logado)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'pegaPostagensGrupo'
      let postData = {
        'appkey' : this.appKey,
        'gru_id' : gru_id,
        'grp_id' : grp_logado,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
        Postagens: {},
        Respostas: {},
        Arquivos: {},
        Salvos: {},
        arrParam: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg       = jsonRet.msg;
        objRet.erro      = jsonRet.erro;
        objRet.Postagens = jsonRet.Postagens;
        objRet.Respostas = jsonRet.Respostas;
        objRet.Arquivos  = jsonRet.Arquivos; //[imagens] [audio] [video] [documentos]
        objRet.Salvos    = jsonRet.Salvos;
        objRet.arrParam  = jsonRet.arrParam;

        resolve(objRet);
      },
      (error) => {
        // {"_body":{"isTrusted":true},"status":0,"ok":false,"statusText":"","headers":{},"type":3,"url":null}
        // reject(error.json());
        objRet.erro       = true;
        objRet.httpStatus = error;
        objRet.msg        = 'Erro ao comunicar com o servidor';

        reject(objRet);
      });
    });
  }
}
