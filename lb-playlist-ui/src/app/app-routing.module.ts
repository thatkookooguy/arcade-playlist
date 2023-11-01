import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AttractModeComponent } from './attract-mode/attract-mode.component';
import { GameCollectionComponent } from './game-collection/game-collection.component';
import { GameDetailsComponent } from './game-details/game-details.component';

const routes: Routes = [
  { path: 'game-collection',
    component: GameCollectionComponent
  },
  {
    path: 'attract-mode',
    component: AttractModeComponent
  },
  {
    path: ':id',
    component: GameDetailsComponent,
    outlet: 'game-details'
  },
  { path: '', redirectTo: '/game-collection', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
