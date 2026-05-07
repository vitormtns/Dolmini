import { ZodError } from "zod";

export class CommerceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status = 400
  ) {
    super(message);
    this.name = "CommerceError";
  }
}

export function toApiError(error: unknown) {
  if (error instanceof CommerceError) {
    return {
      status: error.status,
      body: {
        success: false,
        data: null,
        error: error.message,
        code: error.code
      }
    };
  }

  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        success: false,
        data: null,
        error: "Dados inválidos.",
        code: "validation_error",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      }
    };
  }

  console.error(error);

  return {
    status: 500,
    body: {
      success: false,
      data: null,
      error: "Não foi possível concluir a operação.",
      code: "internal_error"
    }
  };
}

export function apiSuccess<T>(data: T) {
  return {
    success: true,
    data,
    error: null,
    code: null
  };
}
