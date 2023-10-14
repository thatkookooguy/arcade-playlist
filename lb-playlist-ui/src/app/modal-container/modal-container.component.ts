import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'kb-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss']
})
export class ModalContainerComponent implements OnDestroy {
  destroy = new Subject<any>();
  gameId = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    route.params.pipe(takeUntil(this.destroy)).subscribe(params => {

        // When router navigates on this component is takes the params and opens up the photo detail modal
        // this.currentDialog = this.modalService.open(PhotoDetailComponent, {centered: true});
        this.gameId = params['id'];
    });
  }

  closeModal() {
    this.router.navigateByUrl('/');
  }

  ngOnDestroy() {
    this.destroy.next(null);
  }
}
