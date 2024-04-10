import { Component } from '@angular/core';
import { getDatabase, ref, set } from "firebase/database";

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {
  /*data = {
    username: '',
    age: 0,
  }*/

  constructor() {}

  ngOnInit() {}

  saveData(): void {
    //console.log(this.data);
    const db = getDatabase();
    /*set(ref(db, 'users/'), {
      username: this.data.username,
      age: this.data.age,
    });*/
  }

}
