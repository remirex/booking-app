export interface LoggedUserResponse {
  auth: boolean;
  jwtToken: string;
  refreshToken: string;
}
