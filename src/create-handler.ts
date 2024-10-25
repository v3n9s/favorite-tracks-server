import type { Request, Response } from "express";
import type { z } from "zod";

// generic type prevents type inference by accepting function
export type ExpressRequestHandlerNoInfer = <
  _, // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/no-unused-vars
>(
  req: Request,
  res: Response,
) => void;

export type Handler<T extends object = object> = (
  args: {
    req: Request;
    res: Response;
  } & T,
) => Promise<void> | void;

export type RequestData<Params, Query, Body> = {
  params: Params;
  query: Query;
  body: Body;
};

export type CreateHandlerFn = <
  Params extends z.ZodType<unknown>,
  Query extends z.ZodType<unknown>,
  Body extends z.ZodType<unknown>,
>(arg: {
  schema: Partial<RequestData<Params, Query, Body>>;
  handler: Handler<{
    data: RequestData<z.output<Params>, z.output<Query>, z.output<Body>>;
  }>;
  errorHandler?: Handler<{
    errors: RequestData<
      z.ZodError<unknown> | undefined,
      z.ZodError<unknown> | undefined,
      z.ZodError<unknown> | undefined
    >;
  }>;
}) => ExpressRequestHandlerNoInfer;

export const createHandler: CreateHandlerFn = ({
  schema,
  handler,
  errorHandler,
}) => {
  return (req, res) => {
    const successParseResult: z.SafeParseSuccess<object> = {
      success: true,
      data: {},
    };
    const paramsParseResult = schema.params
      ? schema.params.safeParse(req.params)
      : successParseResult;
    const queryParseResult = schema.query
      ? schema.query.safeParse(req.query)
      : successParseResult;
    const bodyParseResult = schema.body
      ? schema.body.safeParse(req.body)
      : successParseResult;

    if (
      paramsParseResult.success &&
      queryParseResult.success &&
      bodyParseResult.success
    ) {
      handler({
        req,
        res,
        data: {
          params: paramsParseResult.data,
          query: queryParseResult.data,
          body: bodyParseResult.data,
        },
      })?.catch(() => {
        res.status(500).end();
      });
    } else if (errorHandler) {
      errorHandler({
        req,
        res,
        errors: {
          params: paramsParseResult.error,
          query: queryParseResult.error,
          body: bodyParseResult.error,
        },
      })?.catch(() => {
        res.status(500).end();
      });
    } else {
      res.status(400).end();
    }
  };
};
