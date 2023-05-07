import {Inject,forwardRef,ContainerBase,Container,Module} from "../../src"
import "reflect-metadata";
import { B, H } from "./depB";
import { A,G} from "./depA";



@Module({
    providers: [
        forwardRef(()=>B),
        forwardRef(()=>A),
        {provide:G,useClass:G},
        {provide:"GGG",useClass:G},
        {provide:"OOO",useClass: forwardRef(()=>A),},
        {provide:H,useClass:forwardRef(()=>H)},
        // {provide:H,useClass:A},
    
    
         H,
         H,
        {provide:"useValue",useValue:"this is useValue"},
        {provide:"useFactory",useFactory:()=>"this is useFactory"},
        {provide:"config",useValue:()=>"this is config"}
    ],
    controllers: [],
  })
  class userApp {
    constructor() {
      console.log("userApp init....");
    }
  }






function test1(){

    let container = new ContainerBase()
    container.addProviders<any>([
    forwardRef(()=>B),
    forwardRef(()=>A),
    {provide:G,useClass:G},
    {provide:"GGG",useClass:G},
    {provide:"OOO",useClass: forwardRef(()=>A),},
    {provide:H,useClass:forwardRef(()=>H)},
    // {provide:H,useClass:A},


     H,
     H,
    {provide:"useValue",useValue:"this is useValue"},
    {provide:"useFactory",useFactory:()=>"this is useFactory"},
    {provide:"config",useValue:()=>"this is config"},

    ])
    container.initLoading()
    let ins = container.getInstances()
    ins.forEach((val,key)=>{
    
        console.log("get-ins",key,val)
    })
    
    const gg:G = container.get("GGG")
    
    console.log("ggg",gg.getA());
    console.log("H",container.get(H));

}


function test2(){
    
    const container = new Container();
    container.init(userApp);
    // console.log("userApp:",container.get(userApp))
    container.initLoading()
    let ins = container.getInstances()

    ins.forEach((val,key)=>{
        console.log("get-ins","key:---:",key,"----val---:",val)
    })
}
test2()


