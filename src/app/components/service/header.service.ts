import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private refreshNeeded$ = new BehaviorSubject<boolean>(false);
  refresh$ = this.refreshNeeded$.asObservable();

  triggerRefresh() {
    this.refreshNeeded$.next(true);
  }

  resetRefresh() {
    this.refreshNeeded$.next(false);
  }
}
