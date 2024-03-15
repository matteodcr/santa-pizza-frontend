import { Group, Pizza, User } from '@/stores/Root.store';

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
    return this.fetch(this.group_url, init);
  }
  async fetchGroup(groupiId: number, init?: RequestInit | undefined): Promise<Group> {
    return this.fetch(`${this.group_url}/${groupiId}`, init);
  }

  async fetchCurrentUser(init?: RequestInit | undefined): Promise<User> {
    return this.fetch(`${this.user_url}/me`, init);
  }

  async fetchUser(username: string, init?: RequestInit | undefined): Promise<User> {
    return this.fetch(`${this.user_url}/${username}`, init);
  }

  async fetchPizza(pizzaId: number, init?: RequestInit | undefined): Promise<Pizza> {
    return this.fetch(`${this.pizza_url}/${pizzaId}`, init);
  }

  async createGroup(
    createGroupData: CreateGroupData,
    init?: RequestInit | undefined
  ): Promise<Group> {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createGroupData),
    };
    return this.fetch(`${this.group_url}`, requestOptions);
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

  async updateGroupName(
    groupId: number,
    form: { name: string },
    init?: RequestInit | undefined
  ): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    };
    return this.fetch(`${this.group_url}/${groupId}/name`, requestOptions);
  }

  async updateGroupDescription(
    groupId: number,
    form: { description: string },
    init?: RequestInit | undefined
  ): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    };
    return this.fetch(`${this.group_url}/${groupId}/description`, requestOptions);
  }

  async updateGroupDate(
    groupId: number,
    form: { dueDate: string },
    init?: RequestInit | undefined
  ): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    };
    return this.fetch(`${this.group_url}/${groupId}/date`, requestOptions);
  }

  async addUser(addUserData: AddUserData, init?: RequestInit | undefined): Promise<Group> {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addUserData),
    };
    return this.fetch(`${this.membership_url}/add`, requestOptions);
  }

  async removeUser(removeUserData: RemoveUserData, init?: RequestInit | undefined): Promise<Group> {
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(removeUserData),
    };
    return this.fetch(`${this.membership_url}/remove`, requestOptions);
  }

  async updateUser(updateUserData: UpdateUserData, init?: RequestInit | undefined): Promise<void> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateUserData),
    };
    return this.fetch(`${this.user_url}/modify`, requestOptions);
  }

  async changeRole(updateUserData: ChangeRoleData, init?: RequestInit | undefined): Promise<Group> {
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateUserData),
    };
    return this.fetch(`${this.membership_url}/update`, requestOptions);
  }

  private async fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<any | null> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}` || '',
      'Content-Type': 'application/json',
    };

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
          throw res;
      }
    });
  }
}
