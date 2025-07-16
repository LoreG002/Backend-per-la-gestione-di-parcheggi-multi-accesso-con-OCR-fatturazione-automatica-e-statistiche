import { validateDates } from "../middlewares/validateDates.middleware";
import httpMocks from "node-mocks-http";

describe("validateDates middleware (data_ingresso/data_uscita nel body)", () => {
  const middleware = validateDates({ fields: ["data_ingresso", "data_uscita"], source: "body" });

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

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res._isEndCalled()).toBe(false);
  });

  it("dovrebbe chiamare next con ApiError se il formato della data non è valido", () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        data_ingresso: "invalid-date",
        data_uscita: "2023-01-01T12:00:00Z",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: "La data 'data_ingresso' non è valida.",
      })
    );
  });

  it("dovrebbe chiamare next con ApiError se la data di uscita è precedente a quella di ingresso", () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        data_ingresso: "2023-01-01T12:00:00Z",
        data_uscita: "2023-01-01T10:00:00Z",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: "La data 'data_ingresso' non può essere successiva a 'data_uscita'.",
      })
    );
  });
});
