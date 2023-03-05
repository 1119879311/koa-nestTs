import "reflect-metadata";
import { B } from "./depB";
import { A,G} from "./depA";
import { forwardRef, InjectKey } from "./common"

const proviersMap = new Map();
const instancesMap = new Map();
const instancesforwardMap = new Map();
const instancesWeakMap = new Map()
console.log("---",A,B)
const proviers = [forwardRef(()=>A), forwardRef(()=>B),G];
proviers.forEach((item) => {
  console.log("proviers-itme",item,item.forwardRef)
  if(typeof item==="function" && item.forwardRef){
     let res = item()
     instancesWeakMap.set(res,  Object.create(res.prototype));
  }else{
    proviersMap.set(item, item);
  }
  
});

function getClassParams(target: object) {
  // console.log("1",Reflect.getMetadata(SCOPE_OPTIONS_METADATA, target))
 
  return Reflect.getMetadata("design:paramtypes", target) || [];
}

// a=>b=>c=>a
//a :  依赖: 首先要   Object.create(A.prototype) =》 deepForwark[a=>insA]
export function main() {

  //  const instanceA = Object.create(A.prototype)
  //  const instanceB = Object.create(B.prototype)
  // Object.assign(instanceA,new   A(instanceB,instanceB))
  // Object.assign(instanceB,new   B(instanceA))

  // console.log("instanceA", instanceA,'-',instanceA.b,'-',instanceA.b.b,'-',instanceA.b.a);
  // console.log("instanceB", instanceB);

  // console.log("a", getClassParams(A));

  // console.log("b", getClassParams(B));
  console.log("a-InjectKey", Reflect.getMetadata(InjectKey, A));

  console.log("b-InjectKey", Reflect.getMetadata(InjectKey, B));
 let aInjectKey = Reflect.getMetadata(InjectKey, A).forEach((item: any) => {
  let res = item
  if(typeof item==="function" && item.forwardRef){
      res = item()

    let depIns =   instancesWeakMap.get(res)
    let ins =   instancesWeakMap.get(A)
    // Object.assign(ins, Reflect.construct(A,depIns))
    // Object.assign(ins,new   A(depIns))

    // console.log("instanceA",res, ins,depIns);
    // console.log("last-ins",ins)
     
  }
  // console.log("aInjectKey-item ",res)
 });
 let bInjectKey = Reflect.getMetadata(InjectKey, B).forEach((item: any) => {
  let res = item
  if(typeof item==="function" && item.forwardRef){
      res = item()
      let depIns =   instancesWeakMap.get(res)
      let ins =   instancesWeakMap.get(B)
      Object.assign(ins,new   B(depIns))

      // Object.assign(ins, Reflect.construct(B,depIns))
      console.log("instanceB",res, ins,depIns);
  
      // console.log("instanceB", ins);
      // console.log("last-ins",ins)

  }
 
  console.log("bInjectKey-item ",res)
 });
  // let Be = Reflect.getMetadata(InjectKey, A,"0")()
  // let Ae = Reflect.getMetadata(InjectKey, B,"0")()

  //  const instanceA = Object.create(Be.prototype)
  //  const instanceB = Object.create(Ae.prototype)
  // Object.assign(instanceA,new   A(instanceB))
  // Object.assign(instanceB,new   B(instanceA))
  
  // console.log("instanceA", instanceA,'-',instanceA.b,'-',instanceA.b.b,'-',instanceA.b.a);
  // console.log("instanceB", instanceB);
  // console.log("a", getClassParams(A));

  [...proviersMap.values()].forEach((item,key) => {
    console.log("proviersMap-item",item,key)

  });
  [...instancesWeakMap.values()].forEach((item,key) => {
    console.log("instancesWeakMap-item",item,key)

  });
  
}
main();
