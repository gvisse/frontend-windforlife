export class UserCredentials{
    username!: string;
    password!: string;
}

export class User{
    id!: number;
    username!: string;
    email!: string;
    is_superuser!: boolean;
    is_staff!: boolean;
    first_name?: string;
    last_name?: string;
}