export class ApiError extends Error {

  // Proprietà per memorizzare lo status HTTP dell'errore
  public status: number;

  // Costruttore che riceve lo status e il messaggio di errore
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    // Corregge la catena del prototipo per garantire che instanceof funzioni correttamente
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
