import { Injectable ,Inject,forwardRef} from "ioc-typescript";

import { A } from "./depA";


@Injectable()
export class B {
  constructor(@Inject(forwardRef(()=>A)) private a:A){}
  getA() {
    console.log("class B methond getA");
  }
  getB() {
    this.a.getB()
    console.log("class B methond getB");
  }
}
