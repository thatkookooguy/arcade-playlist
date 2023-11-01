// import { Chance } from 'chance';
import { uniqBy } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// const chance = new Chance();
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

  public sortBy: string = this.gameSortOptions[0];

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    combineLatest([
      this.httpClient.get(`${ this.baseHref }assets/playlist-data.json`),
      this.route.queryParamMap
    ])
      .subscribe(([ playlistData, queryParams ]: any) => {
        this.playlistData = {
          ...playlistData,
          games: uniqBy(playlistData.games, 'title')
        };

        this.playlistData.games = this.playlistData.games.map((game: any) => ({
          ...game,
          collectionImage: `${ this.baseHref }assets/optimized/${ game.cover.replace('.png', '.webp').replace('.jpg', '.webp').replace('.jpeg', '.webp') }`
        }));

        // this.playlistData.name = chance.sentence({ words: 3, punctuation: false });
        // this.playlistData.cover = 'https://fakeimg.pl/180x230/303030/616161?text=cover&font=bebas';

        // this.playlistData.games = this.playlistData.games.map((game: any) => ({
        //   ...game,
        //   title: chance.sentence({ words: 3, punctuation: false }),
        //   developer: chance.sentence({ words: 3, punctuation: false }),
        //   cover: null
        // }));

        this.handleTabSelection(queryParams.params.sortBy || 'A - Z');
      });
  }

  async handleTabSelection(tabName: string) {
    await this.router.navigate([], {
      queryParams: { sortBy: tabName },
      queryParamsHandling: 'merge'
    });
    this.sortBy = tabName;

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
