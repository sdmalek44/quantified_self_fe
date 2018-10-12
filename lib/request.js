function request(uri, method, body) {
  return fetch('http://localhost:3000' + uri, {
    method: method,
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
}

module.exports.request = request
