import { ConfirmTokenStatus, User } from ".prisma/client";
import Mail from "../lib/email";
import db from "../lib/db";
import generateCode from "./generateCode";

export async function createConfirmCode(user: User) {
  await db.confirmToken.updateMany({
    where: { userId: user.id },
    data: { status: ConfirmTokenStatus.IGNORED },
  });

  return await db.confirmToken.create({
    data: { email: user.email, userId: user.id, code: generateCode() },
  });
}
export async function sendCodeMail(email: string, code: string) {
  await Mail.send({
    to: email,
    subject: "Código de confirmação!",
    html: `Copie o seguinte código <b>${code}</b> e cole no aplicativo para confirmar seu registro!`,
  });
}
