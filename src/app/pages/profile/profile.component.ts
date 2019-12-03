import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class PersonalDataComponent implements OnInit {

  public profileData: object;
  public jobId: string;

  constructor(
    private profile: ProfileService,
    private route: ActivatedRoute
  ) {
    // this.route.params.subscribe(params => console.log(params));

  }

  async ngOnInit() {
    try {
      this.profileData = await this.profile.getProfile();
      this.jobId = this.route.snapshot.paramMap.get('jobId');
    } catch (error) {
      console.log('error', error);
    }
  }

}
