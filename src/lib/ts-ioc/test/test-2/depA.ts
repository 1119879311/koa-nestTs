import "reflect-metadata";
import { Injectable ,Inject,forwardRef} from "../../index";

import { B } from "./depB";
const Fb = forwardRef(()=>B)
@Injectable()
export class G{
  getA(){
    return "SDFSDFD"
  }
}

@Injectable()
export class A {
  b: B;
  a:string
  gg:G
  constructor(@Inject(forwardRef(()=>B)) b: B,@Inject(G) c:G,@Inject("GGG") gg:G) {
    this.b = b;
    this.a = "this.is a"
    this.gg = gg
  }

  getB() {
    console.log("A-getB", this.b);
  }
}

