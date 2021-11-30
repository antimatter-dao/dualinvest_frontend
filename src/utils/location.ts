export const fetchLocation = () => {
  return wrapPromise(
    fetch('http://ip-api.com/json/?fields=countryCode')
      .then(r => r.clone().json())
      .then(json => json.countryCode)
      .catch(e => {
        console.error(e)
      })
  )
}

function wrapPromise(promise: Promise<any>) {
  let status = 'pending'
  let result: any
  const suspender = promise.then(
    (r: any) => {
      status = 'success'
      result = r
    },
    (e: Error) => {
      status = 'error'
      result = e
    }
  )
  return {
    read() {
      if (status === 'pending') {
        throw suspender
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    }
  }
}
