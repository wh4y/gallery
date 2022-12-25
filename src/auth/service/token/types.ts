export type UserJwtPayload = {
  userId: number;
};

export type EmailVerificationJwtPayload = {
  email: string;
};

export type AttachTokenToUserOptions = {
  userId: number;
  accessToken: string;
  refreshToken: string;
};
