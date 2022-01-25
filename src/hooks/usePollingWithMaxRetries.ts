import { useEffect, useRef } from 'react'

export default function usePollingWithMaxRetries(
  fn: (() => Promise<any>) | undefined,
  callback: (r: any) => void,
  delay = 20000,
  retries = 5
) {
  const savedFn = useRef(fn)
  const savedCallback = useRef(callback)

  useEffect(() => {
    if (!fn || fn === undefined) {
      return
    }

    savedFn.current = fn
    savedCallback.current = callback

    fn &&
      fn()
        .then(r => {
          if (r.data.code !== 200) {
            throw Error(r.data.msg)
          }
          callback(r)
        })
        .catch(e => {
          console.error(e)
        })
  }, [fn, callback])

  useEffect(() => {
    if (!savedFn.current) {
      return
    }
    const id = setInterval(() => {
      if (retries <= 0) {
        clearInterval(id)
        return
      }

      savedFn.current &&
        savedFn
          .current()
          .then(r => {
            if (r === null) {
              clearInterval(id)
              return
            }
            if (r.data.code !== 200) {
              throw Error(r.data.msg)
            }
            savedCallback.current(r)
          })
          .catch(e => {
            retries--
            console.error(e)
          })
    }, delay)

    return () => {
      clearInterval(id)
    }
  }, [fn, callback, delay, retries])
}
