import { makeAutoObservable, runInAction } from 'mobx';
import { Group } from '@/stores/entity/Group';
import { Membership } from '@/stores/entity/Membership';
import { User } from '@/stores/entity/User';

export class GroupStore {
  groups: Group[] = [];

  constructor(groups: Group[]) {
    makeAutoObservable(this);
    this.groups = groups;
  }

  getGroups(): Group[] {
    return this.groups;
  }

  getGroupByIndex(groupIndex: number): Group | undefined {
    return this.groups[groupIndex];
  }

  getGroupById(id: number): Group {
    return this.groups.find((group) => group.id === id)!;
  }

  updateGroups(updatedGroups: Group[]): void {
    updatedGroups.forEach((updatedGroup) => {
      const index = this.groups.findIndex((group) => group.id === updatedGroup.id);
      if (index !== -1) {
        runInAction(() => {
          this.groups[index] = updatedGroup;
        });
      } else {
        runInAction(() => {
          this.groups.push(updatedGroup);
        });
      }
    });
  }

  deleteGroup(groupId: number): void {
    const index = this.groups.findIndex((group) => group.id === groupId);

    if (index !== -1) {
      runInAction(() => {
        this.groups.splice(index, 1);
      });
    }
  }

  getUserMembership(group: Group, user: User): Membership | undefined {
    const userMembership = group.memberships.find((membership) => membership.user?.id === user.id);
    if (userMembership) {
      return userMembership;
    }
    return undefined;
  }

  setBackgroundUrl(group: Group, blob: Blob): void {
    runInAction(() => {
      group.backgroundUrl = URL.createObjectURL(blob);
    });
  }

  isRemovable(user: User, currentUser: User, group: Group): boolean {
    return (
      user?.username !== currentUser.username &&
      group.memberships.find((membership) => membership.user?.username === user.username)?.role ===
        'USER'
    );
  }
}
