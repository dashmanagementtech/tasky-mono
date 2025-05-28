import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

export function useCreateField<T>(ClassType: new () => T, field: keyof T) {
  return (value: any): string | true => {
    const obj = new ClassType()
    obj[field] = value

    const errors = validateSync(obj, { whitelist: true, stopAtFirstError: true })
    const fieldError = errors.find(e => e.property === field)

    if (fieldError?.constraints) {
      return Object.values(fieldError.constraints)[0] // First error
    }

    return true
  }
}
