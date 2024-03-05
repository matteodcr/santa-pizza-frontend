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
  user: User;
  role: string;
}

export interface User {
  id: number;
  username: string;
  name?: string;
  description?: string;
  allergies?: string[];
}

export class RootStore {
  api: Api;

  constructor() {
    this.api = new Api('http://localhost:3000');
    makeAutoObservable(this);
  }

  private _currentUser: User | undefined = undefined;

  public get currentUser() {
    return this._currentUser;
  }

  public set currentUser(user: User | undefined) {
    this._currentUser = user;
  }

  private _users: User[] = [];

  public get users() {
    return this._users;
  }

  public set users(users: User[]) {
    this._users = users;
  }

  private _groups: Group[] = [];

  public get groups() {
    return this._groups;
  }

  public set groups(groups: Group[]) {
    this._groups = groups;
  }

  public groupById(id: number): number {
    return this.groups.findIndex((group) => group.id === id);
  }

  public userByName(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }
  public updateUser(updatedUsers: User[]): void {
    updatedUsers.forEach((updatedUser) => {
      const index = this._users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        this._users[index] = updatedUser;
      } else {
        this._users.push(updatedUser);
      }
    });
  }

  public async loadCurrentUser(): Promise<void> {
    this.currentUser = await this.api.fetchCurrentUser();
  }
}

const StoreContext = createContext(new RootStore());
export const useRootStore = () => useContext(StoreContext);
