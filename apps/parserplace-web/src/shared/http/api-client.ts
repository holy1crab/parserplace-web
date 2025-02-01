import {inject, Injectable} from '@angular/core'
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from '@angular/common/http'
import {map, Observable, pipe, UnaryFunction} from 'rxjs'
import camelcaseKeys from 'camelcase-keys'
import {isObject} from '@pp/web/util/util.js'
import {snakecaseKeys} from '@pp/web/util/snake-case-keys.js'
import {ApiError} from './api-error.js'

/* a simple wrapper for angular http client - handles json only */

// standard client overrides a lot of options,
// we choose only "json" response with "body" observing
type BaseClientOptions = {
  headers?: HttpHeaders | {[header: string]: string | string[]}
  // observe: 'body'
  context?: HttpContext
  params?:
    | HttpParams
    | {[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>}
  reportProgress?: boolean
  responseType?: 'json'
  withCredentials?: boolean
  transferCache?: {includeHeaders?: string[]} | boolean
}

type ExtendedClientOptions = {
  camelCaseKeysResponse?: boolean | {deep: boolean}
  snakeCaseKeysRequest?: boolean | {deep: boolean}
}

type HttpClientExtendedOptions = BaseClientOptions & ExtendedClientOptions

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private http = inject(HttpClient)

  get<T>(url: string, options?: HttpClientExtendedOptions): Observable<T> {
    let {camelCaseKeysResponse, snakeCaseKeysRequest, params} = {
      ...options,
      observe: 'body',
    } as HttpClientExtendedOptions

    if (snakeCaseKeysRequest && isObject(params)) {
      params = snakecaseKeys(params, {
        deep: isObject(snakeCaseKeysRequest) ? snakeCaseKeysRequest.deep : false,
      })
    }

    return this.http.get<T>(url, {...options, params}).pipe(processBody(camelCaseKeysResponse))
  }

  post<T>(url: string, body: any | null, options?: HttpClientExtendedOptions): Observable<T> {
    const {camelCaseKeysResponse, snakeCaseKeysRequest} = {...options}

    if (body && snakeCaseKeysRequest) {
      body = snakecaseKeys(body)
    }

    return this.http
      .post<T>(url, body, {...options, observe: 'body'})
      .pipe(processBody(camelCaseKeysResponse))
  }
}

function handleResponseData(
  responseData: {error?: string | string[]; response?: unknown} | undefined | null,
): any {
  if (!isObject(responseData)) {
    return responseData
  }

  if (responseData?.error) {
    if (!Array.isArray(responseData.error)) {
      throw new ApiError(responseData.error)
    } else if (responseData.error.length) {
      throw new ApiError(responseData.error.join('\n'))
    }
  }

  return responseData?.hasOwnProperty('response') ? responseData.response : responseData
}

function processCamelCaseKeys<T>(
  data: Record<string, unknown>,
  options: {deep: boolean} | true,
): T {
  const deep = isObject(options) ? options.deep : options
  return camelcaseKeys(data, {deep}) as any
}

function processBody<T>(
  camelCaseKeysResponse: boolean | {deep: boolean} | undefined,
): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(
    map((body) => {
      if (!isObject(body)) {
        return body
      }

      body = handleResponseData(body)

      if (camelCaseKeysResponse && (isObject(body) || Array.isArray(body))) {
        body = processCamelCaseKeys(body as Record<string, unknown>, camelCaseKeysResponse)
      }

      return body
    }),
  )
}
