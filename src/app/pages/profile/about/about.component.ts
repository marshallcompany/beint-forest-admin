import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

export interface Question {
  text: string;
  placeholder: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public formData: object;

  public form: FormGroup;
  public aboutAnswers: FormArray;

  public question: Array<Question>;

  constructor(
    public fb: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationService,
  ) {

    this.question = [
      { text: 'Was motiviert dich?', placeholder: 'die Antwort eingeben' },
      { text: 'Welchen Witz würdest du in einem Vorstellungsgespräch erzählen?', placeholder: 'die Antwort eingeben' },
      { text: 'Was ist deine Supermacht?', placeholder: 'die Antwort eingeben' }
    ];
  }

  ngOnInit(): void {
    this.init();
  }


  public formInit = (answer?) => {
    this.form = this.fb.group({
      aboutAnswers: this.fb.array([
        this.fb.group({
          answer: [answer && answer.answers[0] && answer.answers[0].answer ? answer.answers[0].answer : '']
        }),
        this.fb.group({
          answer: [answer && answer.answers[1] && answer.answers[1].answer ? answer.answers[1].answer : '']
        }),
        this.fb.group({
          answer: [answer && answer.answers[2] && answer.answers[2].answer ? answer.answers[2].answer : '']
        })
      ])
    });
    this.aboutAnswers = this.form.get('aboutAnswers') as FormArray;
  }

  public init = () => {
    this.profileService.getProfile()
      .pipe(
        map((profileDate: any) => {
          if (profileDate && profileDate.profile && profileDate.profile.aboutAnswers) {
            return {
              answers: profileDate.profile.aboutAnswers
            };
          }
          return profileDate;
        })
      )
      .subscribe(
        res => {
          this.formInit(res);
          this.formData = this.form.value;
        },
        err => {
          this.formInit();
        }
      );
  }

  public submit = (field: string) => {
    this.profileService.updateProfile(this.form.value)
      .pipe(
        switchMap(formData => {
          if (JSON.stringify(this.formData) === JSON.stringify(this.form.value)) {
            return throwError('[ Fields did not apologize ]');
          }
          return of(formData);
        })
      )
      .subscribe(
        res => {
          console.log('[ UPDATE PROFILE ]', res);
          this.formData = this.form.value;
          this.notificationService.notify(`The answer to the question ${field} was saved successfully`, 'success');
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }
}
