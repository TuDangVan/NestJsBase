// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectID;
import { Method } from 'axios';
import { isMongoId } from 'class-validator';
/**
 * Parser payload request from formdata
 *
 *
 * @param {Request payload}
 * @returns {Object}
 *
 * @private
 */
export const requestPayloadParser = (
  payload: {
    [key: string]: any;
  },
  method: Method,
): { [key: string]: any } => {
  const payloadParser = Object.entries(payload || {}).reduce(
    (memo, [path, formValue]) => {
      const value = formValue;
      if (value === 'true' || value === 'false') {
        memo[path] = value === 'true';
        return memo;
      }
      if (value === 'null') {
        memo[path] = null;
        return memo;
      }
      if (value === 'undefined') {
        memo[path] = undefined;
        return memo;
      }
      if (
        (method === 'get' || method === 'GET') &&
        typeof value === 'string' &&
        value.includes(',')
      ) {
        const valueParser = value.split(',')?.filter(v => v !== '');
        const newValueParser = valueParser.map(v => {
          if (isMongoId(v)) {
            return ObjectId(v);
          }
          if (v === 'null') {
            return null;
          }
          if (v === 'undefined') {
            return undefined;
          }
          return v;
        });
        memo[path] = newValueParser;
        return memo;
      }
      memo[path] = value;
      return memo;
    },
    {},
  );

  return payloadParser;
};

export default requestPayloadParser;
