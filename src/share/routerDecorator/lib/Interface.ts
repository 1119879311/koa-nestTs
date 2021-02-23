export type IMethondType = "get" | "post" | "delete" | "put" | "all"
export type IRouterType = {
    path: string, // "/"
    methond: string|IMethondType //"GET"
    // midwares: Function[],
}
//一个方法对应一个路由信息
export type IKeyMapRouters = {
    [methondName: string]: IRouterType
}

export type IControllerMetate = {
    prefix: string | undefined,
    routers: IKeyMapRouters,
    // midwares: Function[],
}