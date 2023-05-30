import { Request } from "express";

export type user = {
    _id?: string;
    first_name: string;
    second_name: string;
    last_names: string;
    email: string;
    password: string;
    phone: string;
    address: {
        street: string;
        number: string;
        city: string;
        state: string;
        zip: string;
        extraInformation: string;
    };
};

export type updateUserType = Partial<user>;

export interface ExtendedRequest extends Request {
    user?: user;
}
export interface login {
    email: string;
    password: string;
}
