import { uniqBy } from 'lodash-es';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'kb-game-collection',
  templateUrl: './game-collection.component.html',
  styleUrls: [ './game-collection.component.scss' ]
})
export class GameCollectionComponent implements OnInit {
  public playlistData: any = {};
  public gameSortOptions = [
    'A - Z',
    'Platforms',
    'Release Date'
  ];

  public test: string = 'nothing happend yet';

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private readonly httpClient: HttpClient
  ) { }
  ngOnInit(): void {
    this.httpClient.get(`${ this.baseHref }assets/playlist-data.json`)
      .subscribe((playlistData: any) => {
        this.playlistData = {
          ...playlistData,
          games: uniqBy(playlistData.games, 'title')
        };
      });
  }

  handleTabSelection(tabName: string) {
    console.log('handleTabSelection', tabName);
    this.test = tabName;

    if (tabName === 'A - Z') {
      this.playlistData.games = this.playlistData.games.sort((a: any, b: any) => {
        return a.title.localeCompare(b.title);
      });
    }

    if (tabName === 'Platforms') {
      this.playlistData.games = this.playlistData.games.sort((a: any, b: any) => {
        if (a.platform[0] < b.platform[0]) {
          return -1;
        }
        if (a.platform[0] > b.platform[0]) {
          return 1;
        }

        return 0;
      });
    }

    if (tabName === 'Release Date') {
      this.playlistData.games = this.playlistData.games.sort((a: any, b: any) => {
        const aReleaseDate = new Date(a.releaseDate);
        const bReleaseDate = new Date(b.releaseDate);

        if (aReleaseDate < bReleaseDate) {
          return -1;
        }

        if (aReleaseDate > bReleaseDate) {
          return 1;
        }

        return 0;
      });
    }
  }
}
