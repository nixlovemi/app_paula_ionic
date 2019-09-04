import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pg-login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'pg-galeria-imagem', loadChildren: './pg-galeria-imagem/pg-galeria-imagem.module#PgGaleriaImagemPageModule' },
  { path: 'pg-perfil', loadChildren: './pg-perfil/pg-perfil.module#PgPerfilPageModule' },
  { path: 'pg-login', loadChildren: './pg-login/pg-login.module#PgLoginPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
