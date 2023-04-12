function isValidPage (page, totalPages) {
  if (page === undefined) {
    return true
  }
  if (isNaN(page) || page <= 0 || page > totalPages) {
    return false
  }
  return true
}

export default {
  isValidPage
}
