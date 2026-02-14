// Client errors
const BAD_REQUEST_ERROR_CODE = 400; // Invalid request / validation error
const UNAUTHORIZED_ERROR_CODE = 401; // Auth required / invalid credentials
const FORBIDDEN_ERROR_CODE = 403; // User not allowed to perform action
const NOT_FOUND_ERROR_CODE = 404; // Resource not found
const CONFLICT_ERROR_CODE = 409; // Duplicate resource (e.g., email)

// Server errors
const INTERNAL_SERVER_ERROR_CODE = 500; // Unexpected server error

module.exports = {
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
};
