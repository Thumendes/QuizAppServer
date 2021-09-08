import { Request } from "express";
import { ConfirmTokenStatus, UserStatus } from ".prisma/client";
import { Controller, Route } from "../lib";
import { Methods } from "../types";
import { createConfirmCode, sendCodeMail } from "../utils/users";
import db from "../lib/db";
import jwt from "../lib/jwt";

@Controller("users", { basePath: "/users" })
class UsersController {
  @Route({ method: Methods.POST, path: "/sign-up" })
  public async signUp({ body }: Request) {
    // {
    //   email: string,
    //   name: string,
    //   password: string,
    //   username: string
    // }
    try {
      const user = await db.user.findFirst({ where: { email: body.email } });

      // Se o usuário já existir
      if (user) {
        // E já tiver confirmado inscrição, deve retornar usuário já cadastrado!
        if (user.status === UserStatus.CONFIRMED)
          return { success: false, msg: "Usuário já cadastrado!" };

        // Caso contrário, reenvia o código
        const confirmToken = await createConfirmCode(user);
        await sendCodeMail(user.email, confirmToken.code);

        return {
          success: true,
          msg: "Reenviamos o seu código!",
          userId: user.id,
        };
      }

      // Cria o usuário
      const newUser = await db.user.create({ data: body });

      // Enviar o código via email
      const confirmToken = await createConfirmCode(newUser);
      await sendCodeMail(newUser.email, confirmToken.code);

      return {
        success: true,
        msg: "Cadastro com sucesso! Confirme seu email para prosseguir!",
        userId: newUser.id,
      };
    } catch (error) {
      console.log(error);
      return { success: false, msg: "Houve um erro!" };
    }
  }

  @Route({ method: Methods.GET, path: "/confirm/:code" })
  public async confirm({ params, query }: Request) {
    const confirmToken = await db.confirmToken.findFirst({
      where: { code: params.code, userId: String(query.userId) },
    });

    if (!confirmToken)
      return { success: false, msg: "Não existe confirmToken!" };

    if (confirmToken.status !== ConfirmTokenStatus.PENDING)
      return { success: false, msg: "Link não tem mais validade!" };

    await db.confirmToken.update({
      where: { id: confirmToken.id },
      data: { status: ConfirmTokenStatus.CONFIRMED },
    });

    await db.user.update({
      where: { id: confirmToken.userId },
      data: { status: UserStatus.CONFIRMED },
    });

    return { success: true, msg: "Usuário confirmado com sucesso!" };
  }

  @Route({ method: Methods.POST, path: "/sign-in" })
  public async signIn({ body }: Request) {
    // {
    //   user: string,
    //   password: string,
    // }

    const user = await db.user.findFirst({
      where: { OR: [{ username: body.user }, { email: body.user }] },
    });

    if (!user) return { success: false, msg: "Usuário não encontrado!" };

    if (user.password !== body.password)
      return { success: false, msg: "Senha incorreta!" };

    const token = jwt.sign({ id: user.id });

    await db.user.update({
      where: { id: user.id },
      data: { authToken: token },
    });

    return { success: true, msg: "Usuário logado!", token };
  }

  @Route({ method: Methods.GET, path: "/sign-out/:id" })
  public async signOut({ params }: Request) {
    await db.user.update({
      where: { id: params.id },
      data: { authToken: null },
    });

    return { success: true, msg: "Deslogado com sucesso!" };
  }

  @Route({ method: Methods.POST, path: "/get-user-by-token" })
  public async getUserByToken({ body }: Request) {
    const user = await db.user.findFirst({
      where: { authToken: body.token },
    });

    return user;
  }
}

export default UsersController;
