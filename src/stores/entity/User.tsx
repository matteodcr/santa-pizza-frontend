import { makeAutoObservable } from 'mobx';
import { SERVER_URL } from '@/routes';

export class User {
  id?: number = undefined;
  username?: string = undefined;
  name?: string = undefined;
  description?: string = undefined;
  avatarUrl?: string = undefined;
  allergies?: string[] = [];

  constructor(data: any) {
    //console.log('User data:', data);
    makeAutoObservable(this);
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.description = data.description;
    if (data.avatarUrl) {
      this.avatarUrl = `${SERVER_URL}/${data.avatarUrl}`;
    } else {
      this.avatarUrl = '';
    }
    this.allergies = data.allergies;
  }
}
