import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PgGaleriaImagemPageModule } from './pg-galeria-imagem/pg-galeria-imagem.module';
import { File } from '@ionic-native/file/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { CurrencyPipe } from '@angular/common';
import { PgLctoMedidasPageModule } from './pg-lcto-medidas/pg-lcto-medidas.module';
import { BrMaskerModule } from 'br-mask';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    PgGaleriaImagemPageModule,
    PgLctoMedidasPageModule,
    HttpModule,
    BrMaskerModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    DocumentViewer,
    StreamingMedia,
    InAppBrowser,
    Camera,
    CurrencyPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
