import { HttpStatusCode } from '../http/httpStatusCode';

export default class BaseError extends Error {
  messages: string[];
  constructor(
    messages: string[],
    readonly statusCode: HttpStatusCode,
  ) {
    super(messages[0]);
    this.messages = messages;
  }
}
