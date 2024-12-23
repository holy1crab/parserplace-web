export enum SiteKey {
  Vseinstrumenti = 'vseinstrumenti.ru',
}

export interface Site {
  id?: number
  key?: SiteKey
  title?: string
  url?: string
}
