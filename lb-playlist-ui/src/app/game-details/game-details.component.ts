import { combineLatest } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, ElementRef, HostBinding, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'kb-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: [ './game-details.component.scss' ]
})
export class GameDetailsComponent implements OnInit, AfterContentInit {
  private gameId?: string;
  public gameDetails: any;
  public platform: any;
  public muted: boolean = true;
  private videoIntervalId?: any;

  @HostBinding('class.hide') hide: boolean = false;
  @ViewChild('gameVideo')
    gameVideo!: ElementRef;

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private readonly httpClient: HttpClient,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit(): void {
    combineLatest([
      this.httpClient.get(`${ this.baseHref }assets/playlist-data.json`),
      this.route.params
    ])
      .subscribe(([ playlistData, params ]: any) => {
        this.gameId = params.id;
        this.gameDetails = playlistData.games.find((game: any) => game.id === this.gameId);
        this.platform = (playlistData.platforms as any)[this.gameDetails.platform];
        this.videoIntervalId = setInterval(() => {
          if (this.gameVideo?.nativeElement) {
            this.gameVideo.nativeElement.muted = !this.router.navigated;
            this.gameVideo.nativeElement.volume = 0.1;
            clearInterval(this.videoIntervalId);
          }
        }, 1000);
      });
  }

  ngAfterContentInit(): void {
    this.hide = false;
  }

  closeDetails() {
    this.hide = true;

    // listen to transition end event once and navigate back to game collection
    this.elRef.nativeElement.addEventListener('animationend', () => {
      this.router.navigate([ { outlets: { 'game-details': null } } ], {
        queryParamsHandling: 'merge'
      });
    }, { once: true });
  }

  toggleMute(video: HTMLVideoElement) {
    if (video.muted) {
      video.muted = false; // Unmute the video
    } else {
      video.muted = true; // Mute the video
    }
  }
}
