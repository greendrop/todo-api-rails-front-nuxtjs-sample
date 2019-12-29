import moment from 'moment'

const datetime = (value: any, format: string) => {
  if (!value) return ''

  format = format || 'YYYY/MM/DD HH:mm'
  return moment(value).format(format)
}

const truncate = (value: any, length: any, omission: string) => {
  length = length ? parseInt(length, 10) : 20
  omission = omission ? omission.toString() : '...'

  if (value.length <= length) {
    return value
  } else {
    return value.substring(0, length) + omission
  }
}

export { datetime, truncate }
