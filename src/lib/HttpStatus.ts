export const HttpStatusCode = {
  OK: {
    code: "OK",
    status: 200,
  },
  CREATED: {
    code: "Created",
    status: 201,
  },
  VALIDATION_ERROR: {
    code: "ValidationError",
    status: 400,
  },
  UNAUTHORIZED: {
    code: "UnauthorizedError",
    status: 401,
  },
  NOT_FOUND_ERROR: {
    code: "NotFoundError",
    status: 404,
  },
  SERVER_ERROR: {
    code: "InternalServerError",
    status: 500,
  },
};
