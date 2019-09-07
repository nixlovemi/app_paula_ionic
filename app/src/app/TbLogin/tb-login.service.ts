import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class TbLoginService {
  wsPath = '';
  appKey = '';

  constructor(
    public http: Http,
    public utils: UtilsService,
  ) {
    this.wsPath = this.utils.getWsPath();
    this.appKey = this.utils.getAppKey();
  }

  executaLogin(usuario, senha)
  {
    return new Promise(
    (resolve, reject) => {
      let url      = this.wsPath + 'executaLogin'
      let postData = {
        'appkey'  : this.appKey,
        'usuario' : usuario,
        'senha'   : senha,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
        Usuario: {},
        Grupos: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg     = jsonRet.msg;
        objRet.erro    = jsonRet.erro;
        objRet.Usuario = jsonRet.Usuario;
        objRet.Grupos  = jsonRet.Grupos;

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
