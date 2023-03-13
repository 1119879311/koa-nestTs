
// import {Container,forwardRef, Module} from "../../src"
import {Container,forwardRef, Module} from "ioc-typescript"
import {A} from "./depA"
import {B} from "./depB"


@Module({
    providers:[forwardRef(()=>A),forwardRef(()=>B)],
    imports:[]
})
class M{}


const containerIns = new Container(M)

let ins = containerIns.getInstances()
ins.forEach((val,key)=>{
    /** log 输出：
      get-ins [class M] M {}
      get-ins [class A] <ref *1> A { b: B { a: [Circular *1] } }
      get-ins [class B] <ref *1> B { a: A { b: [Circular *1] } }
     */
    console.log("get-ins",key,val) ; 
})


/** log 输出:
*  class B methond getA
*  class A methond getA
*/
const insA:A = ins.get(A)
insA.getA() ; 



/** log 输出:
 * class A methond getB
 * class B methond getB
 */
const insB:B = ins.get(B)
insB.getB() ; 



