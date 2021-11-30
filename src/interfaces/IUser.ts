export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  verificationToken: {
    token: string;
    expires: Date;
  };
  verified: number;
  role: string;
  status: string;
}

export interface IRefreshToken {
  id: string;
  user: object;
  token: string;
  createdByIp: string;
  revokedByIp: string;
  isActive: boolean;
  revoked: number;
  replacedByToken: string;
}

export interface IUserInputDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  acceptTerms: boolean;
}

export interface ITokenInputDTO {
  token: string;
}

export interface IUserLoginDTO {
  email: string;
  password: string;
}
