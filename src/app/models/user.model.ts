export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}
