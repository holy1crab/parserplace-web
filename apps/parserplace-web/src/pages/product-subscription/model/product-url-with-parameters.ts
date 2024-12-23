export type ParameterValue = string | string[] | number | number[]

export type ParameterKeyToValue = {[key: string]: ParameterValue}

export type ParameterKeyValue = {
  key: string
  value: ParameterValue
}

export type ProductUrlWithParameters = {
  url: string
  parameters: ParameterKeyValue[]
}
