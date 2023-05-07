// login,veryfiy

import { IS_AUTH_KEY,IS_PUBLIC_KEY } from "../decorators";
import { IGuard } from "@by/router";

export const authGuard: IGuard = ({ get, ctx }) => {
  console.log("authGuard-method", get(IS_AUTH_KEY));
  console.log("authGuard-class", get(IS_AUTH_KEY,true));

    throw new Error("forbidder");
  // return true;
};
