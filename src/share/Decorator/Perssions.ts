import { setMetadata } from "../routerDecorator";

export const PERSSIONSKEY = Symbol("PERSSIONS_KEY");

export const Perssions = (data: any) => setMetadata(PERSSIONSKEY, data);
