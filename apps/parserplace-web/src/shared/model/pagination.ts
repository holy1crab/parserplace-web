export type PageLimit = {
  page: number
  limit: number
}

export type LimitOffset = {
  limit: number
  offset: number
}

export function pageFilterToLimitOffset(filter: PageLimit): LimitOffset {
  return {
    offset: (filter.page - 1) * filter.limit,
    limit: filter.limit,
  }
}

export function getPagesCount(total: number | undefined, limit: number | undefined): number {
  return total && limit ? Math.ceil(total / limit) : 0
}
