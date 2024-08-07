import { expressjwt, GetVerificationKey } from "express-jwt";
import { Request } from "express";
import jwksClient from "jwks-rsa";
import { Config } from "../config";
import { AuthCookie } from "../types";

export default expressjwt({
  secret: jwksClient.expressJwtSecret({
    jwksUri: Config.JWKS_URI!,
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,
  algorithms: ["RS256"],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;

    // Bearer eyjllsdjfljlasdjfljlsadjfljlsdf
    if (authHeader && authHeader.split(" ")[1] !== "undefined") {
      const token = authHeader.split(" ")[1];
      if (token) {
        return token;
      }
    }

    const { accessToken } = req.cookies as AuthCookie;
    return accessToken;
  },
});

// accessToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzIyOTM5MjE5LCJleHAiOjE3MjI5NDI4MTksImlzcyI6ImF1dGgtc2VydmljZSJ9.uFhvSD0cY0444TbxCkBKHHcDZtzfzQFkuI5fQ_0rRRLhG_EQTe2B4Q_fh1MUAfjHJEmfrvbppLEqp9DMPl2gqmSNZ6k0sh-e0l19tuUXLr6uSoRFLZKnubodn7YV5bxLQCv5j_ipmmIwpAndrIcC-hnT55Y_xxAFYR_wJqFqLopfUc7adR3Qz3KWzhlIYzagfP2BC_vOkpcEqr28RFZbHY7Q1OaqbyXwtvO66RpuOf7l2Eam2qdvxsaivROzgb_wZzaFsxd0k_gKHMQpKfVygCIaldjWHcV1QPzaI549fJh-8fPqk-TrivVbQWKItsTIWITiIaifWmaYMakvuiMHPg; Max-Age=3600; Domain=localhost; Path=/; Expires=Tue, 06 Aug 2024 11:13:39 GMT; HttpOnly; SameSite=Strict
