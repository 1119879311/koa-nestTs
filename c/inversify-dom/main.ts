import "reflect-metadata";
import { B } from "./depB";
import { A } from "./depA";
import { inject, injectable, Container } from 'inversify'

const container = new Container()

container.bind('a').to(A)
container.bind('b').to(B)
console.log("container.get('a')",container.get('a'))
console.log("container.get('b')",container.get('b'))