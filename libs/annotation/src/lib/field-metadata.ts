export interface NameMetadata {
  name?: string
}

export interface FieldMetadata extends NameMetadata {
  notNull?: boolean
  serialize?: (val: any) => any
  deserialize?: (data: any) => any
}
