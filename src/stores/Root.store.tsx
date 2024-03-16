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
  status: string;
}

export interface Membership {
  id: number;
  user: User;
  role: string;
  santaPizza: Pizza;
  receiverPizza: Pizza;
}

export interface User {
  id: number;
  username: string;
  name?: string;
  description?: string;
  avatarUrl?: string;
  allergies?: string[];
}

export interface Pizza {
  id: number;
  groupId: number;
  description: string;
  santaMembership: Membership;
  receiverMembership: Membership;
  status: string;
}

export class RootStore {
  api: Api;
  public currentUser: User | undefined = undefined;
  public groups: Group[] = [];
  private users: User[] = [];
  private pizzas: Pizza[] = [];

  constructor() {
    this.api = new Api('http://localhost:3000');
    makeAutoObservable(this);
  }

  get avatarUrl(): string {
    const url = this.currentUser?.avatarUrl;

    if (url?.startsWith('blob')) {
      return url;
    }
    return `${this.api.base_url}/${url}`;
  }

  setCurrentAvatar(blob: Blob) {
    this.currentUser!.avatarUrl = URL.createObjectURL(blob);
  }

  public reset(): void {
    this.groups = [];
    this.users = [];
    this.pizzas = [];
    this.currentUser = undefined;
  }

  public groupById(id: number): number {
    return this.groups.findIndex((group) => group.id === id);
  }

  public updateGroups(updatedGroups: Group[]): void {
    updatedGroups.forEach((updatedGroup) => {
      const index = this.groups.findIndex((group) => group.id === updatedGroup.id);
      if (index !== -1) {
        this.groups[index] = updatedGroup;
      } else {
        this.groups.push(updatedGroup);
      }
    });
  }

  deleteGroup(groupId: number): void {
    const index = this.groups.findIndex((group) => group.id === groupId);

    if (index !== -1) {
      runInAction(() => {
        this.groups.splice(index, 1);
        console.log(this.groups);
      });
    }
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

  public pizzaById(id: number): Pizza | undefined {
    return this.pizzas.find((pizza) => pizza.id === id);
  }

  public updatePizza(updatedPizzas: Pizza[]): void {
    updatedPizzas.forEach((updatedPizza) => {
      const index = this.pizzas.findIndex((pizza) => pizza.id === updatedPizza.id);
      if (index !== -1) {
        this.pizzas[index] = updatedPizza;
      } else {
        this.pizzas.push(updatedPizza);
      }
    });
  }

  public async loadCurrentUser(): Promise<void> {
    const currentUser = await this.api.fetchCurrentUser();
    runInAction(() => {
      this.currentUser = currentUser;
    });
  }

  public getUserMembership(indexStoredGroup: number): Membership | undefined {
    const group = this.groups[indexStoredGroup];

    const membership = group.memberships.find((m) => m.user.id === this.currentUser?.id);
    if (membership) {
      return membership;
    }
    return undefined;
  }

  isRemovable(usernameToCheck: string, indexStoredGroup: number): boolean {
    return (
      this.currentUser?.username !== usernameToCheck &&
      this.groups[indexStoredGroup]?.memberships.find(
        (membership) => membership.user.username === usernameToCheck
      )?.role === 'USER'
    );
  }
}

const StoreContext = createContext(new RootStore());
export const useRootStore = () => useContext(StoreContext);
