interface Field {
  label: string;
  value: string;
  key: string;
}

interface Error {
  message: string;
  field: Field;
}

export interface ValidationErrorResponse {
  name: string;
  message: string;
  status: boolean;
  errors: Array<Error>;
}
