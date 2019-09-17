import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class TbGrupoTimelineService {
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

  pegaPostagensGrupo(gru_id, grp_logado, grp_postagem=0, apenas_favoritos=false, apenas_programados=false, apenas_privado=false, limit=25, offset=0)
  {
    return new Promise(
    (resolve, reject) => {
      // qdo for favorito, manda no grp logado
      if(apenas_favoritos){
        grp_postagem = this.grpLogado;
      }
      // =====================================

      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'pegaPostagensGrupo'
      let postData = {
        'appkey'            : this.appKey,
        'gru_id'            : gru_id,
        'grp_id'            : grp_logado, // essa usa no processa post rest
        'grp_postagem'      : grp_postagem,
        'apenas_favoritos'  : apenas_favoritos,
        'apenas_programado' : apenas_programados,
        'apenas_privado'    : apenas_privado,
        'limit'             : limit,
        'offset'            : offset,
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

        resolve(objRet);
      });
    });
  }

  salvaComentario(grtId, grpId, comentario)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'salvaComentario'
      let postData = {
        'appkey'     : this.appKey,
        'grt_id'     : grtId,
        'grp_id'     : grpId,
        'comentario' : comentario,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
        Comentarios: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg         = jsonRet.msg;
        objRet.erro        = jsonRet.erro;
        objRet.Comentarios = jsonRet.Comentarios;

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

  deletaComentario(grtId, grtIdPai)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'deletaComentario'
      let postData = {
        'appkey'     : this.appKey,
        'grt_id'     : grtId,
        'grt_id_pai' : grtIdPai,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
        Comentarios: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg         = jsonRet.msg;
        objRet.erro        = jsonRet.erro;
        objRet.Comentarios = jsonRet.Comentarios;

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

  postNovoTimelineGrupo(vDescricao, vProgramar, vPublico, vGrpLogado)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'postNovoTimelineGrupo'
      let postData = {
        'appkey'    : this.appKey,
        'descricao' : vDescricao,
        'programar' : vProgramar,
        'publico'   : vPublico,
        'grpLogado' : vGrpLogado,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg       = jsonRet.msg;
        objRet.erro      = jsonRet.erro;

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
