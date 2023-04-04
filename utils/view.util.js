function isValidPage (page, totalPages) {
  if (page === undefined) {
    return true
  }
  if (isNaN(page) || page <= 0 || page > totalPages) {
    return false
  }
  return true
}

// function buildSortQuery (query) {
//   const sort = {}
//   if (query.sort && ['title', 'price'].includes(query.sort)) {
//     sort[query.sort] = query.order === 'desc' ? -1 : 1
//   }
//   return sort
// }

// function buildConditionsQuery (query) {
//   const conditions = {}
//   if (query.category) {
//     conditions.category = query.category
//   }
//   if (query.status) {
//     conditions.status = query.status === 'true'
//   }
//   return conditions
// }

export default {
  // buildSortQuery,
  // buildConditionsQuery,
  isValidPage
}
