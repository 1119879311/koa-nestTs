import "reflect-metadata";
import { Injectable, Inject,forwardRef } from "../../src";
import { A } from "./depA";
@Injectable()
export class H{}

@Injectable()
export class B {
  a: A;
  b:string
  f:string
  h:H
  constructor(@Inject(forwardRef(()=>A)) a: A,h:H,@Inject("useFactory") f:string) {
    this.a =a
    console.log("A.a",Object.keys(this.a))
    this.b = "this.is b"
    this.f =f
    this.h = h;
  }
  getA() {
    console.log("B-getA", this.a);
  }
}

