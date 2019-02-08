import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from "../model/user.model";
import {Observable} from "rxjs/index";
import {ApiResponse} from "../model/api.response";
import {ApiResult} from "../model/api.result";
import {UsersResult} from "../model/users.result";

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }
//  baseUrl: string = 'http://localhost:8080/users/';
  baseUrl: string = 'http://172.16.1.197:8080/users/';

  login(loginPayload) : Observable<ApiResponse> {
//    return this.http.post<ApiResponse>('http://localhost:8080/'+ 'token/generate-token', loginPayload);
    return this.http.post<ApiResponse>('http://172.16.1.197:8080/'+ 'token/generate-token', loginPayload);
  }

//  getUsers() : Observable<ApiResponse> {
  getUsers() : Observable<User[]> {
//    return this.http.get<ApiResponse>(this.baseUrl);
    return this.http.get<User[]>(this.baseUrl);
  }

//  getUserById(id: number): Observable<ApiResponse> {
  getUserById(id: number): Observable<User> {
//    return this.http.get<ApiResponse>(this.baseUrl + id);
    return this.http.get<User>(this.baseUrl + id);
  }

  createUser(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl + "signup", user);
  }

  updateUser(user: User): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + user.id, user);
  }

  deleteUser(id: number): Observable<ApiResult> {
    return this.http.delete<ApiResult>(this.baseUrl + id);
  }

  getUsersParts(start: number, count: number) : Observable<UsersResult> {
    return this.http.get<UsersResult>(this.baseUrl + 'parts' + '?from=' + start + '&cnt=' + count);
  }

  getUsersAddParts(id: number, count: number) : Observable<UsersResult> {
    return this.http.get<UsersResult>(this.baseUrl + 'add' + '?id=' + id + '&cnt=' + count);
  }
}
