import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODE } from 'src/utils/constants';

export class InValidParamsException extends HttpException {
  private errors: string[];

  constructor(errors: string[], message = ERROR_CODE.INVALID_PARAMS) {
    super(message, HttpStatus.BAD_REQUEST);
    this.errors = errors;
  }

  public getErrors(): string[] {
    return this.errors;
  }

  public getResponse(): any {
    return {
      ...Object(
        typeof super.getResponse() === 'object' ? super.getResponse() : {},
      ),
      errors: this.errors,
    };
  }
}
