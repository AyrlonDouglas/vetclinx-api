export interface UseCase<Request, Response> {
  perform(request?: Request): Promise<Response> | Response;
}
