export declare type ActionFn = ((value: any) => any);
export interface Scheme {
  [x: string]: ActionFn | Scheme;
}
export declare function parseFormToMutation(
  values: object,
  scheme: Scheme
): object;
export declare function invariant(condition: boolean, message?: string): void;
