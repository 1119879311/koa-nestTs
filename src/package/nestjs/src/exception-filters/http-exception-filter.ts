import { HttpExceptions } from "./http-exceptions";
import { Logger } from "../Logger";
import Koa from "koa";
export type IExceptionsFilter = (
  ctx: Koa.DefaultContext,
  error: Error | HttpExceptions
) => void | any | Promise<any>;
export const HttpExceptionFilter: IExceptionsFilter = async (
  ctx: Koa.DefaultContext,
  error: Error | HttpExceptions
) => {
  const logStr = `${error.stack}`;
  Logger.error(logStr);
  let body: Record<
    "success" | "code" | "message" | "timestamp" | "url" | "requestId",
    any
  > = {
    success: false,
    code: 500,
    message: "Server Exception",
    timestamp: new Date(),
    url: ctx.url,
    requestId:ctx.requestId
  };

  if (error instanceof HttpExceptions) {
    body.code = error.getStatus();
    body.message = error.message;
  } else {
    ctx.code = 500;
    body.message = error.message ? error.message : error;
  }
  ctx.body = await body;
};
