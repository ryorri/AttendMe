export const formatDate = (date: string): string => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // Miesiące są indeksowane od 0
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  // Zwracanie sformatowanej daty w formacie DD.MM.YYYY HH:MM
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

export const onlyDate = (date: string): string =>{
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // Miesiące są indeksowane od 0
  const year = d.getFullYear()


  return `${day}.${month}.${year}`
}

export const onlyHours = (date: string): string =>{
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}
