import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'pg-login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'home/:grp_id', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'pg-galeria-imagem', loadChildren: './pg-galeria-imagem/pg-galeria-imagem.module#PgGaleriaImagemPageModule' },
  { path: 'pg-perfil', loadChildren: './pg-perfil/pg-perfil.module#PgPerfilPageModule' },
  { path: 'pg-login', loadChildren: './pg-login/pg-login.module#PgLoginPageModule' },
  { path: 'pg-lcto-medidas', loadChildren: './pg-lcto-medidas/pg-lcto-medidas.module#PgLctoMedidasPageModule' },
  { path: 'pg-login-sel-grupo', loadChildren: './pg-login-sel-grupo/pg-login-sel-grupo.module#PgLoginSelGrupoPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
