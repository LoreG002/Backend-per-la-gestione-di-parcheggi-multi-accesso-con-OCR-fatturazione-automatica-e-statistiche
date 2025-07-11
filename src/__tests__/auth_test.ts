import request from "supertest";
import app from "../app";

describe("Test base", () => {
  it("GET / deve rispondere con 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Il progetto è pronto");
  });
});
