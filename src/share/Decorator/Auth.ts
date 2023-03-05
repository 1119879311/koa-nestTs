import { setMetadata } from "../routerDecorator";

export const AuthorityKEY = Symbol("Authority_KEY");

export const Auth = (data?: any) => {
  if (data && typeof data !== "boolean") {
    return setMetadata(AuthorityKEY, data);
  } else {
    return setMetadata(AuthorityKEY, true);
  }
};
