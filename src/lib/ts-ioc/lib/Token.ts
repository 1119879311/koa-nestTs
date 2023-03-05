export interface Type<T> extends Function {
    new (...args:any[]):T
}

export class InjectToken  {
    constructor(
        public injectIdefer:string
    ){}
}

export type Token<T> = Type<T>|InjectToken | string 


export function getTokenName<T>(token:Token<T>){
    return (typeof token==="string")
     ?token
     :(token instanceof InjectToken
        ?token.injectIdefer:token.name
      )
}
     