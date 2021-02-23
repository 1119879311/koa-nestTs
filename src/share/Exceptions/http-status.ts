/*
http:状态码

*/ 

export enum  HttpStatus {

    // 1xx
    CONTINUE = 100, //继续
    SWITCHING_PROTOCOLS=101,//更换协议
    // 2xxx
    OK=200, //成功
    CREATED=201,// （创建完成）
    NON_AUTHORITATIVE_INFORMATION=203,//不允许的信息
    NO_CONTENT=204,// （无返回内容）


    // 3xx
    MOVED_PERMANENTLY=301,//资源url永久移到其他服务重定向
    FOUND = 302, //找到临时资源url重定向
    NOT_MODIFIED = 304, //未修改

    // 4xx
    BAD_REQUEST = 400,//错误请求
    UNAUTHORIZED = 401, //未认证，未授权访问
    PAYMENT_REQUIRED = 402, //请投币
    FORBIDDEN = 403, //禁止访问
    NOT_FOUND = 404,//丢失，没有找到资源
    METHOD_NOT_ALLOWED=405,//禁止的请求方法
    NOT_ACCEPTABLE=406,//不接受你的请求，不可接受
    REQUEST_TIMEOUT=407,//请求超时

    // 5xx

    INTERNAL_SERVER_ERROR = 500,//服务器内部错误
    NOT_IMPLEMENTED = 501,//无法识别用户的请求方式
    BAD_GATEWAY = 502,  //网关错误
    SERVICE_UNAVAILABLE = 503, //服务暂不可用
    GATEWAY_TIMEOUT = 504, //网关超时
    HTTP_VERSION_NOT_SUPPORTED = 505, //HTTP版本未支持
    

}