import { Component } from '@angular/core';
import { SingleagentprojectlistingrentService } from '../service/singleagentprojectlistingrent.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agentprojectsrent',
  templateUrl: './agentprojectsrent.component.html',
  styleUrls: ['./agentprojectsrent.component.css']
})
export class AgentprojectsrentComponent {

  allsingleagentprojectData:any;
  allsingleagentprojectcount:any;
  allsingleagentproject: any = [];

  constructor(
    public http: HttpClient,
    private singleagentprojectlistingService: SingleagentprojectlistingrentService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.loadSingleAgent();
  }
  loadSingleAgent(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id) {
      const numericId = parseInt(id, 10); // Convert id to a number
      if (!isNaN(numericId)) {
        this.singleagentprojectlistingService.getagentprojectsrent(numericId).subscribe(
          (response: any) => {
            this.allsingleagentprojectData = response;
            this.allsingleagentprojectcount = this.allsingleagentprojectData?.responseData?.singleagentprojectlistingrentcount;
            this.allsingleagentproject = this.allsingleagentprojectData?.responseData?.singleagentprojectlistingrent;
          },
          (error: any) => {
            console.error('Error fetching all builders:', error);
          }
        );
      } else {
        console.error('Invalid ID:', id);
      }
    }
  }  
}
