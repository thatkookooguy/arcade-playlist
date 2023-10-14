import { Component } from '@angular/core';
import { uniqBy } from 'lodash';
import playlistData from '../../../result/assets/playlist-data.json';

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
  public readonly encodeURIComponent = encodeURIComponent;
}
