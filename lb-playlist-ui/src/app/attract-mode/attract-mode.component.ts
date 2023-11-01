import { uniqBy } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kb-attract-mode',
  templateUrl: './attract-mode.component.html',
  styleUrls: [ './attract-mode.component.scss' ]
})
export class AttractModeComponent implements OnInit, AfterViewInit, OnDestroy {
  public playlistData: any = {};
  public currentGame: any;
  public currentGameIndex = 0;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(
    private readonly httpClient: HttpClient,
    @Inject(APP_BASE_HREF) public baseHref: string,
    private readonly route: ActivatedRoute
  ) { }
  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  ngAfterViewInit(): void {
    this.intervalId = setInterval(() => {
      this.currentGameIndex++;
      this.currentGame = this.playlistData.games[this.currentGameIndex % this.playlistData.games.length];
    }, 100);
  }

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

        this.currentGame = this.playlistData.games[0];
      });
  }
}