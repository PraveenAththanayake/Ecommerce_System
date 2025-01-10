import { Request, Response } from "express";
import { User } from "../models";
import { CreateUserInput, EditUserInput, UserLoginInput } from "../dto";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utility";

export const FindUser = async (id: string | undefined, email?: string) => {
  if (email) {
    return await User.findOne({ email: email });
  } else {
    return await User.findById(id);
  }
};

export const CreateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstName, lastName, address, email, phone, password, role } = <
    CreateUserInput
  >req.body;

  const existingUser = await FindUser("", email);

  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    address: address,
    email: email,
    phone: phone,
    password: userPassword,
    salt: salt,
    role: role,
  });

  res.json(createUser);
  return;
};

export const GetUsers = async (req: Request, res: Response) => {
  const users = await User.find();

  if (users != null) {
    res.json(users);
    return;
  } else {
    res.json({ message: "No users found" });
    return;
  }
};

export const GetUserById = async (req: Request, res: Response) => {
  const UserId = req.params.id;

  const user = await FindUser(UserId);

  if (user != null) {
    res.json(user);
    return;
  } else {
    res.json({ message: "User not found" });
    return;
  }
};

export const UserLogin = async (req: Request, res: Response) => {
  const { email, password } = <UserLoginInput>req.body;

  const existingUser = await FindUser("", email);

  if (existingUser != null) {
    const validation = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt
    );

    if (validation) {
      const signature = await GenerateSignature({
        _id: existingUser._id as string,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role,
      });

      console.log("Login successful for user:", existingUser.email);
      res.json({
        _id: existingUser._id as string,
        token: signature,
        role: existingUser.role,
        message: "Login successful",
      });
      return;
    } else {
      res.status(400).json({ message: "Invalid password" });
      return;
    }
  }

  res.status(404).json({ message: "User not found" });
  return;
};

export const GetUserProfile = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const existingUser = await FindUser(user._id);
    res.json(existingUser);
    return;
  }

  res.json({ message: "User not found" });
  return;
};

export const UpdateUserProfile = async (req: Request, res: Response) => {
  const { firstName, lastName, phone, address, email } = <EditUserInput>(
    req.body
  );

  const user = req.user;

  if (user) {
    const existingUser = await FindUser(user._id);

    if (existingUser != null) {
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.phone = phone;
      existingUser.address = address;
      existingUser.email = email;

      const savedResult = await existingUser.save();
      res.json(savedResult);
      return;
    }
    res.json(existingUser);
    return;
  }

  res.json({ message: "User not found" });
  return;
};

export const DeleteUser = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const existingUser = await FindUser(user._id);

    if (existingUser != null) {
      await existingUser.deleteOne();
      res.json({ message: "User deleted" });
      return;
    }
    res.json({ message: "User not found" });
    return;
  }
};
