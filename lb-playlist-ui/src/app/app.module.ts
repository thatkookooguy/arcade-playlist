import { ScrollingModule } from '@angular/cdk/scrolling';
import { APP_BASE_HREF, CommonModule, PlatformLocation } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { GameCollectionComponent } from './game-collection/game-collection.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { SoftTabsComponent } from './soft-tabs/soft-tabs.component';
import { StarsComponent } from './stars/stars.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { getBaseHref } from './base-href';
import { LazyLoadDirective } from './lazy-load.directive';
import { SafePipe } from './safe.pipe';
import { AttractModeComponent } from './attract-mode/attract-mode.component';
import { RouletteComponent } from './roulette/roulette.component';
import { ProgressComponent } from './progress/progress.component';
import { LoadingPageComponent } from './loading-page/loading-page.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/'
  );
}

@NgModule({
  declarations: [
    AppComponent,
    GameCollectionComponent,
    GameDetailsComponent,
    StarsComponent,
    SoftTabsComponent,
    SafePipe,
    LazyLoadDirective,
    AttractModeComponent,
    RouletteComponent,
    ProgressComponent,
    LoadingPageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ScrollingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
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
