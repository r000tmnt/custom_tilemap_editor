export default async function $api(
  url: string,
  options = {}
) {
  return await useFetch(url, {
    ...options,
    // watch: false,
    // immediate: false,
    onRequest({ request, options }) {
      // Set the request headers
      // options.headers = options.headers || {}
      // options.headers.authorization = '...'
      const header = options.headers? new Headers(options.headers) : new Headers()

      options.headers = header
    },
    onRequestError({ request, options, error }) {
      // Handle the request errors
      console.log(error)
    },
    onResponse({ request, response, options }) {
      // Process the response data
      // localStorage.setItem('token', response._data.token)
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
    },
  })
}