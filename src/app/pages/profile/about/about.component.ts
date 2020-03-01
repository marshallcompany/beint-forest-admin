import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
import { throwError, of, forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

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
  public questionsData: any;
  public answersData: any;

  public form: FormGroup;
  public aboutAnswers: FormArray;

  constructor(
    public fb: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.init();
  }

  public init = () => {
    const question$ = this.profileService.getQuestion();
    const profile$ = this.profileService.getProfile();
    forkJoin(profile$, question$)
      .pipe(
        map(([profile, question]) => {
          if (profile && profile.profile && profile.profile.aboutAnswers) {
            return {
              answers: profile.profile.aboutAnswers,
              questions: question
            };
          }
          return [profile, question];
        })
      )
      .subscribe((res: any) => {
        this.questionsData = res.questions;
        this.answersData = res.answers;
        this.questionGroupInit();
        this.formData = this.form.value;
        console.log('[ ABOUT INIT ]', res);
      },
        err => {
          console.log('ERROR', err);
        }
      );
  }

  public initForm = () => {
    this.form = this.fb.group({
      aboutAnswers: this.fb.array([])
    });
  }

  public createAnswerGroup = (question, answer): FormGroup => {
    return this.fb.group({
      question: [question && question._id ? question._id : ''],
      answer: [answer && answer[0] && answer[0].answer ? answer[0].answer : '']
    });
  }

  public questionGroupInit = () => {
    this.aboutAnswers = this.form.get('aboutAnswers') as FormArray;
    if (this.aboutAnswers) {
      this.questionsData.forEach((question, index) => {
        this.aboutAnswers.push(this.createAnswerGroup(question, this.answersData.filter(e => e.question._id === question._id)));
      });
    }
  }



  public submit = (i) => {
    // const answer = {
    //   aboutAnswers: this.form.get('aboutAnswers').value.filter(e => e.answer !== '')
    // };
    this.profileService.updateProfile(this.form.value)
      .pipe(
        switchMap(formData => {
          if (JSON.stringify(this.formData) === JSON.stringify(this.form.value)) {
            return throwError('[ Fields have not changed ]');
          }
          return of(formData);
        })
      )
      .subscribe(
        res => {
          console.log('[ UPDATE PROFILE ]', res);
          this.formData = this.form.value;
          this.notificationService.notify(`The answer to the question ${i + 1} was saved successfully`, 'success');
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }

}

