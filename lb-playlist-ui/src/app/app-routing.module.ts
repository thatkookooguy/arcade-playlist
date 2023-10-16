import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameDetailsComponent } from './game-details/game-details.component';

const routes: Routes = [
  { path: 'game-collection', loadChildren: () => import('./game-collection/game-collection.component').then((m) => m.GameCollectionComponent) },
  {
    path: ':id',
    component: GameDetailsComponent,
    outlet: 'game-details'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
