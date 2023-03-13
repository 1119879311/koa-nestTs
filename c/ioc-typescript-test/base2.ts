
import {Container,Injectable, Module} from "ioc-typescript"
// import {Container,Injectable, Module} from "ioc-typescript"


// 基本使用

@Injectable()
class A{
    
    getA(){
       
        console.log("class A method getA")
    }
}


@Injectable()
class B{
    constructor(private a:A){}
    getB(){
        this.a.getA()
        console.log("class B method getB")
    }
}

@Module({
    providers:[A],
    controllers:[], // 这个特殊是providers 
    imports:[]
})
class Ma{}


@Module({
    providers:[B],
    imports:[Ma]
})
class Mb{}

const containerIns = new Container(Mb)

let ins = containerIns.getInstances()
ins.forEach((val,key)=>{
    /** log 输出：
     *  get-ins [class Mb] Mb {}
        get-ins [class B] B { a: A {} }
        get-ins [class Ma] Ma {}
        get-ins [class A] A {}
     */
    console.log("get-ins",key,val) ; 
})
const insB:B = ins.get(B)
/** log 输出:
 *  class A method getA
 *  class B method getB
 */
insB.getB() ; 




