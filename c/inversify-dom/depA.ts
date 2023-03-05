import "reflect-metadata";
import 'reflect-metadata'
import { inject, injectable, Container } from 'inversify'

import { B } from "./depB";

@injectable()
export class A {
  b:B
  constructor(
    @inject('b') b: B,) {
    this.b = b
  }
  getName() {
    return 'a'
  }
}