const ORIGIN = "origin_0";
const PROTOCOL = "https";
const HOST = "github.io";
let fullHost = "";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

async function handleRequest(event) {
  const request = event.request;
  const method = request.method;
  if (request.method !== "GET") return MethodNotAllowed(method);

  const originUrl = new URL(request.url);
  const originHost = originUrl.host;
  const subHost = originHost.split(".")[0];
  fullHost = `${subHost}.${HOST}`;

  originUrl.protocol = PROTOCOL;
  originUrl.host = fullHost;

  const newReq = new Request(originUrl.toString(), request);
  newReq.headers.set("Host", fullHost);

  response = await fetch(newReq, {
    backend: ORIGIN,
  });

  // response = new Response(response.body, response);
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
