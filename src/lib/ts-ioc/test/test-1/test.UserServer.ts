import { HttpServer } from './test.HttpServer';
import {Inject,Injectable} from "../../index"
import {APP_URL} from "./test.app_url"

@Injectable()
export class UserServer{
    constructor(
        private httpServer:HttpServer,
        @Inject(APP_URL) private appUrl:string
    ){}

    public getUrl(){
        console.log(this.httpServer)
        console.log(this.appUrl)
        return this.appUrl;
    }
}