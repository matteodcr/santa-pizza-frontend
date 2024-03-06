import { createContext, useContext } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
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
  public currentUser: User | undefined = undefined;
  public groups: Group[] = [];
  private users: User[] = [];

  constructor() {
    this.api = new Api('http://localhost:3000');
    makeAutoObservable(this);
  }

  public groupById(id: number): number {
    return this.groups.findIndex((group) => group.id === id);
  }

  public userByName(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }
  public updateUser(updatedUsers: User[]): void {
    updatedUsers.forEach((updatedUser) => {
      const index = this.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      } else {
        this.users.push(updatedUser);
      }
    });
  }

  public async loadCurrentUser(): Promise<void> {
    const currentUser = await this.api.fetchCurrentUser();
    runInAction(() => {
      this.currentUser = currentUser;
    });
  }
}

const StoreContext = createContext(new RootStore());
export const useRootStore = () => useContext(StoreContext);
