import { HttpExceptions } from "../Exceptions/http.exceptions";
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
    "data" | "status" | "code" | "message" | "timestamp" | "path",
    any
  > = {
    data: null,
    status: false,
    code: 500,
    message: null,
    timestamp: new Date(),
    path: ctx.url,
  };

  if (error instanceof HttpExceptions) {
    ctx.status = error.getStatus();
    body.code = error.getStatus();
    body.message = error.message;
  } else {
    ctx.status = 500;
    body.message = error.message ? error.message : error;
  }
  ctx.body = await body;
};
