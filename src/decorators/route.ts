import { ControllerMap, RouteProps, SubMethods } from "../types";

function Route({ method, path, middlewares = [] }: RouteProps) {
  return (
    target: any,
    propertyKey: PropertyKey,
    descriptor: PropertyDescriptor
  ) => {
    target[SubMethods] = target[SubMethods] || (new Map() as ControllerMap);

    target[SubMethods].set({ method, path, middlewares }, descriptor.value);
  };
}

export default Route;
