import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { PgGaleriaImagemPage } from '../pg-galeria-imagem/pg-galeria-imagem.page';

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
      youtube: []
    }
    ,
    {
      titulo: "Teste 2",
      data: "28/08/19 09:15",
      autor: "Leandro Parra",
      imagens: [
        {idx:1, url:"paisagem1.jpg", last:false}
      ],
      youtube:[]
    }
    ,
    {
      titulo: "Teste 3",
      data: "28/08/19 10:15",
      autor: "Leandro Parra",
      imagens: [],
      youtube:[
        {id: "qpT5Md4TPJg"}
      ]
    }
    ,
    {
      titulo: "Teste 4",
      data: "28/08/19 11:15",
      autor: "Leandro Parra",
      imagens: [],
      youtube:[]
    }
    ,
  ];

  constructor(
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    public sanitizer: DomSanitizer,
  ) {}

  ngOnInit()
  {

  }

  async asUploadOptions() {
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

  async asPostagemOptions() {
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

  async modalGaleriaImg(imagens, idx) {
    const modal = await this.modalController.create({
      component: PgGaleriaImagemPage,
      componentProps: {
        'imagens': imagens,
        'idx': idx,
      }
    });
    return await modal.present();
  }
}
