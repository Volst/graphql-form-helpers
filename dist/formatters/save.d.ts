export interface IValues {
  id?: string;
  [key: string]: any;
}
export declare function save(
  values?: IValues[] | IValues | null
):
  | {
      create?: any;
      update?: any;
    }
  | undefined;
