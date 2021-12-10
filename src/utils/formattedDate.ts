export const fomattedDate = (timestamp: number) => {
  const d: Date = new Date(timestamp * 1000)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const year = d.getUTCFullYear()
  const month = months[d.getUTCMonth()]
  const date = d.getUTCDate()
  const hour = d.getUTCHours()
  const min = d.getUTCMinutes()
  const sec = d.getUTCSeconds()
  const time = `${month} ${date}, ${year} ${hour}:${min}:${sec} ${hour >= 12 ? 'PM' : 'AM'}`
  return time
}
