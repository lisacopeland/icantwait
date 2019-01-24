import { AddressInterface } from './address.interface';

/**
 * Model for the user object
 *
 * @export
 * @class User
 */
export interface AuthUserInterface {
     firstName: string;
     lastName: string;
     email: string;
     password: string;
}

export interface UserInterface {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    address: AddressInterface;
    status: string; // pending, suspended, active, inactive
  }

export interface UserInterfaceWithId extends UserInterface {
    id: string;
}
