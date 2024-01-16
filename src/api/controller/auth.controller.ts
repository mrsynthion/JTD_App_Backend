import {
  comparePasswords,
  validateEmail,
  validatePassword,
  validateSignUpData,
} from "../../utils/auth.utils";
import { hash } from "bcrypt";
import { ErrorCode } from "../../global-types/error.types";
import { User } from "../entity/User";
import { AppDataSource } from "../../data-source";
import {
  generateToken,
  verifyToken,
} from "../../utils/token-managements.utils";
import { RegisterDto, saltRounds } from "../../global-types/auth.types";
import { Repository } from "typeorm";
import { UserDto } from "../../global-types/user.types";

const userRepository: Repository<User> = AppDataSource.getRepository(User);

async function signup(registerUserData: RegisterDto): Promise<UserDto> {
  try {
    validateSignUpData(registerUserData);
    const hashedPass: string = await hash(
      registerUserData.password,
      saltRounds,
    );
    registerUserData = { ...registerUserData, password: hashedPass };
    const newUser: UserDto = await userRepository.save(registerUserData);
    delete newUser["password"];
    return newUser;
  } catch ({ message }) {
    throw new Error(message);
  }
}

async function login(
  email: string,
  password: string,
): Promise<[UserDto, string]> {
  try {
    validateEmail(email);
    validatePassword(password);
    const user: UserDto = await userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new Error(ErrorCode.ACNFU);
    await comparePasswords(password, user.password);

    const token = generateToken(user);

    delete user["password"];
    return [user, token];
  } catch ({ message }) {
    throw new Error(message);
  }
}

function verifyUserToken(token: string): boolean {
  return verifyToken(token);
}

export const AuthControllerFunctions = {
  login,
  signup,
  verifyUserToken,
};
