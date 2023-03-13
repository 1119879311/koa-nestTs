import {Inject,InjectToken,Injectable,forwardRef,Container,Module} from "ioc-typescript"
// import {Inject,InjectToken,Injectable,forwardRef,Container,Module} from "ioc-typescript"


 const APP_URL = new InjectToken("APP_URL")

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

@Injectable()
export class C{
    constructor(
        @Inject(APP_URL) private appUrl:string
    ){
        console.log(this.appUrl,"C int----------")
    }
}


@Module({
    providers: [
        A,
        {provide:B,useClass:B},
        {provide:C,useClass:forwardRef(()=>C)},
        {
        provide: APP_URL,
            useFactory: () => "http://www.baidu.com",
        },
        {provide:"useValue",useValue:"this is useValue"},
        {provide:"useFactory",useFactory:()=>"this is useFactory"},
        {provide:"config",useValue:()=>({  id:12 })}
    ],
    controllers: [],
  })
  class userApp {
    constructor() {
      console.log("userApp init....");
    }
  }



  const containerIns = new Container(userApp);
  let ins = containerIns.getInstances()

  ins.forEach((val,key)=>{
     /**
      * log 输出：
      * userApp init....
        http://www.baidu.com C int----------
        get-ins key:---: [class userApp] ----val---: userApp {}
        get-ins key:---: [class A] ----val---: A {}
        get-ins key:---: [class B] ----val---: B { a: A {} }
        get-ins key:---: InjectToken { injectIdefer: 'APP_URL' } ----val---: http://www.baidu.com
        get-ins key:---: useValue ----val---: this is useValue
        get-ins key:---: useFactory ----val---: this is useFactory
        get-ins key:---: config ----val---: [Function: useValue]
        get-ins key:---: [class C] ----val---: C { appUrl: 'http://www.baidu.com' }
      */
      console.log("get-ins","key:---:",key,"----val---:",val)
  })

