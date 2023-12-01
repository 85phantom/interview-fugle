import { ErrorOutput } from '../error';
import _ from 'lodash';

interface CommonResponseInput<T> {
  success: boolean;
  data?: T | T[];
  error?: ErrorOutput;
}

export class CommonResponse<T> {
  public readonly success: boolean;
  public readonly data?: T | T[];
  public readonly error?: ErrorOutput;

  constructor(data: CommonResponseInput<T>) {
    this.success = _.isNil(data.success) ? true : data.success;
    this.data = data.data;
    this.error = data.error;
  }

  public toJSON(): { success: boolean; data: T | T[]; error: ErrorOutput } {
    return {
      success: this.success,
      data: this.data,
      error: this.error,
    };
  }
}
