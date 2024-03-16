import { createContext, useContext } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import Api from '@/stores/Api.store';
import { GroupStore } from '@/stores/Group.store';
import { UserStore } from '@/stores/User.store';
import { SERVER_URL } from '@/routes';

class RootStore {
  api: Api = new Api(SERVER_URL);
  groupStore: GroupStore = new GroupStore([]);
  userStore: UserStore = new UserStore([]);

  constructor() {
    makeAutoObservable(this);
  }

  reset(): void {
    this.groupStore = new GroupStore([]);
    this.userStore = new UserStore([]);
  }

  async loadCurrentUser(): Promise<void> {
    const currentUser = await this.api.fetchCurrentUser();
    runInAction(() => {
      this.userStore.currentUserName = currentUser.username;
    });
    this.userStore.updateUsers([currentUser]);
  }

  async loadUser(username: string): Promise<void> {
    this.userStore.updateUsers([await this.api.fetchUser(username)]);
  }

  async loadGroup(groupId: number): Promise<void> {
    this.groupStore.updateGroups([await this.api.fetchGroup(groupId)]);
  }
}

const StoreContext = createContext(new RootStore());
export const useRootStore = () => useContext(StoreContext);
