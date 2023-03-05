import "reflect-metadata";
import { Injectable ,Inject,forwardRef} from "./common";

import { B } from "./depB";
const Fb = forwardRef(()=>B)
export class G{}
console.log("Fb",Fb)
@Injectable()
export class A {
  b: B;
  a:string
  constructor(@Inject(forwardRef(()=>B)) b: B,@Inject(G) c:any) {
    this.b = b;
    this.a = "this.is a"
  }

  getB() {
    console.log("A-getB", this.b);
  }
}

