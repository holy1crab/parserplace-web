import {Field} from '@pp/annotation'
import {BaseFilter} from '@pp/web/shared/model/filter.js'
import {LimitOffset, pageFilterToLimitOffset} from '@pp/web/shared/model/pagination.js'

export class PaginationFilter extends BaseFilter {
  @Field({deserialize: (data) => (data ? parseInt(data, 10) : undefined)})
  page?: number

  @Field({deserialize: (data) => (data ? parseInt(data, 10) : undefined)})
  limit?: number

  asLimitOffset(): LimitOffset {
    return pageFilterToLimitOffset(this as Required<PaginationFilter>)
  }

  resetPage(page = 1): PaginationFilter {
    this.page = page
    return this
  }

  static init(page: number, limit: number): PaginationFilter {
    const filter = new PaginationFilter()
    filter.page = page
    filter.limit = limit
    return filter
  }
}
