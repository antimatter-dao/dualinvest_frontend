import wrapPromise from './wrapPromise'

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
