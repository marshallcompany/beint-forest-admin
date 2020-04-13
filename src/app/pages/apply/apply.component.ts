import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { ProfileService } from 'src/app/services/profile.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  public profileData: object;
  public privacyPolicy;

  constructor(
    public downloadFileService: DownloadFileService,
    public authService: AuthService,
    private profileService: ProfileService
  ) {
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  dataRefresh = () => {
    this.getUserProfile();
  }

  public getUserProfile = () => {
    if (this.authService.getAuthData()) {
      this.profileService.getProfile()
        .pipe(
          map((fullUserProfile: any) => {
            if (fullUserProfile) {
              return {
                firstName: fullUserProfile.profile.personal.firstName,
                avatar: fullUserProfile.media.avatar.storagePath
              };
            }
            return fullUserProfile;
          })
        )
        .subscribe(
          res => {
            this.profileData = res;
            console.log('PROFILE DATA', res);
          }
        );
    }
    return;
  }

  public downloadCvFile = () => {
    this.downloadFileService.downloadCandidateCv();
  }

}
