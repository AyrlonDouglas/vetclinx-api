export class ApiPresenter {
  status: number;
  type: string;
  path: string;
  method: string;
  message: string;
  description: string;
  timestamp: number = new Date().getTime();
  result?: ApiPresenterResult;
  error?: ApiPresenterError;
  stack?: string;

  constructor(props: ApiPresenterProps) {
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
  status: number;
  type: string;
  path: string;
  method: string;
  description: string;
  result?: ApiPresenterResult;
  error?: ApiPresenterError;
  stack?: string;
}

interface ApiPresenterResult {
  message: string;
  data: any;
}

interface ApiPresenterError {
  message: string;
  errorMessages?: string[];
}
