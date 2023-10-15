import { Component, Inject, OnInit } from '@angular/core';
import { uniqBy } from 'lodash-es';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'kb-game-collection',
  templateUrl: './game-collection.component.html',
  styleUrls: ['./game-collection.component.scss']
})
export class GameCollectionComponent implements OnInit {
  
  public playlistData: any = {};

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private readonly httpClient: HttpClient
  ) { }
  ngOnInit(): void {
    this.httpClient.get(`${this.baseHref}assets/playlist-data.json`)
      .subscribe((playlistData: any) => {
        this.playlistData = {
          ...playlistData,
          games: uniqBy(playlistData.games, 'title')
        };
      });
  }
  public readonly encodeURIComponent = encodeURIComponent;
}
