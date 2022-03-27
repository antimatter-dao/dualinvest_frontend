import { useEffect } from 'react'

export default function usePollingWithMaxRetries(
  fn: (() => Promise<any>) | undefined,
  callback: (r: any) => void,
  delay = 30000,
  retries = 5,
  promiseAll = false
) {
  useEffect(() => {
    let isMounted = true
    if (!fn || fn === undefined) {
      return
    }

    fn &&
      fn()
        .then(r => {
          if (promiseAll) {
            r.map((item: any) => {
              if (item.data.code !== 200) {
                throw Error(item.data.msg)
              }
            })
          }
          if (!promiseAll && r.data.code !== 200) {
            throw Error(r.data.msg)
          }
          if (isMounted) {
            callback(r)
          }
        })
        .catch(e => {
          console.error(e)
        })

    return () => {
      isMounted = false
    }
  }, [fn, callback, promiseAll])

  useEffect(() => {
    let isMounted = true
    if (!fn) {
      return
    }
    const id = setInterval(() => {
      if (retries <= 0) {
        clearInterval(id)
        return
      }

      fn &&
        fn()
          .then(r => {
            if (r === null) {
              clearInterval(id)
              return
            }
            if (r.data.code !== 200) {
              throw Error(r.data.msg)
            }
            if (isMounted) {
              callback(r)
            }
          })
          .catch(e => {
            retries--
            console.error(e)
          })
    }, delay)

    return () => {
      isMounted = false
      clearInterval(id)
    }
  }, [fn, callback, delay, retries])
}
