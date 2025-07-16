import { Request, Response, NextFunction } from "express";
import { ApiError } from "../helpers/ApiError";

type Source = "body" | "query" | "params";

interface DateValidationOptions {
  fields: [string, string];        // es: ["start", "end"]
  source?: Source;                 // default: "body"
  checkOrder?: boolean;           // default: true
}

export function validateDates(options: DateValidationOptions) {
  const { fields, source = "body", checkOrder = true } = options;

  return (req: Request, _res: Response, next: NextFunction): void => {
    const [startKey, endKey] = fields;
    const data = req[source];

    const startValue = data?.[startKey];
    const endValue = data?.[endKey];

    if (!startValue && !endValue) return next(); // niente da validare

    const start = new Date(startValue);
    const end = new Date(endValue);

    if (startValue && isNaN(start.getTime())) {
      return next(new ApiError(400, `La data '${startKey}' non è valida.`));
    }

    if (endValue && isNaN(end.getTime())) {
      return next(new ApiError(400, `La data '${endKey}' non è valida.`));
    }

    if (checkOrder && startValue && endValue && start > end) {
      return next(new ApiError(400, `La data '${startKey}' non può essere successiva a '${endKey}'.`));
    }

    next();
  };
}
