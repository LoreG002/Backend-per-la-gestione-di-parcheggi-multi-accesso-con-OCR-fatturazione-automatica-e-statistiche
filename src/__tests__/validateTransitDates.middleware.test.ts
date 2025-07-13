import { validateTransitDates } from "../middlewares/validateTransitDates.middleware";
import httpMocks from "node-mocks-http";

describe("validateTransitDates middleware", () => {
  it("dovrebbe chiamare next() quando le date sono valide", () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        data_ingresso: "2023-01-01T10:00:00Z",
        data_uscita: "2023-01-01T12:00:00Z",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateTransitDates(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res._isEndCalled()).toBe(false); // la risposta non è stata inviata
  });

  it("dovrebbe restituire 400 se il formato della data non è valido", () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        data_ingresso: "invalid-date",
        data_uscita: "2023-01-01T12:00:00Z",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateTransitDates(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Formato data non valido." });
    expect(next).not.toHaveBeenCalled();
  });

  it("dovrebbe restituire 400 se uscita è prima di ingresso", () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        data_ingresso: "2023-01-01T12:00:00Z",
        data_uscita: "2023-01-01T10:00:00Z",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateTransitDates(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "La data di uscita non può essere precedente a quella di ingresso.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
