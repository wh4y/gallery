import { User } from '../entity/User';
import { Repository } from 'typeorm';

export class UserRepo extends Repository<User> {}
