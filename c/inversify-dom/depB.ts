import "reflect-metadata";

import { inject, injectable, Container } from 'inversify'
import { A } from "./depA";

@injectable()
export class B {
  a:A
  constructor(
    @inject('a') a: A) {
    this.a = a
  }
  getName() {
    return 'B'
  }
}