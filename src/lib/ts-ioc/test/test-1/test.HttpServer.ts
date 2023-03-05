import {Inject,Injectable} from "../../index"
import {APP_URL} from "./test.app_url"

@Injectable()
export class HttpServer{
    constructor(
        @Inject(APP_URL) private appUrl:string
    ){
        console.log(this.appUrl,"HttpServer int----------")
    }
}
