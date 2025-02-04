export class ApiPresenter<T = unknown> {
  message: string;
  status?: number;
  type?: string;
  path?: string;
  method?: string;
  description?: string;
  readonly timestamp: number = new Date().getTime();
  result?: T;
  error?: ApiPresenterError;
  readonly stack?: string;

  constructor(props: ApiPresenterProps) {
    this.message = props.message;
    this.status = props.status;
    this.type = props.type;
    this.path = props.path;
    this.method = props.method;
    this.description = props.description;
    this.result = props.result;
    this.error = props.error;
    this.stack = props.stack;
  }
}

interface ApiPresenterProps {
  message: string;
  status?: number;
  type?: string;
  path?: string;
  method?: string;
  description?: string;
  result?: any;
  error?: ApiPresenterError;
  stack?: string;
}

interface ApiPresenterError {
  errorMessages?: string[];
}
