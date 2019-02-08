//import { Component, OnInit , Inject} from '@angular/core';
import { Component, OnInit , Inject, HostListener, Directive } from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../model/user.model";
import {ApiService} from "../core/api.service";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

//  // ページング
//  begin= 0;
//  length = 3;
//  pagerArray: number[];

  users: User[];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    if(!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
//    this.apiService.getUsers().subscribe(data => {
////          this.users = data.result;
//          this.users = data;
//    });
      
//    const start = 0;
//    this.apiService.getUsersParts(start, this.perPage).subscribe(data => {
//        this.total = data.total;
//        this.users = data.users;
//        this.p = 1;
//    });

// 無限スクロール①
//      this.apiService.getUsersParts(0, 40).subscribe(data => {
//          this.users = data.users;
//      });
      
// 無限スクロール②
      this.apiService.getUsersParts(0, 100).subscribe(data => {
          this.users = data.users.slice(0, 20);
          this.nextUsers = data.users.slice(20, 100 - 20);
          console.log('test');
          console.log(this.users);
          console.log(this.nextUsers);
          if (this.nextUsers != null) {
            this.latestId = this.nextUsers[this.nextUsers.length - 1].id;
          }
          console.log(this.latestId);
      });
      
  }

// 絞り込み
//  filterId(): void {
//    this.users = this.users.filter(u => {
//      u.id.toString();
//
//    });
//  }
    
  deleteUser(user: User): void {
    this.apiService.deleteUser(user.id)
      .subscribe( data => {
        this.users = this.users.filter(u => u !== user);
      })
  };

  editUser(user: User): void {
    window.localStorage.removeItem("editUserId");
    window.localStorage.setItem("editUserId", user.id.toString());
    this.router.navigate(['edit-user']);
  };

  addUser(): void {
    this.router.navigate(['add-user']);
  };

// ngx-pagination
    // 1ページ辺りの表示件数
    perPage: number = 8;
    // 選択ページ
    p: number = 1;
　　// 全件数
    total: number;

    getPage(page: number) {
        const start = (page - 1) * this.perPage;
        this.apiService.getUsersParts(start, this.perPage).subscribe(data => {
            this.total = data.total;
            this.users = data.users;
            this.p = page;
        });
    }

// 無限スクロール②
    latestId: number;
    nextUsers: User[];
    isBusy = false;
    isUserEnd = false;

    track(value: number): void {
        console.log(value);
        if (this.isUserEnd == false) {
            // まだサーバ上に追加レコードがある
            if (this.isBusy == false && value == 100) {
                // 処理中でなく、スクロール位置が100%に達した場合
                // 処理中フラグを立てる
                this.isBusy = true;
                if (this.nextUsers != null && this.nextUsers.length > 0) {
                    // メモリ上の次データが存在する場合
                    let length = 20;
                    let isNothing = false;
                    if (this.nextUsers.length <= 20) {
                        length = this.nextUsers.length;
                        // メモリ上の次データ件数が今回処理で空になる
                        isNothing = true;
                    }
                    this.users = this.users.concat(this.nextUsers.slice(0, length));
                    if (isNothing == false) {
                        // メモリ上の次データを一覧に追加した分だけ減らす
                        this.nextUsers = this.nextUsers.slice(20, this.nextUsers.length);
                    } else {
                        // メモリ上の次データを空にする
                        this.nextUsers = null;
                    }
                    this.isBusy = false;
                } else {
                    // メモリ上の次データが存在しない場合
                    // 次データの取得を行う
                    this.apiService.getUsersAddParts(this.latestId, 100).subscribe(data => {
                        // 取得結果を一覧とメモリ上の次データに展開
                        this.users = this.users.concat(data.users.slice(0, 20));
                        this.nextUsers = data.users.slice(20, data.users.length);
                        if (this.nextUsers.length > 0) {
                            // 取得結果の最終データのキーを保持する
                            this.latestId = this.nextUsers[this.nextUsers.length - 1].id;
                        } else {
                            // 次データ無しの状態
                            this.latestId = null;
                            this.isUserEnd = true;
                        }
                        this.isBusy = false;
                    });
                }
            }
        }
    }

/*
// 無限スクロール①
    latestId: number;
    nextUsers: User[];
    isBusy = false;

    track(value: number): void {
        console.log(value);
        if (this.isBusy == false && value > 98) {
            this.isBusy = true;
            console.log("末端付近です [" + this.latestId + "]");
            this.apiService.getUsersAddParts(this.latestId, 40).subscribe(data => {
                console.log(data);
                this.users = this.users.concat(data.users);
                this.latestId = this.users[this.users.length - 1].id;
                this.isBusy = false;
            });
        }
    }
*/
}
