import { Request, Response } from "express";
import { User } from "../models";
import { CreateUserInput } from "../dto";
import { GeneratePassword, GenerateSalt } from "../utility";

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
    return; // Make sure to return after sending the response
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

  res.json(createUser); // Respond with created user
};
