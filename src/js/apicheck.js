/** 
 * Requests a HTML endpoint and alerts user if the request fails.
 * This is useful for checking fickle REST API services from DataFordeler.
 */
export function apiCheck(endpoint, message) {
  return fetch(endpoint)
  .then(function(response) {
    if (!response.ok) {
      if (message) {
        alert(message)
      }
      throw new Error()
    } else {
      return true
    }
  })
  .catch(function(error) {
    throw new Error(error)
  })
}
