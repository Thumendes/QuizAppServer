import express, { Application, Request, Response, Router } from "express";
import cors from "cors";
import morgan from "morgan";
import { ControllerMap, ControllerOptions, ControllerRegister } from "../types";

class Server {
  public app!: Application;
  public controllers: ControllerRegister[] = [];

  constructor(public port = 4000) {
    this.app = express();

    this.middlewares();
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`🔥🚀 Running in ${this.port}!`);
    });
  }

  public processHandler(handler: (req: Request, res: Response) => any) {
    return async (req: Request, res: Response) => {
      try {
        const response = await handler(req, res);

        return res.json(response);
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({
            success: false,
            msg: error.message || "Houve erro interno!",
          });
        }
      }
    };
  }

  public controller(
    name: string,
    config: ControllerMap,
    options?: ControllerOptions
  ) {
    const router = options && options.basePath ? Router() : this.app;
    const newRegister: ControllerRegister = {
      name,
      options,
      routes: [],
    };

    config.forEach((handler, { method, path, middlewares = [] }) => {
      newRegister.routes.push({ method, path });
      router[method](path, ...middlewares, this.processHandler(handler));
    });

    this.controllers.push(newRegister);
    options && options.basePath && this.app.use(options.basePath, router);
  }

  public middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }
}

const server = new Server();

export default server;
