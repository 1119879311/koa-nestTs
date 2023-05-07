import { Injectable } from '@by/ioc';

@Injectable()
export class SqlServer {
  constructor() {}
  find() {
    console.log('this is SqlServer');
    return 'this is SqlServer';
  }
}
