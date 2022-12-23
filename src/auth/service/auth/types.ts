export type SignInOptions = {
  email: string;
  password: string;
};

export type SignUpOptions = {
  name: string;
} & SignInOptions;
