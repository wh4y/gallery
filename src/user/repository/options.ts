import { FindOptionsRelations } from 'typeorm';
import { User } from '../entity/User';

export type FindUserOptions = {
  relations: FindOptionsRelations<User>;
};

export const findUserDefaultOptions: FindUserOptions = {
  relations: {
    gallery: false,
  },
};
