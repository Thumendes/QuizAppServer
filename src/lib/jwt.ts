import jsonwebtoken from "jsonwebtoken";

class Jwt {
  private secretKey = "LETICIA_DULCE_JULIA_DORIVAL_LINDOS";

  public verify<T>(token: string) {
    try {
      const payload = jsonwebtoken.verify(
        token,
        this.secretKey
      ) as unknown as T;

      return payload;
    } catch (error) {
      return null;
    }
  }

  public sign(payload: any) {
    const token = jsonwebtoken.sign(payload, this.secretKey);

    return token;
  }
}

const jwt = new Jwt();

export default jwt;
