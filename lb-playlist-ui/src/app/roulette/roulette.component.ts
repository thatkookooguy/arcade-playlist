import { uniqBy } from 'lodash';
import { combineLatest } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kb-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: [ './roulette.component.scss' ]
})
export class RouletteComponent implements OnInit {
  public playlistData: any = {};

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private readonly httpClient: HttpClient,
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
      });
  }
}
