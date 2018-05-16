export interface IValues {
  id?: string;
  [key: string]: any;
}
export declare function update(
  values?: IValues[] | IValues | null
):
  | {
      create?: any;
      update?: any;
    }
  | undefined;
