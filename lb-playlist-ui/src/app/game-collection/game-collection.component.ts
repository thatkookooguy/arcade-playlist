import { Component, Inject } from '@angular/core';
import { uniqBy } from 'lodash';
import playlistData from '../../../result/assets/playlist-data.json';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'kb-game-collection',
  templateUrl: './game-collection.component.html',
  styleUrls: ['./game-collection.component.scss']
})
export class GameCollectionComponent {
  
  public readonly playlistData = {
    ...playlistData,
    games: uniqBy(playlistData.games, 'title')
  };

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string
  ) { }
  public readonly encodeURIComponent = encodeURIComponent;
}
