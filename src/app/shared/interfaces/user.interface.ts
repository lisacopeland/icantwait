/**
 * Model for the user object
 *
 * @export
 * @class User
 */
export interface User {
     first_name: string;
     last_name: string;
     email: string;
     password: string;
     roles: string[];
}

export interface UserResponse {
    customToken: string;
    uid: string;
    first_name: string;
    last_name: string;
    email: string;
    roles: string[];
    message: string;
    code: string;
}
