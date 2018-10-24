function request(uri, method, body) {
  return fetch('https://quant-self-api.herokuapp.com' + uri, {
    method: method,
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
}

module.exports.request = request
