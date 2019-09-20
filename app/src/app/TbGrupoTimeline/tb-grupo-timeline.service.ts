import { Injectable } from '@angular/core';
import { Http /*, Headers, RequestOptions*/ } from '@angular/http';
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

  async ajustaAnexosAntesUpload(vAnexos)
  {
    let novoAnexos = [];
    for(let idx in vAnexos){
      var Anexo = vAnexos[idx];

      if(Anexo["tipo"] == "img"){
        var retBlob = await this.utils.makeFileIntoBlob(Anexo["path"]);
        var addImg = {
          id: Anexo["id"],
          nome: Anexo["nome"],
          tipo: Anexo["tipo"],
          path: retBlob
        };
        novoAnexos.push(addImg);
      } else {
        var addImg2 = {
          id: Anexo["id"],
          nome: Anexo["nome"],
          tipo: Anexo["tipo"],
          path: Anexo["path"]
        };
        novoAnexos.push(addImg2);
      }
    }

    return novoAnexos;
  }

  postNovoTimelineGrupo(vDescricao, vProgramar, vPublico, vGrpLogado, vAnexos)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET

      //var headers  = new Headers();
      //headers.append('content-type', 'multipart/form-data;');
      //let options  = new RequestOptions({ headers: headers });

      let url      = this.wsPath + 'postNovoTimelineGrupo';
      let postData = new FormData();
      postData.append('appkey', this.appKey);
      postData.append('descricao', vDescricao);
      postData.append('programar', vProgramar);
      postData.append('publico', vPublico);
      postData.append('grpLogado', vGrpLogado);

      if(vAnexos.length > 0){
        let i = 1;
        for(let idx in vAnexos){
          var Anexo = vAnexos[idx];
          postData.append('imagens[]', Anexo["path"]);
          i = i + 1;
        }
      }

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

  deletaPostagem(grtId)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'postDeletaPostagem'
      let postData = {
        'appkey' : this.appKey,
        'id'     : grtId,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg         = jsonRet.msg;
        objRet.erro        = jsonRet.erro;

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

  favoritarPostagem(grtId, grpLogado)
  {
    return new Promise(
    (resolve, reject) => {
      //@todo ver em tds as chamadas HTTP um jeito de pegar qdo der erro no server e/ou n tiver NET
      let url      = this.wsPath + 'postFavoritarPostagem'
      let postData = {
        'appkey'    : this.appKey,
        'id'        : grtId,
        'grpLogado' : grpLogado,
      };

      let objRet = {
        msg: '',
        erro: false,
        httpStatus: {},
      };

      this.http.post(url, postData)
      .subscribe((result: any) => {
        let jsonRet = result.json();

        objRet.msg         = jsonRet.msg;
        objRet.erro        = jsonRet.erro;

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
