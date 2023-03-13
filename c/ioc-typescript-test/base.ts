
import {ContainerBase,Injectable} from "ioc-typescript"
// import {ContainerBase,Injectable} from "ioc-typescript"


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

const containerIns = new ContainerBase()
containerIns.addProviders<any>([A,B]).initLoading()

let ins = containerIns.getInstances()
ins.forEach((val,key)=>{
    console.log("get-ins",key,val) ; // log 输出： get-ins [class A] A {}, get-ins [class B] B { a: A {} }
})
const insB:B = ins.get(B)
insB.getB() ; // log 输出:class A method getA,  class B method getB




