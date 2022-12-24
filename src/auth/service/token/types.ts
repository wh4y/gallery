export type JwtPayload = {
  userId: number;
};

export type AttachTokenToUserOptions = {
  userId: number;
  accessToken: string;
  refreshToken: string;
};
