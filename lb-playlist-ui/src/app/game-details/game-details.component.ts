import { AfterViewInit, Component, ElementRef, HostBinding, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import playlistData from '../../../result/assets/playlist-data.json';

@Component({
  selector: 'kb-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit, AfterViewInit {
  private gameId?: string;
  public gameDetails: any;
  public platform: any;

  @HostBinding('class.reveal') reveal: boolean = false;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit(): void {
    // get game id from route params
    this.route.params.subscribe(params => {
      this.gameId = params['id'];

      this.gameDetails = playlistData.games.find(game => game.id === this.gameId);
      this.platform = (playlistData.platforms as any)[this.gameDetails.platform];
    });
  }
  ngAfterViewInit(): void {
    this.reveal = true;
  }
  closeDetails() {
    this.reveal = false;

    // listen to transition end event once and navigate back to game collection
    this.elRef.nativeElement.addEventListener('transitionend', () => {
      this.router.navigate([{outlets: { 'game-details': null }}]);
    }, { once: true });

  }
  public readonly encodeURIComponent = encodeURIComponent;
}
