import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PgLoginSelGrupoPage } from './pg-login-sel-grupo.page';

const routes: Routes = [
  {
    path: '',
    component: PgLoginSelGrupoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PgLoginSelGrupoPage]
})
export class PgLoginSelGrupoPageModule {}
