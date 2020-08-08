import { Injectable } from '@angular/core';
import * as IMask from 'imask';


@Injectable()
export class DateService {

  public regexFullDateNumber = /^[0-9]{2}.[0-9]{2}.[0-9]{4}/;
  public regexFullDateEmpty = /^[a-zA-Z]{2}.[a-zA-Z]{2}.[a-zA-Z]{4}/;

  public maskFullDate: any = {
    mask: Date,
    lazy: false,
    overwrite: true,
    autofix: true,
    blocks: {
      d: { mask: IMask.MaskedRange, placeholderChar: 'T', from: 1, to: 31, maxLength: 2 },
      m: { mask: IMask.MaskedRange, placeholderChar: 'M', from: 1, to: 12, maxLength: 2 },
      Y: { mask: IMask.MaskedRange, placeholderChar: 'J', from: 1900, to: 2999, maxLength: 4 }
    }
  };

  constructor() {}

  public dateToString = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return [day, month, year].join('.');
  }

  public createNewDate = (str) =>  {
    const yearMonthDay = str.split('.');
    const year = yearMonthDay[2];
    const month = yearMonthDay[1] - 1;
    const day = yearMonthDay[0];
    return new Date(year, month, day);
  }

  public updateFormControlDate = (dateISO: string) => {
    const createDate = new Date(dateISO);
    return this.dateToString(createDate);
  }

}
