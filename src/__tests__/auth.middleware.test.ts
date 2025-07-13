import { hashPassword, verifyPassword, generateToken, verifyToken } from "../helpers/auth.helper";

describe("auth.helper.ts - unit tests con ruoli reali", () => {
  const plainPassword = "mypassword123";

  it("dovrebbe eseguire l'hash corretto di una password", async () => {
    const hash = await hashPassword(plainPassword);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(plainPassword);
  });

  it("dovrebbe verificare una password corretta", async () => {
    const hash = await hashPassword(plainPassword);
    const result = await verifyPassword(plainPassword, hash);
    expect(result).toBe(true);
  });

  it("dovrebbe generare un token JWT valido con ruolo 'operatore' ", () => {
    const token = generateToken({ id: 42, role: "operatore" });
    expect(typeof token).toBe("string");
  });

  it("dovrebbe verificare un token JWT valido con ruolo 'utente'", () => {
    const payload = { id: 42, role: "utente" };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.role).toBe(payload.role);
  });

  it("dovrebbe generare un errore per token JWT non valido", () => {
    const invalidToken = "this.is.not.valid";
    expect(() => verifyToken(invalidToken)).toThrow();
  });
});
