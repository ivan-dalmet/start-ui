export const VALIDATION_CODE_MOCKED = '000000';
export const ALLOWED_CHARACTERS = 'abcdefghjkmnpqrstuvwxyz23456789';
export const VALIDATION_RETRY_DELAY_IN_SECONDS = 2;
export const VALIDATION_RETRY_ALLOWED_BEFORE_DELAY = 3;
export const VALIDATION_TOKEN_EXPIRATION_IN_MINUTES = 5;

export const getValidationRetryDelayInSeconds = (attempts: number) =>
  attempts > VALIDATION_RETRY_ALLOWED_BEFORE_DELAY
    ? (attempts - VALIDATION_RETRY_ALLOWED_BEFORE_DELAY) *
      VALIDATION_RETRY_DELAY_IN_SECONDS
    : 0;
