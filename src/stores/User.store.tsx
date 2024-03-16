import { makeAutoObservable } from 'mobx';
import { User } from '@/stores/entity/User';

export class UserStore {
  users: User[] = [];
  currentUserName: string | undefined = undefined;

  constructor(users: User[]) {
    makeAutoObservable(this);
    this.users = users;
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  getUserByIndex(userIndex: number): User | undefined {
    return this.users[userIndex];
  }

  getCurrentUser(): User | undefined {
    return this.getUserByUsername(this.currentUserName!);
  }

  setCurrentAvatar(blob: Blob) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.avatarUrl = URL.createObjectURL(blob);
    }
  }
  updateUsers(updatedUsers: User[]): void {
    updatedUsers.forEach((updatedUser) => {
      const index = this.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      } else {
        this.users.push(updatedUser);
      }
    });
  }
}
