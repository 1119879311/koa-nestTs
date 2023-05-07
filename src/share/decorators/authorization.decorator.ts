import { setMetadata } from '@by/router';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => setMetadata(IS_PUBLIC_KEY, true);


export const IS_AUTH_KEY = 'isAuth';

export const Auth = (name?:string) => setMetadata(IS_AUTH_KEY, name || true );


