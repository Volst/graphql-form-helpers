declare module 'deepmerge' {
  interface Options {
    clone?: boolean;
    arrayMerge?(destination: any[], source: any[], options?: Options): any[];
    isMergeableObject?(value: object): boolean;
  }
  function deepmerge<T>(x: Partial<T>, y: Partial<T>, options?: Options): T;
  function deepmerge<T1, T2>(x: T1, y: T2, options?: Options): T1 & T2;
  export default deepmerge;
  export function all<T>(objects: Array<Partial<T>>, options?: Options): T;
}
