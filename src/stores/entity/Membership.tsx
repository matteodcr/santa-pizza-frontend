import { makeAutoObservable } from 'mobx';
import { Pizza } from '@/stores/entity/Pizza';
import { User } from '@/stores/entity/User';

export class Membership {
  id?: number = undefined;
  user?: User = undefined;
  role?: string = undefined;
  santaPizza?: Pizza = undefined;
  receiverPizza?: Pizza = undefined;

  constructor(data: any) {
    makeAutoObservable(this);
    //console.log('Membership data:', data);
    this.id = data.id;
    this.user = new User(data.user);
    this.role = data.role;
    if (data.santaPizza) {
      this.santaPizza = new Pizza(data.santaPizza);
    }
    if (data.receiverPizza) {
      this.receiverPizza = new Pizza(data.receiverPizza);
    }
  }
}
