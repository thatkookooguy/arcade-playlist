import { APP_BASE_HREF, CommonModule, PlatformLocation } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GameCollectionComponent } from './game-collection/game-collection.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { SoftTabsComponent } from './soft-tabs/soft-tabs.component';
import { StarsComponent } from './stars/stars.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { getBaseHref } from './base-href';
import { SafePipe } from './safe.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LazyLoadDirective } from './lazy-load.directive';

@NgModule({
  declarations: [
    AppComponent,
    GameCollectionComponent,
    GameDetailsComponent,
    StarsComponent,
    SoftTabsComponent,
    SafePipe,
    LazyLoadDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ScrollingModule
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
