import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

export interface Question {
  question: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/profile/category-07.svg',
    nameCategory: 'Ich über mich',
    nextCategory: 'about'
  };
  public formData: any;
  public answerData: any;

  public form: FormGroup;
  public aboutAnswers: FormArray;

  public question: Array<Question>;

  constructor(
    public fb: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationService,
  ) {

    this.question = [
      { question: 'Was motiviert dich?' },
      { question: 'Welchen Witz würdest du in einem Vorstellungsgespräch erzählen?' },
      { question: 'Was ist deine Supermacht?' }
    ];
  }

  ngOnInit(): void {
    this.init();
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
          this.answerData = res;
          this.formInit();
          this.formData = this.form.value;
        },
        err => {
          console.log('ERROR', err);
        }
      );
  }

  public formInit = () => {
    this.form = this.fb.group({
      aboutAnswers: this.fb.array([])
    });
    this.questionGroupInit(this.answerData);
  }

  public createAnswerGroup = (index, question?, ): FormGroup => {
    return this.fb.group({
      question: [question ? question.question : ''],
      answer: [this.answerData && this.answerData.answers ? this.answerData.answers[index].answer : '']
    });
  }

  public questionGroupInit = (answerData) => {
    this.aboutAnswers = this.form.get('aboutAnswers') as FormArray;
    if (this.aboutAnswers) {
      this.question.forEach((question, index) => {
        this.aboutAnswers.push(this.createAnswerGroup(index, question));
      });
    }
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
