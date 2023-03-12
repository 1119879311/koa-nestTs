import { Injectable } from "ioc-typescript";

@Injectable()
export class UserServer{

    find(){
        return "this is userserver"
    }

}