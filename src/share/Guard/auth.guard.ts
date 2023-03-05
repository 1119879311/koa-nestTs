// login,veryfiy

import { AuthorityKEY } from "../Decorator";
import { IGuard } from "../routerDecorator";

export const authGuard: IGuard = ({ get, ctx }) => {
  console.log("authGuard", get(AuthorityKEY), ctx.request.query);
  //   throw new Error("forbidder");
  return true;
};
