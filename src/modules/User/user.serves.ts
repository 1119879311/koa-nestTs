import { Injectable } from "../../share/Ioc";

@Injectable()
export class UserServer{

    find(){
        return "this is userserver"
    }

}