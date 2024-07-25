import { Repository } from "typeorm";

import { User } from "../entity/User";
import { userData } from "../types";

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  async create({ firstName, lastName, email, password }: userData) {
    // const userRepository = AppDataSource.getRepository(User);
    await this.userRepository.save({ firstName, lastName, email, password });
  }
}
