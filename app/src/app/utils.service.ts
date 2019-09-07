import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private alertCtr: AlertController,
    private loadingCtr: LoadingController,
    private storage: Storage
  ) { }

  /* session */
  async validaSession()
  {
    let Usuario = {};
    let Grupos = {};
    let grpId = 0;

    let retUsuario = await this.getUsuario();
    let retGrupos = await this.getGrupos();
    let retGrpId = await this.getGrpIdLogado();

    if(!retUsuario['erro']){
      Usuario = retUsuario['Usuario'];
    }
    if(!retGrupos['erro']){
      Grupos = retGrupos['Grupos'];
    }
    if(!retGrpId['erro']){
      grpId = retGrpId['grpId'];
    }


    let gruId = 0;
    let pesId = 0;
    for(let item in Grupos){
      var GrupoPessoa = Grupos[item];
      var grpLoop     = GrupoPessoa.grp_id;

      if(grpLoop == grpId){
        gruId = GrupoPessoa.grp_gru_id;
        pesId = GrupoPessoa.grp_pes_id;
        break;
      }
    }

    var usuarioOk = (pesId == Usuario['id']);
    if(usuarioOk){
      await this.setPesIdLogado(pesId);
      await this.setGruIdLogado(gruId);

      return true;
    } else {
      await this.limpaSession();
      return false;
    }
  }

  async limpaSession()
  {
    await this.clearUsuario();
    await this.clearGrupos();
    await this.clearGrupos();
    await this.clearGruIdLogado();
    await this.clearPesIdLogado();
  }

  setUsuario(Usuario)
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        Usuario: {},
      };

      this.storage.set('Usuario', Usuario)
      .then((ret) => {
        objRet.Usuario = Usuario;
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao gravar Usuário';
        reject(objRet);
      });
    });
  }

  getUsuario()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        Usuario: {},
      };

      this.storage.get('Usuario')
      .then((Usuario:any) => {
        objRet.Usuario = Usuario;
        resolve(objRet);
      })
      .catch((err) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao buscar Usuário logado.';
        reject(objRet);
      });
    });
  }

  clearUsuario()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
      };

      this.storage.set('Usuario', {})
      .then((ret) => {
        objRet.msg  = 'Usuário resetado com sucesso.';
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao resetar Usuário.';
        reject(objRet);
      });
    });
  }

  setGrupos(Grupos)
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        Grupos: {},
      };

      this.storage.set('Grupos', Grupos)
      .then((ret) => {
        objRet.Grupos = Grupos;
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao gravar Grupos';
        reject(objRet);
      });
    });
  }

  getGrupos()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        Grupos: {},
      };

      this.storage.get('Grupos')
      .then((Grupos:any) => {
        objRet.Grupos = Grupos;
        resolve(objRet);
      })
      .catch((err) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao buscar Grupos do usuário.';
        reject(objRet);
      });
    });
  }

  clearGrupos()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
      };

      this.storage.set('Grupos', {})
      .then((ret) => {
        objRet.msg  = 'Grupos resetados com sucesso.';
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao resetar Grupos.';
        reject(objRet);
      });
    });
  }

  setGrpIdLogado(grpId)
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        grpId: 0,
      };

      this.storage.set('grpId', grpId)
      .then((ret) => {
        objRet.grpId = grpId;
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao gravar Participante do Grupo';
        reject(objRet);
      });
    });
  }

  getGrpIdLogado()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        grpId: 0,
      };

      this.storage.get('grpId')
      .then((grpId:any) => {
        objRet.grpId = grpId;
        resolve(objRet);
      })
      .catch((err) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao buscar Participante do grupo.';
        reject(objRet);
      });
    });
  }

  clearGrpIdLogado()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
      };

      this.storage.set('grpId', 0)
      .then((ret) => {
        objRet.msg  = 'Participante do grupo resetados com sucesso.';
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao resetar Participante do grupo.';
        reject(objRet);
      });
    });
  }

  setGruIdLogado(gruId)
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        gruId: 0,
      };

      this.storage.set('gruId', gruId)
      .then((ret) => {
        objRet.gruId = gruId;
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao gravar Grupo logado.';
        reject(objRet);
      });
    });
  }

  getGruIdLogado()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        gruId: 0,
      };

      this.storage.get('gruId')
      .then((gruId:any) => {
        objRet.gruId = gruId;
        resolve(objRet);
      })
      .catch((err) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao buscar Grupo logado.';
        reject(objRet);
      });
    });
  }

  clearGruIdLogado()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
      };

      this.storage.set('gruId', 0)
      .then((ret) => {
        objRet.msg  = 'Grupo logado resetado com sucesso.';
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao resetar Grupo Logado.';
        reject(objRet);
      });
    });
  }

  setPesIdLogado(pesId)
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        pesId: 0,
      };

      this.storage.set('pesId', pesId)
      .then((ret) => {
        objRet.pesId = pesId;
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao gravar Pessoa logada.';
        reject(objRet);
      });
    });
  }

  getPesIdLogado()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        pesId: 0,
      };

      this.storage.get('pesId')
      .then((pesId:any) => {
        objRet.pesId = pesId;
        resolve(objRet);
      })
      .catch((err) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao buscar Pessoa logada.';
        reject(objRet);
      });
    });
  }

  clearPesIdLogado()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
      };

      this.storage.set('pesId', 0)
      .then((ret) => {
        objRet.msg  = 'Pessoa resetada com sucesso.';
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao resetar Pessoa.';
        reject(objRet);
      });
    });
  }
  /* ======= */

  getWsPath()
  {
    return 'http://192.168.0.79/app_paula/Rest/';
  }

  getAppKey()
  {
    return '1e7c1e6e95502517a3607266a720aab0';
  }

  getWebsiteUrl()
  {
    return 'http://192.168.0.79/app_paula/';
  }

  getPathImgPadrao()
  {
    return 'assets/avatar.png';
  }

  async showAlert(header, subHeader, message, buttons)
  {
    const alert = await this.alertCtr.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons,

    });
    return await alert.present();
  }

  async getLoader(message, spinner)
  {
    return await this.loadingCtr.create({
      message: message,
      spinner: spinner,
    }).then((res) => {
      res.present();
    });
  }

  async closeLoader()
  {
    return await this.loadingCtr.dismiss();
  }

  /*
  date: tem que ser no formato ISO String (new Date().toISOString())
  2011-10-05T14:48:00.000Z
  */
  formatDate(date, format='YYYY-MM-DD')
  {
    let strDate = '' + date.replace('Z', '');
    let ano     = strDate.substr(0, 4);
    let mes     = strDate.substr(5, 2);
    let dia     = strDate.substr(8, 2);
    let hora    = strDate.substr(11, 2);
    let minuto  = strDate.substr(14, 2);
    let segundo = strDate.substr(17, 2);

    let strDateFmt  = format.replace('YYYY', ano).replace('MM', mes).replace('DD', dia).replace('HH', hora).replace('MI', minuto).replace('SS', segundo);
    return strDateFmt;
  }
}
