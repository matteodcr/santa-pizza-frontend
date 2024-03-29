import { makeAutoObservable } from 'mobx';
import { Membership } from '@/stores/entity/Membership';
import { SERVER_URL } from '@/routes';

export class Group {
  id?: number = undefined;
  name?: string = undefined;
  description?: string = undefined;
  backgroundUrl?: string = undefined;
  memberships: Membership[] = [];
  dueDate?: string = undefined;
  createdAt?: string = undefined;
  status?: string = undefined;

  constructor(data: any) {
    makeAutoObservable(this);
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    if (data.backgroundUrl) {
      this.backgroundUrl = `${SERVER_URL}/${data.backgroundUrl}`;
    } else {
      this.backgroundUrl = '';
    }
    this.memberships = data.memberships.map(
      (membershipData: any) => new Membership(membershipData)
    );
    this.dueDate = data.dueDate;
    this.createdAt = data.createdAt;
    this.status = data.status;
  }
}
