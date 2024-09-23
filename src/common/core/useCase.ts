export interface UseCase<Input, Output> {
  perform(input?: Input): Promise<Output> | Output;
}
