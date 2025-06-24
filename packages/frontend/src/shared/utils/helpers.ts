export function validatePassword(password: string) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)
}

export function validateRequiredField(parent: any, value: string, callback: any) {
  if ((parent as Record<string, any>)[value] === '') {
    callback(new Error('Please provide a value'))
  }
  else {
    callback()
  }
}
