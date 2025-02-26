import axios, { AxiosResponse, Method } from 'axios';
import * as qs from 'qs';
import pino from 'pino';
import { API_DEFINITIONS } from './api-definitions';

export type ReqDetails = {
  loggerTag?: string[];
  headers?: Record<string, any>;
  payload: Record<string, any>;
  pathParams: Record<string, any>;
};

class BaseHttpHelper {
  private providerName = 'Http_Helper';
  private http = axios;
  private logger = pino();
  constructor() {
    for (const [apiName, apiInfo] of Object.entries(API_DEFINITIONS)) {
      this[apiName] = (reqDetails: ReqDetails) => {
        return this.sendTo(apiInfo.method, apiInfo.url, reqDetails);
      };
    }
  }

  private handleRouteParams(url: string, pathParams: Record<string, any>) {
    return url.replace(/{(\w+)}/g, (_, key) => {
      const value = pathParams[key];
      if (!value) {
        throw new Error(`Route param ${key} not found in payload`);
      }
      return value;
    });
  }

  private formatUrl(url: string, pathParams: Record<string, any>) {
    return this.handleRouteParams(url, pathParams);
  }

  private formatPayload(
    payload: Record<string, any>,
    method: Method,
    contentType: string,
    headers: Record<string, any>,
  ): Record<string, any> | string {
    if (method.toLowerCase() === 'get') {
      return { params: payload, headers };
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      return qs.stringify(payload);
    }

    return payload;
  }

  private async sendTo(
    method: Method,
    url: string,
    reqDetails: ReqDetails,
  ): Promise<any> {
    const {
      payload = {},
      pathParams = {},
      headers = {},
      loggerTag = [],
    } = reqDetails;

    const contentType = headers['Content-Type'] || 'application/json';
    const formattedUrl = this.formatUrl(url, pathParams);
    const formattedPayload = this.formatPayload(
      payload,
      method,
      contentType,
      headers,
    );
    const tags = [this.providerName, ...loggerTag];

    try {
      const response: AxiosResponse = await this.http[method](formattedUrl, formattedPayload, { headers });
      this.logger.info({ url: formattedUrl, payload: formattedPayload, response: response.data, tags } );
      return response.data;
    } catch (error) {
      this.handleHttpError(error, formattedUrl, formattedPayload, tags);
    }
  }

  private handleHttpError(
    error: any,
    url: string,
    payload: any,
    tags: string[],
  ): never {
    const { message, response = { status: 400, data: {} } } = error;
    const { data, status } = response;
    const errMsg = `${message}, ${JSON.stringify(data)}`;
    this.logger.error({url, payload, errMsg, tags});

    throw new Error(`[${tags.join(', ')}] unhandled error: ${errMsg}`);
  }
}

type Expand<T> = T extends object ? { [K in keyof T]: T[K] } : T;

type GenPathParams<T> = T extends `${string}{${infer Params}}${infer Remaining}`
  ? { [k in Params | keyof GenPathParams<Remaining>]: string }
  : undefined;

type ApiDefinitions = typeof API_DEFINITIONS;
type ApiNames = keyof ApiDefinitions;

type NonUndefined<T> = Expand<{
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
}>;

type Api = {
  [ApiName in ApiNames]: (
    reqDetails: NonUndefined<{
      [K in keyof ReqDetails]: K extends 'payload'
        ? ApiDefinitions[ApiName]['request']
        : K extends 'pathParams'
          ? GenPathParams<ApiDefinitions[ApiName]['url']>
          : ReqDetails[K];
    }>,
  ) => Promise<ApiDefinitions[ApiName]['response']>;
};

interface Type<T> {
  new (...args: unknown[]): T;
}

function ExtendType<T, U>(baseClass: { new (...args: unknown[]): T }) {
  return baseClass as Type<T & U>;
}


export class HttpHelper extends ExtendType<BaseHttpHelper, Api>(
  BaseHttpHelper,
) {
}
