import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { PgGaleriaImagemPage } from '../pg-galeria-imagem/pg-galeria-imagem.page';
import { File } from '@ionic-native/file/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  arrLoop = [
    {
      titulo: "Teste 1",
      data: "28/08/19 08:15",
      autor: "Leandro Parra",
      imagens: [
        {idx:1, url:"paisagem1.jpg", last:false}
        ,
        {idx:2, url:"paisagem2.jpg", last:false}
        ,
        {idx:3, url:"paisagem3.jpg", last:false}
        ,
        {idx:4, url:"paisagem1.jpg", last:true}
        ,
        {idx:5, url:"paisagem2.jpg", last:false}
        ,
        {idx:6, url:"paisagem3.jpg", last:false}
        ,
        {idx:7, url:"paisagem1.jpg", last:false}
        ,
        {idx:8, url:"paisagem2.jpg", last:false}
      ],
      youtube: [],
      arquivos:[],
      videos:[],
      audios:[]
    }
    ,
    {
      titulo: "Teste 2",
      data: "28/08/19 09:15",
      autor: "Leandro Parra",
      imagens: [
        {idx:1, url:"paisagem1.jpg", last:false}
      ],
      youtube:[],
      arquivos:[],
      videos:[],
      audios:[]
    }
    ,
    {
      titulo: "Teste 3",
      data: "28/08/19 10:15",
      autor: "Leandro Parra",
      imagens: [],
      youtube:[
        {id: "qpT5Md4TPJg"}
      ],
      arquivos:[],
      videos:[],
      audios:[]
    }
    ,
    {
      titulo: "Teste 4",
      data: "28/08/19 11:15",
      autor: "Leandro Parra",
      imagens: [],
      youtube:[],
      arquivos:[
        {name:"pdf-test.pdf", path:"www/assets/pdf-test.pdf", type:"application/pdf"},
        {name:"pdf-test.pdf", path:"www/assets/pdf-test.pdf", type:"application/pdf"}
      ],
      videos:[],
      audios:[]
    }
    ,
    {
      titulo: "Teste 5",
      data: "28/08/19 12:15",
      autor: "Leandro Parra",
      imagens: [],
      youtube:[],
      arquivos:[],
      videos:[
        {path:"www/assets/file_example.mp4"},
        /*{path:"www/assets/file_example.avi"} @todo AINDA N FUNFA */
      ],
      audios:[]
    }
    ,
    {
      titulo: "Teste 6",
      data: "28/08/19 13:15",
      autor: "Leandro Parra",
      imagens: [],
      youtube:[],
      arquivos:[],
      videos:[],
      audios:[
        {path:"www/assets/BARBAREX.mp3"}
      ]
    }
  ];

  constructor(
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    public sanitizer: DomSanitizer,
    public file: File,
    private document: DocumentViewer,
    private streamingMedia: StreamingMedia,
  ) {}

  ngOnInit()
  {

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

  openPdf(vPath, vType)
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
    console.log(vPath, vType);
    this.document.viewDocument(this.file.applicationDirectory + vPath, vType, {});
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
    this.streamingMedia.playVideo(this.file.applicationDirectory + vPath, options);
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
    this.streamingMedia.playAudio(this.file.applicationDirectory + vPath, options);
  }
}
