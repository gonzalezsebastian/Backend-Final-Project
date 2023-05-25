export type user = {
    first_name: string;
    second_name: string;
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
}

export type updateUserType = Partial<user>;

export interface login{
    email: string;
    password: string;
}