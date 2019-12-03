import { Injectable } from '@angular/core';

import { RestProvider } from '../rest/rest'
import { ApiRoutesProvider } from '../api-routes/api-routes'

import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ENV } from '../../env/env';

export interface User {
    email?: string;
    firstName?: string;
    lastName?: string;
    id: string;
}

@Injectable()
export class AuthProvider {

    private readonly STORAGE_TOKEN_KEY: string;
    private readonly STORAGE_REFRESH_TOKEN: string;

    constructor(
        private rest: RestProvider,
        private apiRoutes: ApiRoutesProvider
    ) {
        this.STORAGE_TOKEN_KEY = 'JWT';
        this.STORAGE_REFRESH_TOKEN = 'REFRESH_TOKEN';
    }

    
    public login = ({email, password}): Observable<any> => {
        return this.rest.post<any>(this.apiRoutes.LOGIN, {email, password})
            .pipe(
                tap(tokens => {this.storeTokens(tokens);})
            )
    }

    public storeTokens = (tokens) => {
        localStorage.setItem(this.STORAGE_TOKEN_KEY, tokens.token);
        localStorage.setItem(this.STORAGE_REFRESH_TOKEN, tokens.refreshToken);
    }

    public logout = () =>  {
        localStorage.removeItem(this.STORAGE_TOKEN_KEY);
        localStorage.removeItem(this.STORAGE_REFRESH_TOKEN);
    }
}