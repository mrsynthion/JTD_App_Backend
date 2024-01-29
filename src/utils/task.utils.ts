import { ErrorCode } from "../types/error.types";

function validateTitle(title: string): void {
  if (!title) throw new Error(ErrorCode.TTIR);
  if (title && title.length < 5) throw new Error(ErrorCode.TTMBMFC);
}

export { validateTitle };
