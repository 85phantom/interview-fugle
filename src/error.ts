export interface ErrorOutput {
  message: string;
  name: string;
  code: number;
  data: any;
  trackingCode: string;
}

export interface ErrorOptions {
  trackingCode?: string;
  originalError?: Error;
}

export class BaseError extends Error {
  public name: string;
  public code: number;
  public data: any;
  public privateData: any;
  public trackingCode: string;
  public originalError?: Error;

  constructor(
    message,
    name,
    code = 500,
    data = {},
    privateData = {},
    options: ErrorOptions = {},
  ) {
    super(message);
    this.name = name;
    this.code = code;
    this.trackingCode = options.trackingCode ? options.trackingCode : '';
    this.originalError = options.originalError;

    try {
      this.data = JSON.parse(JSON.stringify(data));
      this.privateData = JSON.parse(JSON.stringify(privateData));
    } catch (err) {
      this.data = {};
      this.privateData = {};
    }
  }

  public toJSON(): ErrorOutput {
    return {
      message: this.message,
      name: this.name,
      code: this.code,
      data: this.data,
      trackingCode: this.trackingCode,
    };
  }
}

export class ValidationError extends BaseError {
  constructor(message, name, data, privateData, options: ErrorOptions) {
    super(message, name, 400, data, privateData, options);
  }
}

export class TooManyRequestError extends BaseError {
  constructor(message, name, data, privateData, options: ErrorOptions) {
    super(message, name, 429, data, privateData, options);
  }
}

export class GeneralError extends BaseError {
  constructor(privateData, options: ErrorOptions) {
    super(
      '服務發生錯誤，請稍後再試',
      'GeneralError',
      500,
      {},
      privateData,
      options,
    );
  }
}
