import { IUser } from '../../models/user.model';

// This file uses declaration merging to add a custom property to the Express Request object.
declare global {
  namespace Express {
    export interface Request {
      user?: IUser; // We are adding an optional 'user' property to the Request object
    }
  }
}
