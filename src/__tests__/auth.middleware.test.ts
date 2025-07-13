import { hashPassword, verifyPassword, generateToken, verifyToken } from "../helpers/auth.helper";

describe("auth.helper.ts - unit tests con ruoli reali", () => {
  const plainPassword = "mypassword123";

  it("should hash a password correctly", async () => {
    const hash = await hashPassword(plainPassword);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(plainPassword);
  });

  it("should verify a correct password", async () => {
    const hash = await hashPassword(plainPassword);
    const result = await verifyPassword(plainPassword, hash);
    expect(result).toBe(true);
  });

  it("should generate a valid JWT token with role 'operatore'", () => {
    const token = generateToken({ id: 42, role: "operatore" });
    expect(typeof token).toBe("string");
  });

  it("should verify a valid JWT token with role 'utente'", () => {
    const payload = { id: 42, role: "utente" };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.role).toBe(payload.role);
  });

  it("should throw an error for invalid JWT token", () => {
    const invalidToken = "this.is.not.valid";
    expect(() => verifyToken(invalidToken)).toThrow();
  });
});
