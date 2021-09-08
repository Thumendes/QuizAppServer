export enum Methods {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
}

export type RouteProps = {
  method: Methods;
  path: string;
  middlewares?: GenericFunction[];
};

export type GenericClass = { new (...args: any[]): {} };

export type GenericFunction = (...props: any[]) => any;

export const SubMethods = Symbol("SubMethods");

export type ControllerOptions = {
  basePath?: string;
};

export type ControllerMap = Map<RouteProps, () => any>;

export type ControllerRegister = {
  name: string;
  options?: ControllerOptions;
  routes: { method: Methods; path: string }[];
};

export interface IMailSend {
  to: string;
  subject: string;
  text: string;
}

export type QuizCreatePayload = {
  name: string;
  description: string;
  questions: {
    title: string;
    options: {
      title: string;
      isCorrect: boolean;
    }[];
  }[];
};
