import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  arrLoop = [];

  constructor(
    public actionSheetController: ActionSheetController
  ) {}

  ngOnInit()
  {
    for(var i=0; i<=15; i++){
      this.arrLoop.push(i);
    }
    console.log(this.arrLoop);
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

}
