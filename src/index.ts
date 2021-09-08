import QuizesController from "./controllers/QuizesController";
import UsersController from "./controllers/UsersController";
import server from "./lib/server";

async function main() {
  new UsersController();
  new QuizesController();

  server.start();
}

main().catch(console.error);
