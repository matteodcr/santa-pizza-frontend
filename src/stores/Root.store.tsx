import { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';
import Api from '@/stores/ApiStore';

export interface Group {
  id: number;
  name: string;
  description: string;
  memberships: Membership[];
  dueDate: string;
  createdAt: string;
}

export interface Membership {
  id: number;
  user: {
    id: number;
    username: string;
  };
  role: string;
}

export class RootStore {
  api: Api;

  constructor() {
    this.api = new Api('http://localhost:3000');
    makeAutoObservable(this);
  }

  private _groups: Group[] = [];

  public get groups() {
    return this._groups;
  }

  public set groups(groups: Group[]) {
    this._groups = groups;
  }
}

const StoreContext = createContext(new RootStore());
export const useRootStore = () => useContext(StoreContext);
