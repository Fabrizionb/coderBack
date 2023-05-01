/* eslint-disable  */
import express from 'express'
import { Response } from './responses.js'

export class OkResponse extends Response {
  constructor(res, payload) {
    super(res, 200, { payload }, 'success');
  }
}

export class BadRequestResponse extends Response {
  constructor(res, payload) {
    super(res, 400, { payload }, 'bad_request');
  }
}

export class UnauthorizedResponse extends Response {
  constructor(res, payload) {
    super(res, 401, { payload }, 'unauthorized');
  }
}

export class ForbiddenResponse extends Response {
  constructor(res, payload) {
    super(res, 403, { payload }, 'forbidden');
  }
}

export class NotFoundResponse extends Response {
  constructor(res, payload) {
    super(res, 404, { payload }, 'not_found');
  }
}

export class InternalServerErrorResponse extends Response {
  constructor(res, payload) {
    super(res, 500, { payload }, 'internal_server_error');
  }
}