const PROTOCOL = "https";
const HOST = "githubusercontent.com";
let fullHost = "";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

async function handleRequest(event) {
  const request = event.request;
  const method = request.method;
  if (request.method !== "GET") return MethodNotAllowed(method);

  const reqUrl = request.url;
  const cacheKey = new Request(reqUrl, request);

  const cache = caches.default;
  let response = await cache.match(cacheKey);

  if (!response) {
    const originUrl = new URL(reqUrl);
    const originHost= originUrl.host
    const subHost = originHost.split('-')[0]
    fullHost = `${subHost}.${HOST}`
    
    originUrl.protocol = PROTOCOL
    originUrl.host = fullHost;

    const newReq = new Request(originUrl.toString(), request);
    newReq.headers.set("Host", fullHost);

    response = await fetch(newReq);

    response = new Response(response.body, response);
    event.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
}

function MethodNotAllowed(method) {
  return new Response(`Method ${method} not allowed.`, {
    status: 405,
    headers: {
      Allow: "GET",
    },
  });
}