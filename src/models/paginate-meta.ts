export interface IPaginateMeta {
  currentPage: number
  perPage: number
  totalCount: number
}

export class PaginateMeta implements IPaginateMeta {
  currentPage: number = 0
  perPage: number = 0
  totalCount: number = 0

  constructor(init?: Partial<PaginateMeta>) {
    if (init) {
      Object.assign(this, init)
    }
  }
}
