import { validateTransitDates } from "../middlewares/validateTransitDates.middleware";
import httpMocks from "node-mocks-http";

describe("validateTransitDates middleware", () => {
  it("should call next() when dates are valid", () => {
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

  it("should return 400 if date format is invalid", () => {
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

  it("should return 400 if uscita is before ingresso", () => {
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
