export const fomattedDate = (timestamp: number) => {
  const d: Date = new Date(timestamp * 1000)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const year = d.getFullYear()
  const month = months[d.getMonth()]
  const date = d.getDate()
  const hour = d.getHours()
  const min = d.getMinutes()
  const sec = d.getSeconds()
  const time = `${month} ${date}, ${year} ${hour}:${min}:${sec} ${hour >= 12 ? 'PM' : 'AM'}`
  return time
}
