import { HttpException } from '@nestjs/common';
import {
  PipeTransform,
  ArgumentMetadata,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    let err_messages: any[] = [];
    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        err_messages = [...err_messages, ...this.buildMessageErrors(errors[i])];
      }
      throw new HttpException(
        {
          success: false,
          message: 'REGISTRATION.INVALID_PARAMS',
          errors: err_messages,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }

  /**
   * Use normallize message errors from nestjs validator
   * @param errors
   * @returns
   */
  private buildMessageErrors(
    error: ValidationError,
    propertyPath?: string,
  ): string[] {
    if (!error) return [];
    let messagesErrors = [];
    if (Object.keys(error?.constraints || {}).length) {
      for (const property in error.constraints) {
        const propertyPathError = propertyPath ?? error.property;
        let message = error.constraints[property];
        // we only custom name when property path is nested path
        if (propertyPathError.includes('.')) {
          const messageSplit = error.constraints[property].split(' ');
          messageSplit.shift();
          message =
            (propertyPath ?? error.property) + ' ' + messageSplit.join(' ');
        }
        messagesErrors.push(message);
        return messagesErrors;
      }
    }
    if (error?.children?.length) {
      for (const err of error.children) {
        const nestedPath = [propertyPath ?? error?.property, err.property];
        messagesErrors = [
          ...messagesErrors,
          ...this.buildMessageErrors(err, nestedPath.join('.')),
        ];
      }
    }
    return messagesErrors;
  }
}
