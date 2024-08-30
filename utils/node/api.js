
const request = async (url, options) => {
  console.log(`${options.method ?? "GET"}: ${url}`)

  try {
    const response = await fetch(url, options);
    return response;
  }
  catch(e) {
    console.log("ERROR");
    console.log(e);
    throw e;
  }
};

const post = (url, data, opts) => {
  const body    = Object.assign({}, data);
  const headers = Object.assign({}, { "Content-Type": "application/json" }, opts?.headers)
  const options = Object.assign(
    { method: 'POST', body: JSON.stringify(body) },
    opts,
    { headers }
  );

  return request(url, options);
};

const put = (url, data, opts) => {
  const body    = Object.assign({}, data);
  const options = Object.assign({}, {
    method: 'PUT',
    body: JSON.stringify(body)
  }, opts);

  return request(url, options);
};

const json = async (url, data, opts) => {
  const qs      = ""
  const fullUrl = `${url}${qs}`;
  const headers = Object.assign({}, { "Content-Type": "application/json" }, opts?.headers)
  const options = Object.assign({}, opts, { headers });

  try {
    const response = await post(fullUrl, data, options);
    const text     = await response.text();
    const json     = JSON.parse(text);

    console.log(json);
    return json;
  }
  catch(e) {
    console.log("ERROR");
    console.log(e);
    throw e;
  }
};

const formEncoded = (url, data, opts) => {
  const body    = Object.assign({}, data);
  const options = Object.assign({}, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(body)
  }, opts);

  return request(url, options);
}

const Api = { formEncoded, json, post, put, request };

module.exports = Api;
