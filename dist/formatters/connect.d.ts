export declare function connect(
  ids?: string | string[] | null
):
  | {
      connect: {
        id: string;
      }[];
    }
  | {
      connect: {
        id: string;
      };
    }
  | undefined;
