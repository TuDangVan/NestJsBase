import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Method } from 'axios';
import { Request } from 'express';
import requestPayloadParser from 'src/utils/parser/request-payload-parser';

@Injectable({ scope: Scope.REQUEST })
export class TranformPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private request: Request) {}
  transform(value: any) {
    const payloadParser = requestPayloadParser(
      value,
      this.request.method as Method,
    );
    return payloadParser;
  }
}
