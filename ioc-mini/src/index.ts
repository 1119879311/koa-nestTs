import {Container,Inject,Injectable} from "./core"

@Injectable()
class A{
    constructor(@Inject("api") private api:string,/** b:number **/){
        console.log("----实例化A:")
        console.log("a-api",this.api)
     }
}

@Injectable()
class B{
     constructor( @Inject("AA") private a:A, @Inject("api") private api:string){
        console.log("----实例化B:")
        console.log("B:insA",this.a)
        console.log("B:api",this.api)

     }
}
@Injectable()
class C{
     constructor(private b:B,@Inject("api") private api:string){
        console.log("----实例化C:")
        console.log("C:insB",this.b)
        console.log("C:api",this.api)
     }
}

let contaner = new Container(
    [
        C,B,
        {provide:"AA",useClass:A},
        {provide:"api",useValue:123}
    ])

contaner.add({provide:'a',useValue:"12345"}).loading()
/**
 * log: 
 *  ----实例化A:
    a-api 123
    ----实例化B:
    B:insA A { api: 123 }
    B:api 123
    ----实例化C:
    C:insB B { a: A { api: 123 }, api: 123 }
    C:api 123
    contaner: Container {
    instanceMap: Map(5) {
        'api' => 123,
        'AA' => A { api: 123 },
        [class B] => B { a: [A], api: 123 },
        [class C] => C { b: [B], api: 123 },
        'a' => '12345'
    },
    providerMap: Map(0) {}
    }
 */
console.log("contaner:",contaner)
console.log("A",contaner.get('AA'))
console.log("B",contaner.get(B))
