 export const InjectKey = "INJECT_METADATA_KEY";
//  export const Constructor_Inject = "Constructor_Inject"
export function Inject(token: any) {
  return function (target: any, perperity: string, index: number) {
  console.log("Inject:",token,index)
  // console.log("token.name,",token)
  // let value = token
  // if(typeof token==="function" && token.forwardRef){
  //   value = token()
  // }
  // console.log("token.name-last", token(),value)
    // if(perperity===undefined){
    //   perperity=constructor_inject
    // }
    // Reflect.defineMetadata(InjectKey, token, target,index+"");
    let meta: Array<Function> =
      Reflect.getMetadata(InjectKey, target, perperity) || [];
    meta.unshift(token);
    Reflect.defineMetadata(InjectKey, meta, target, perperity);
  };
}
export const InjectableKey = "INJECTABLE_METADATA_KEY";
export const Injectable = () => {
  return function (target: any) {
    Reflect.defineMetadata(InjectableKey, true, target);
    return target;
  };
};



export function forwardRef<T>(fn:any) {
  fn.forwardRef = true
  return fn
}

