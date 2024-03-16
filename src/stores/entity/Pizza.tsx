import { makeAutoObservable } from 'mobx';
import { Membership } from '@/stores/entity/Membership';

export class Pizza {
  id?: number = undefined;
  groupId?: number = undefined;
  description?: string = undefined;
  receiverMembership?: Membership = undefined;
  status?: string = undefined;

  constructor(data: any) {
    makeAutoObservable(this);
    //console.log('Pizza data:', data);
    this.id = data.id;
    this.groupId = data.groupId;
    this.description = data.description;
    if (data.receiverMembership) {
      this.receiverMembership = new Membership(data.receiverMembership);
    }
    this.status = data.status;
  }
}
