import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameCollectionComponent } from './game-collection/game-collection.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { getBaseHref } from './base-href';

@NgModule({
  declarations: [
    AppComponent,
    GameCollectionComponent,
    ModalContainerComponent,
    GameDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: getBaseHref,
      deps: [PlatformLocation]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
