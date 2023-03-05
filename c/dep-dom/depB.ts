import "reflect-metadata";
import { Injectable, Inject,forwardRef } from "./common";
import { A } from "./depA";
const Fa= forwardRef(()=>A)
@Injectable()
export class B {
  a: A;
  b:string
  constructor(@Inject(forwardRef(()=>A)) a: A) {
    this.a =a
   this.b = "this.is b"
  }
  getA() {
    console.log("B-getA", this.a);
  }
}

