import { Component } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { PgGaleriaImagemPage } from '../pg-galeria-imagem/pg-galeria-imagem.page';
import { File } from '@ionic-native/file/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { UtilsService } from '../utils.service';
import { Router, ActivatedRoute } from  "@angular/router";
import { TbGrupoTimelineService } from  "../TbGrupoTimeline/tb-grupo-timeline.service";
import { TbGrupoPessoaService } from  "../TbGrupoPessoa/tb-grupo-pessoa.service";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  arrLoop = [];
  grpId; //param da URL

  Usuario = {};
  fotoLogado = '';
  txtTitulo = '';
  exibeNovoPost = true;
  grpLogado;

  constructor(
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    public sanitizer: DomSanitizer,
    public file: File,
    private document: DocumentViewer,
    private streamingMedia: StreamingMedia,
    public utilsSrv: UtilsService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private TbGrupoTimelineSrv: TbGrupoTimelineService,
    private TbGrupoPessoa: TbGrupoPessoaService,
    private iab: InAppBrowser,
    private alertCtr: AlertController,
  ) {}

  async ngOnInit()
  {
    let sessionOk = await this.utilsSrv.validaSession();
    if(!sessionOk){
      this.utilsSrv.showAlert('Aviso!', '', 'Houve um problema na sua sessão. Faça o login novamente!', ['OK']);
      this.router.navigate(['']);
    }

    await this.actRoute.params.subscribe((res) => {
      if(typeof res.grp_id != 'undefined'){
        this.grpId = res.grp_id; //vem undefined qdo n tem param | tento deixar 0 default | pode vir texto
      } else {
        this.grpId = 0;
      }
    });

    var retUsuario = await this.utilsSrv.getUsuario();
    if(!retUsuario["erro"]){
      this.Usuario    = retUsuario["Usuario"];
      this.fotoLogado = this.utilsSrv.getPathImgPadrao();
      if(this.Usuario["foto"] != "" && this.Usuario["foto"] != null){
        this.fotoLogado = this.utilsSrv.getWebsiteUrl() + this.Usuario["foto"];
      }
    }

    let retGrpLogado  = await this.utilsSrv.getGrpIdLogado();
    var grpLogado     = retGrpLogado["grpId"];
    this.grpLogado    = grpLogado;
  }

  async ionViewDidEnter()
  {

  }

  async ionViewWillEnter()
  {
    var retGruLogado = await this.utilsSrv.getGruIdLogado();
    if(!retGruLogado["erro"]){
      var gruIdLogado   = retGruLogado["gruId"];
      var grpLogado     = this.grpLogado;
      var GrupoLogado   = await this.utilsSrv.getGrupoLogado();
      var retUsuLogado  = await this.utilsSrv.getUsuario();
      var UsuarioLogado = retUsuLogado["Usuario"];

      this.exibeNovoPost = (this.grpId == 0 && UsuarioLogado["cliente"] == 1) || (this.grpId == grpLogado);

      if(this.grpId == 0){
        this.txtTitulo = 'Postagens - ' + GrupoLogado["gru_descricao"];
      } else if(this.grpId > 0){
        var retGrupoPessoa = await this.TbGrupoPessoa.pegaGrupoPessoa(this.grpId);
        if(!retGrupoPessoa["erro"]){
          var GrupoPessoa    = retGrupoPessoa["GrupoPessoa"];
          this.txtTitulo = 'Postagens - ' + GrupoPessoa["pes_nome"];
        } else {
          this.txtTitulo = 'Postagens';
        }
      } else if(this.grpId == 'fav'){
        this.txtTitulo = 'Postagens - Favoritos';
      } else if(this.grpId == 'prog'){
        this.txtTitulo = 'Postagens - Programadas';
      } else if(this.grpId == 'priv'){
        this.txtTitulo = 'Postagens - Privadas';
      }

      var apenas_favoritos  = (this.grpId == 'fav');
      var apenas_programado = (this.grpId == 'prog');
      var apenas_privada    = (this.grpId == 'priv');
      var retTimeline       = await this.TbGrupoTimelineSrv.pegaPostagensGrupo(gruIdLogado, grpLogado, this.grpId, apenas_favoritos, apenas_programado, apenas_privada);
      if(retTimeline["erro"]){
        this.utilsSrv.showAlert('Aviso!', '', retTimeline["msg"], ['OK']);
      } else {
        await this.carregaTimeline(retTimeline);
      }
    }
  }

  async refreshConteudo(event)
  {
    this.arrLoop = [];
    await this.ionViewWillEnter();
    event.target.complete();
  }

  async carregaTimeline(retTimeline)
  {
    await this.utilsSrv.getLoader('Carregando', 'Dots');

    let Postagens    = retTimeline["Postagens"];
    let Salvos       = retTimeline["Salvos"];
    let Comentarios  = retTimeline["Respostas"];
    let Arquivos     = retTimeline["Arquivos"];
    let grpLogado    = this.grpLogado;

    for(let idx in Postagens){
      var Postagem     = Postagens[idx];
      var grtId        = Postagem["grt_id"];
      var ehPrivada    = (Postagem["grt_publico"] == 0);

      // favorito
      var ehFavoritado = false;
      for(let grtIdSalvo in Salvos){
        var objGrpIdSalvo = Salvos[grtIdSalvo];

        if(grtIdSalvo == grtId){
          for(let grpIdSalvo in objGrpIdSalvo){
            if(+grpIdSalvo == +grpLogado){ //convertendo pra numero
              ehFavoritado = true;
            }
          }
        }

        if(ehFavoritado){
          break;
        }
      }
      // ========

      var foto = this.utilsSrv.getPathImgPadrao();
      if(Postagem["pes_foto"] != "" && Postagem["pes_foto"] != null){
        foto = this.utilsSrv.getWebsiteUrl() + Postagem["pes_foto"];
      }

      var avaliacaoP = false;
      var avaliacaoN = false;
      if(Postagem["grt_avaliacao"] != null){
        if(Postagem["grt_avaliacao"] == 1){
          avaliacaoP = true;
        } else {
          avaliacaoN = true;
        }
      }

      // respostas
      var arrComentarios = this.geraArrComentarios(Comentarios, grtId);
      // =========

      // anexos
      var arrDocumentos = [];
      var arrImagens    = [];
      var arrYoutube    = [];
      var arrVideos     = [];
      var arrAudios     = [];

      for(let grtIdArquivo in Arquivos){
        if(grtIdArquivo == grtId){
          // documentos
          var Documentos = Arquivos[grtId]["documentos"];
          for(let grtIdDocumento in Documentos){
            var Doc     = Documentos[grtIdDocumento];
            var itemDoc = {
              name : Doc["gta_caminho"],
              path : this.utilsSrv.getWebsiteUrl() + Doc["gta_caminho"],
              type : "application/pdf",
            };
            arrDocumentos.push(itemDoc);
          }
          // ==========

          // imagens
          let idxImg    = 1;
          var Imagens   = Arquivos[grtId]["imagens"];
          var qtImagens = Object.keys(Imagens).length;
          for(let grtIdImagens in Imagens){
            var Img     = Imagens[grtIdImagens];
            var itemImg = {
              idx  : idxImg,
              url  : this.utilsSrv.getWebsiteUrl() + Img["gta_caminho"],
              last : (qtImagens > 4 && idxImg == 4),
            }
            idxImg = idxImg + 1;
            arrImagens.push(itemImg);
          }
          // =======

          // video
          var Videos = Arquivos[grtId]["video"];
          for(let grtIdVideos in Videos){
            var Vid        = Videos[grtIdVideos];
            var vidCaminho = Vid["gta_caminho"];
            var ehYoutube  = (vidCaminho.indexOf('youtu.be') !== -1 || vidCaminho.indexOf('youtube.com') !== -1);

            if(ehYoutube){
              var videoid   = vidCaminho.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
              if(videoid != null){
                var itemVidYT = {
                  id: videoid[1]
                };
                arrYoutube.push(itemVidYT);
              }
            } else {
              var itemVid = {
                path : this.utilsSrv.getWebsiteUrl() + vidCaminho
              };
              arrVideos.push(itemVid);
            }
          }
          // =====

          // audio
          var Audios = Arquivos[grtId]["audio"];
          for(let grtIdAudios in Audios){
            var Aud     = Audios[grtIdAudios];
            var itemAud = {
              path : this.utilsSrv.getWebsiteUrl() + Aud["gta_caminho"],
            };
            arrAudios.push(itemAud);
          }
          // =====
        }
      }
      // ======

      var item = {
        grtId : grtId,
        titulo: Postagem["grt_titulo"],
        data: moment(Postagem["dt_postagem"]).format("DD/MM HH:mm"),
        autor: Postagem["pes_nome"],
        texto: Postagem["grt_texto"],
        foto: foto,
        privada: ehPrivada,
        favorito: ehFavoritado,
        avaliacaoP: avaliacaoP,
        avaliacaoN: avaliacaoN,
        imagens: arrImagens,
        youtube: arrYoutube,
        arquivos:arrDocumentos,
        videos:arrVideos,
        audios:arrAudios,
        comentarios:arrComentarios,
      };
      this.arrLoop.push(item);
    }

    await this.utilsSrv.closeLoader();
  }

  async asUploadOptions()
  {
    const actionSheet = await this.actionSheetController.create({
      header: 'Anexar - Postagem',
      buttons: [{
        text: 'Do Celular',
        icon: 'folder',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Youtube',
        icon: 'logo-youtube',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async asPostagemOptions()
  {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opções - Postagem',
      buttons: [{
        text: 'Salvar Favorito',
        icon: 'assets/favorite.svg',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Avaliar Postagem',
        icon: 'assets/assignment.svg',
        handler: () => {
          console.log('Play clicked');
        }
      },
      {
        text: 'Excluir Postagem',
        icon: 'assets/delete.svg',
        handler: () => {
          console.log('Play clicked');
        }
      },
      {
        text: 'Fechar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async modalGaleriaImg(imagens, idx)
  {
    const modal = await this.modalController.create({
      component: PgGaleriaImagemPage,
      componentProps: {
        'imagens': imagens,
        'idx': idx,
      }
    });
    return await modal.present();
  }

  openPdf(vPath)
  {
    /*
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
    }
    */
    /*console.log(1);
    this.document.viewDocument(this.file.applicationDirectory + 'www/assets/pdf-test.pdf', 'application/pdf', {});
    */

    const browser = this.iab.create(vPath, '_blank', 'location=no,closebuttoncaption=Fechar,hidenavigationbuttons=yes,hideurlbar=yes,enableviewportscale=yes');
  }

  playVideo(vPath)
  {
    // Play a video with callbacks
    var options = {
      successCallback: function() {
        //console.log("Video was closed without error.");
      },
      errorCallback: function(errMsg) {
        //console.log("Error! " + errMsg);
      },
      //orientation: 'landscape',
      shouldAutoClose: true,  // true(default)/false
      controls: true // true(default)/false. Used to hide controls on fullscreen
    };
    this.streamingMedia.playVideo(vPath, options);
  }

  playAudio(vPath)
  {
    // Play an audio file with options (all options optional)
    var options = {
      bgColor: "#000000",
      bgImage: this.file.applicationDirectory + "www/assets/bg-audio.jpg",
      bgImageScale: "fit", // other valid values: "stretch", "aspectStretch"
      initFullscreen: false, // true is default. iOS only.
      keepAwake: false, // prevents device from sleeping. true is default. Android only.
      successCallback: function() {
        //console.log("Player closed without error.");
      },
      errorCallback: function(errMsg) {
        //console.log("Error! " + errMsg);
      }
    };
    this.streamingMedia.playAudio(vPath, options);
  }

  // comentarios
  geraArrComentarios(Comentarios, grtId)
  {
    var arrComentario = [];
    for(let grtIdComent in Comentarios){
      if(grtIdComent == grtId){
        for(let idxComentario in Comentarios[grtIdComent]){
          var comentario = Comentarios[grtIdComent][idxComentario];
          var fotoComent = this.utilsSrv.getPathImgPadrao();
          if(comentario["pes_foto"] != "" && comentario["pes_foto"] != null){
            fotoComent = this.utilsSrv.getWebsiteUrl() + comentario["pes_foto"];
          }

          var item2 = {
            id: comentario["grt_id"],
            nome: comentario["pes_nome"],
            comentario: comentario["grt_texto"],
            foto: fotoComent,
            podeDeletar: (this.grpLogado == comentario["grp_id"]),
          };
          arrComentario.push(item2);
        }
      }
    }

    return arrComentario;
  }

  geraArrComentarioResp(Comentarios, grtId)
  {
    var arrComentario = [];
    for(let grtIdComent in Comentarios){
      var respId = Comentarios[grtIdComent]["grt_resposta_id"];
      if(respId == grtId){
        var comentario = Comentarios[grtIdComent];
        var fotoComent = this.utilsSrv.getPathImgPadrao();
        if(comentario["pes_foto"] != "" && comentario["pes_foto"] != null){
          fotoComent = this.utilsSrv.getWebsiteUrl() + comentario["pes_foto"];
        }

        var item2 = {
          id: comentario["grt_id"],
          nome: comentario["pes_nome"],
          comentario: comentario["grt_texto"],
          foto: fotoComent,
          podeDeletar: (this.grpLogado == comentario["grp_id"]),
        };
        arrComentario.push(item2);
      }
    }

    return arrComentario;
  }
  // ===========

  async salvaComentario(grtId, event)
  {
    await this.utilsSrv.getLoader('Salvando ...', 'dots');

    var comentario = (<HTMLInputElement>document.getElementById('txt-comentario-' + grtId)).value;
    var grpLogado  = this.grpLogado;

    var retSalvaCom  = await this.TbGrupoTimelineSrv.salvaComentario(grtId, grpLogado, comentario.replace(/\n$/, ""));
    if(retSalvaCom["erro"]){
      this.utilsSrv.showAlert('Aviso', '', retSalvaCom["msg"], ['OK']);
    } else {
      // atualiza comentario da Postagem
      (<HTMLInputElement>document.getElementById('txt-comentario-' + grtId)).value = '';
      var Comentarios = retSalvaCom["Comentarios"];

      for(let idx in this.arrLoop){
        var postGrtId  = this.arrLoop[idx]["grtId"];
        if(postGrtId == grtId){
          this.arrLoop[idx]["comentarios"] = this.geraArrComentarioResp(Comentarios, grtId);
        }
      }
      // ===============================
    }

    await this.utilsSrv.closeLoader();
  }

  async deletaComentario(grtId, grtIdPai)
  {
    const alert = await this.alertCtr.create({
      header: 'Excluir comentário!',
      message: 'Deseja mesmo excluir esse comentário?',
      buttons: [
        {
          text: 'Não ...',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'Sim!',
          handler: () => {
            this.postDeletaComentario(grtId, grtIdPai);
          }
        }
      ]
    });

    await alert.present();
  }

  async postDeletaComentario(grtId, grtIdPai)
  {
    await this.utilsSrv.getLoader('Processando ...', 'dots');

    var retDeletaCom  = await this.TbGrupoTimelineSrv.deletaComentario(grtId, grtIdPai);
    if(retDeletaCom["erro"]){
      this.utilsSrv.showAlert('Aviso', '', retDeletaCom["msg"], ['OK']);
    } else {
      // atualiza comentario da Postagem
      var Comentarios = retDeletaCom["Comentarios"];

      for(let idx in this.arrLoop){
        var postGrtId  = this.arrLoop[idx]["grtId"];
        if(postGrtId == grtIdPai){
          this.arrLoop[idx]["comentarios"] = this.geraArrComentarioResp(Comentarios, grtIdPai);
        }
      }
      // ===============================
    }

    await this.utilsSrv.closeLoader();
  }
}
