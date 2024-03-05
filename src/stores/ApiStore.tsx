import { Group } from '@/stores/Root.store';

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

export default class Api {
  public onDisconnectedHandler: (() => void) | null = null;

  private readonly signin_url: string;
  private readonly signup_url: string;
  private readonly group_url: string;

  constructor(baseUrl: string) {
    this.signin_url = `${baseUrl}/auth/signin`;
    this.signup_url = `${baseUrl}/auth/signup`;
    this.group_url = `${baseUrl}/group`;
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
        console.log(data);
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      }
      throw new Error('Signin failed');
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
        const data = await res.json();
        console.log(data);

        return true;
      }
      throw new Error('Signup failed');
    });
  }

  async fetchGroups(init?: RequestInit | undefined): Promise<Group[]> {
    return this.fetch(this.group_url, init);
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
      switch (res.status) {
        case 200:
          return res.json();
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
