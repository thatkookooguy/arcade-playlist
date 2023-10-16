import { APP_BASE_HREF, CommonModule, PlatformLocation } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GameCollectionComponent } from './game-collection/game-collection.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { getBaseHref } from './base-href';
import { StarsComponent } from './stars/stars.component';

@NgModule({
  declarations: [
    AppComponent,
    GameCollectionComponent,
    ModalContainerComponent,
    GameDetailsComponent,
    StarsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: getBaseHref,
      deps: [ PlatformLocation ]
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
