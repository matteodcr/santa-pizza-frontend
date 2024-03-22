import { Group } from '@/stores/entity/Group';
import { User } from '@/stores/entity/User';
import { Membership } from '@/stores/entity/Membership';
import { Pizza } from '@/stores/entity/Pizza';

export interface SignUpData {
  username: string;
  mail: string;
  password: string;
}

export interface SignInData {
  username: string;
  mail?: string;
  password: string;
}

export interface CreateGroupData {
  name: string;
  description: string;
  dueDate: string;
}

export interface AddUserData {
  groupId: number;
  username: string;
}

export interface RemoveUserData {
  groupId: number;
  username: string;
}

export interface UpdateUserData {
  name: string;
  description: string;
  allergies: string[];
}

export interface ChangeRoleData {
  groupId: number;
  username: string;
  role: string;
}

export default class Api {
  public onDisconnectedHandler: (() => void) | null = null;

  public readonly base_url: string;
  private readonly signin_url: string;
  private readonly signup_url: string;
  private readonly group_url: string;
  private readonly user_url: string;
  private readonly membership_url: string;
  private readonly pizza_url: string;

  constructor(baseUrl: string) {
    this.base_url = baseUrl;
    this.signin_url = `${baseUrl}/auth/signin`;
    this.signup_url = `${baseUrl}/auth/signup`;
    this.group_url = `${baseUrl}/group`;
    this.user_url = `${baseUrl}/user`;
    this.membership_url = `${baseUrl}/membership`;
    this.pizza_url = `${baseUrl}/pizza`;
  }

  async signin(form: SignInData): Promise<boolean> {
    return fetch(this.signin_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    }).then(async (res) => {
      if (res.ok) {
        const data: { accessToken: string } = await res.json();
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      }
      return false;
    });
  }

  async signup(form: SignUpData): Promise<boolean> {
    return fetch(this.signup_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    }).then(async (res) => {
      if (res.ok) {
        await res.json();
        return true;
      }
      throw new Error('Signup failed');
    });
  }

  async fetchGroups(init?: RequestInit | undefined): Promise<Group[]> {
    return (await this.fetch(this.group_url, init)).map((group: any) => new Group(group));
  }
  async fetchGroup(groupiId: number, init?: RequestInit | undefined): Promise<Group> {
    return new Group(await this.fetch(`${this.group_url}/${groupiId}`, init));
  }

  async fetchCurrentUser(init?: RequestInit | undefined): Promise<User> {
    return new User(await this.fetch(`${this.user_url}/me`, init));
  }

  async fetchUser(username: string, init?: RequestInit | undefined): Promise<User> {
    return new User(await this.fetch(`${this.user_url}/${username}`, init));
  }

  async fetchPizza(pizzaId: number, init?: RequestInit | undefined): Promise<Pizza> {
    return new Pizza(await this.fetch(`${this.pizza_url}/${pizzaId}`, init));
  }

  async createGroup(createGroupData: CreateGroupData): Promise<Group> {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createGroupData),
    };
    return new Group(await this.fetch(`${this.group_url}`, requestOptions));
  }

  async deleteGroup(groupId: number, init?: RequestInit | undefined): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: init?.body,
    };
    return this.fetch(`${this.group_url}/${groupId}`, requestOptions);
  }

  async associateGroup(groupId: number, init?: RequestInit | undefined): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: init?.body,
    };
    return this.fetch(`${this.group_url}/${groupId}/associate`, requestOptions);
  }

  async closeGroup(groupId: number, init?: RequestInit | undefined): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: init?.body,
    };
    return this.fetch(`${this.group_url}/${groupId}/close`, requestOptions);
  }

  async updateGroupName(groupId: number, form: { name: string }): Promise<Group> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    };
    return new Group(await this.fetch(`${this.group_url}/${groupId}/name`, requestOptions));
  }

  async updateGroupDescription(groupId: number, form: { description: string }): Promise<Group> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    };
    return new Group(await this.fetch(`${this.group_url}/${groupId}/description`, requestOptions));
  }

  async updateGroupDate(groupId: number, form: { dueDate: string }): Promise<Group> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    };
    return new Group(await this.fetch(`${this.group_url}/${groupId}/date`, requestOptions));
  }

  async addUser(addUserData: AddUserData): Promise<Group> {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addUserData),
    };
    return new Group(await this.fetch(`${this.membership_url}/add`, requestOptions));
  }

  async removeUser(removeUserData: RemoveUserData): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(removeUserData),
    };
    return this.fetch(`${this.membership_url}/remove`, requestOptions);
  }

  async updateUser(updateUserData: UpdateUserData): Promise<Membership> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateUserData),
    };
    return new User(await this.fetch(`${this.user_url}/modify`, requestOptions));
  }

  async updateAvatar(formData: FormData): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'POST',
      body: formData,
    };
    return this.fetch(`${this.user_url}/upload`, requestOptions);
  }

  async updateBackground(formData: FormData, groupId: number): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'POST',
      body: formData,
    };
    return this.fetch(`${this.group_url}/${groupId}/upload`, requestOptions);
  }

  async changeRole(updateUserData: ChangeRoleData): Promise<Membership> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateUserData),
    };
    return new Membership(await this.fetch(`${this.membership_url}/update`, requestOptions));
  }

  private async fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<any | null> {
    const headers: Record<string, any> = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}` || '',
    };

    if (!(init?.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const mergedInit = {
      ...init,
      headers: {
        ...init?.headers,
        ...headers,
      },
    };

    return fetch(input, mergedInit).then((res) => {
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        }
        return res.text().then((text) => ({
          contentType,
          body: text,
        }));
      }
      switch (res.status) {
        case 401: {
          this.onDisconnectedHandler?.();
          return null;
        }
        default:
          //TODO throw real errors
          throw res;
      }
    });
  }
}
