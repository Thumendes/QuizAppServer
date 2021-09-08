import server from "../lib/server";
import { ControllerOptions, GenericClass, SubMethods } from "../types";

function Controller(name: string, options?: ControllerOptions) {
  return <T extends GenericClass>(Base: T) => {
    return class extends Base {
      constructor(...args: any[]) {
        super(...args);

        const subMethods = Base.prototype[SubMethods];

        server.controller(name, subMethods, options);
      }
    };
  };
}

export default Controller;
