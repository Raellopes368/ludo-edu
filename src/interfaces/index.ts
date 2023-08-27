export interface JWTReqPayload {
  user: {
    userId: string;
  };
}

export enum UserType {
  TEACHER = 1,
  STUDENT = 2,
}
