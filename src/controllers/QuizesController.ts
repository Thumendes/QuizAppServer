import { Request } from "express";
import { Controller, Route } from "../lib";
import db from "../lib/db";
import { Methods, QuizCreatePayload } from "../types";

@Controller("quizes", { basePath: "/quizes" })
class QuizesController {
  @Route({ method: Methods.POST, path: "/" })
  public async create({ body }: Request<{}, {}, QuizCreatePayload>) {
    console.log(body);
    const newQuiz = await db.quiz.create({
      data: {
        name: body.name,
        description: body.description,
      },
    });

    for (const question of body.questions) {
      const newQuestion = await db.question.create({
        data: {
          title: question.title,
          quizId: newQuiz.id,
        },
      });

      for (const option of question.options) {
        await db.questionOption.create({
          data: {
            title: option.title,
            isCorrect: option.isCorrect,
            questionId: newQuestion.id,
          },
        });
      }
    }

    return { success: true, msg: "Novo quiz criado!" };
  }

  @Route({ method: Methods.GET, path: "/" })
  public async index() {
    const quizes = await db.quiz.findMany({
      include: { questions: { include: { options: true } } },
    });

    return quizes;
  }

  @Route({ method: Methods.GET, path: "/:id" })
  public async show({ params }: Request) {
    const quiz = await db.quiz.findFirst({
      where: { id: params.id },
      include: { questions: { include: { options: true } } },
    });

    return quiz;
  }
}

export default QuizesController;
