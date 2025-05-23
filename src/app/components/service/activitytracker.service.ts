import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivityTrackerService {
  private apiUrl = `${environment.apiUrl}activity-logs`;
  private sessionId: string = this.generateSessionId();
  private userId: string | null = null;
  private previousUrl: string = '';
  logginId:any;
  constructor(private http: HttpClient, private router: Router) {
    this.logginId = localStorage.getItem('userId');

    if (this.logginId) {
      this.userId = this.logginId;
      localStorage.setItem('sessionId', this.logginId);
      // console.log('Using logginId:', this.userId);
    }

    // Capture page load and redirection events
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          // Store the previous URL before navigation starts
          this.previousUrl = event.url;
        }

        if (event instanceof NavigationEnd) {
          // After navigation ends, log the activity
          this.logActivity('Page Loaded', `Redirected from ${this.previousUrl} to ${event.url}`);
        }
      });

    // Listen for clicks on any element
    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.logActivity('Click Event', `Clicked on ${target.tagName} with class ${target.className}`);
    });
  }

  // Log an activity (page navigation or click event)
  logActivity(activity: string, data: string): void {
    const activityLog = {
      userId: this.userId, // Use the determined userId (logginId or sessionId)
      activity,
      data,
      timestamp: new Date().toISOString(),
    };

    if (this.logginId) {
      // Call like this:
      this.sendActivityToServer(activityLog).subscribe({
        next: (response: any) => {
          // console.log('Activity logged:', response);
        },
        error: (error: any) => {
          // console.error('Error logging activity:', error);
        },
      });
    }
  }
    // Define the function like this:
    private sendActivityToServer(log: any): Observable<any> {
      return this.http.post(this.apiUrl, log);
    }
  // Generate a unique session ID for the user
  private generateSessionId(): string {
    return `session_${Math.random().toString(36).substr(2, 9)}`;
  }
}
