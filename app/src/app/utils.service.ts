import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5';
import { File } from '@ionic-native/file/ngx';
import { Router } from  "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private alertCtr: AlertController,
    private loadingCtr: LoadingController,
    private storage: Storage,
    public file: File,
    private events: Events,
    private router: Router,
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
    await this.clearGrpIdLogado();
    await this.clearGruIdLogado();
    await this.clearPesIdLogado();
    await this.clearAutoLogin();
  }

  async gravaInfoLogin(vGrpId, vUsuario, vGrupos)
  {
    await this.setGrpIdLogado(vGrpId);
    await this.setUsuario(vUsuario);
    await this.setGrupos(vGrupos);
    await this.setPesIdLogado(vUsuario["id"]);

    for(let idxGrupo in vGrupos){
      var Grupo = vGrupos[idxGrupo];
      if(vGrpId == Grupo["grp_id"]){
        await this.setGruIdLogado(Grupo["grp_gru_id"]);
        break;
      }
    }

    return true;
  }

  setAutoLogin(usuario, senha)
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        usuario: usuario,
        senha: senha,
      };
      var AutoLogin = {
        usuario: usuario,
        senha: senha,
      };

      this.storage.set('AutoLogin', AutoLogin)
      .then((ret) => {
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao gravar Auto Login';
        reject(objRet);
      });
    });
  }

  getAutoLogin()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        AutoLogin: {},
      };

      this.storage.get('AutoLogin')
      .then((AutoLogin:any) => {
        objRet.AutoLogin = AutoLogin;
        resolve(objRet);
      })
      .catch((err) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao buscar Auto Login.';
        reject(objRet);
      });
    });
  }

  clearAutoLogin()
  {
    return new Promise(
    (resolve, reject) => {
      let objRet = {
        msg: '',
        erro: false,
        usuario: '',
        senha: '',
      };
      var AutoLogin = {
        usuario: '',
        senha: '',
      };

      this.storage.set('AutoLogin', AutoLogin)
      .then((ret) => {
        resolve(objRet);
      })
      .catch((ret) => {
        objRet.erro = true;
        objRet.msg  = 'Erro ao limpar Auto Login';
        reject(objRet);
      });
    });
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

  async getGrupoLogado()
  {
    var retGrupos   = await this.getGrupos();
    var GrupoLogado = {};
    if( !retGrupos["erro"] ){
      var Grupos       = retGrupos["Grupos"];
      var retGruLogado = await this.getGruIdLogado();
      var gruLogado    = retGruLogado["gruId"];

      for(let idx in Grupos){
        var Grupo = Grupos[idx];
        if(gruLogado == Grupo["grp_gru_id"]){
          return Grupo;
          break;
        }
      }
    }
  }
  /* ======= */

  async carregaHome(vGrpId, vUsuario, vGrupos)
  {
    await this.gravaInfoLogin(vGrpId, vUsuario, vGrupos);
    await this.events.publish('carregarMenuInfo');
    await this.events.publish('carregarProgressoInfo');
    await this.router.navigate(['/home']);
  }

  getWsPath()
  {
    // return 'http://192.168.0.79/app_paula/Rest/';
    return 'http://vcmaisleve.com.br/app/Rest/';
  }

  getAppKey()
  {
    return '1e7c1e6e95502517a3607266a720aab0';
  }

  getWebsiteUrl()
  {
    // return 'http://192.168.0.79/app_paula/';
    return 'http://vcmaisleve.com.br/app/';
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

  /*
  * valor: valor desejado para a formatação
  * decimais: quantidade de casas decimais, por padrão será 2
  * simbolo: tipo de moeda, por padrão é vazia
  */
  formatMoney(valor, decimais = 2, simbolo = '')
  {
    if (isNaN(valor)) return '';
    else {
      let vValor = parseFloat(valor);
      let numero = vValor.toFixed(decimais).split('.');
      numero[0] = simbolo + numero[0].split(/(?=(?:...)*$)/).join('.');
      return numero.join(',');
    }
  }

  acerta_moeda(valor)
  {
    return parseFloat( valor.replace('.', '').replace(',', '.') );
  }

  encriptaStr(texto)
  {
    return Md5.hashStr(texto);
  }

  async makeFileIntoBlob(_imagePath)
  {
    let fileName = "";
    await this.file
      .resolveLocalFilesystemUrl(_imagePath)
      .then(fileEntry => {
        let { name, nativeURL } = fileEntry;

        // get the path..
        let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));

        fileName = name;

        // we are provided the name, so now read the file into a buffer
        return this.file.readAsArrayBuffer(path, name);
      })
      .then(buffer => {
        // get the buffer and make a blob to be saved

        let imgBlob = new Blob([buffer], {
          type: "image/jpeg"
        });

        /*var myReader = new FileReader();
        myReader.onload = function(event){

        };
        myReader.readAsText(imgBlob);*/

        // pass back blob and the name of the file for saving
        // into fire base

        return imgBlob;
      });

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    /*return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));

          fileName = name;

          // we are provided the name, so now read the file into a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved

          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });

          var myReader = new FileReader();
          myReader.onload = function(event){
              console.log(JSON.stringify(myReader.result));
          };
          myReader.readAsText(imgBlob);

          // pass back blob and the name of the file for saving
          // into fire base
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });*/
  }
}
