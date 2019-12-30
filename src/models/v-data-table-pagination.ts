import _ from 'lodash'

export interface IVDataTablePagination {
  page: number
  rowsPerPage: number
  sortBy: string
  descending: boolean
  equals(task: IVDataTablePagination): boolean
  clone(): IVDataTablePagination
}

export class VDataTablePagination implements IVDataTablePagination {
  page = 1
  rowsPerPage = 25
  sortBy = 'id'
  descending = false

  constructor(init?: Partial<VDataTablePagination>) {
    if (init) {
      Object.assign(this, init)
    }
  }

  equals(pagination: IVDataTablePagination): boolean {
    return _.isEqual(this, pagination)
  }

  clone(): IVDataTablePagination {
    return _.cloneDeep(this)
  }
}
