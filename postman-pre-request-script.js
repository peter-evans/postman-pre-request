function strFormatMap(template, map) {
  var out = template;
  Object.keys(map).forEach(function(key) {
    out = out.replace("${" + key + "}", map[key]);
  });
  return out;
}

function getHeadersString(sigHeaders) {
  var headers = "";
  Object.keys(sigHeaders).forEach(function(h) {
    if (headers !== "") headers += " ";
    headers += h;
  });
  return headers;
}

function getSigString(sigHeaders) {
  var sigString = "";
  Object.keys(sigHeaders).forEach(function(h) {
    if (sigString !== "") sigString += "\n";
    if (h.toLowerCase() == "request-line") sigString += sigHeaders[h];
    else sigString += h.toLowerCase() + ": " + sigHeaders[h];
  });
  return sigString;
}

function hashString(algorithm, str, secret) {
  switch (algorithm) {
    case "hmac-sha1":
      return CryptoJS.HmacSHA1(str, secret);
    case "hmac-sha256":
      return CryptoJS.HmacSHA256(str, secret);
    case "hmac-sha512":
      return CryptoJS.HmacSHA512(str, secret);
    default:
      return null;
  }
}

// Set the date header
var dateHeader = new Date().toGMTString();
// Strip the hostname from the URL
var targetUrl = request.url.trim().replace(new RegExp("^https?://[^/]+/"), "/");
// Build the request-line header
var requestLine = request.method + " " + targetUrl + " HTTP/1.1";
// MD5 digest of the content
var md5digest = CryptoJS.MD5(request.data);
var base64md5 = CryptoJS.enc.Base64.stringify(md5digest);
// Get the content-type header
var contentType = request.headers["Content-Type"];
// Set the content-length header
var contentLength = 0;
if (request.data) {
  contentLength = request.data.length;
}

// Set headers for the signature hash
var sigHeaders = {
  "request-line": requestLine,
  date: dateHeader,
  "content-type": contentType,
  "content-md5": base64md5,
  "content-length": contentLength
};

// Set the key ID and secret
var keyId = environment.keyId;
var secret = environment.secret;
// Set the signature hash algorithm
var algorithm = "hmac-sha1";

// Set the authorization header template
var authHeaderTemplate =
  'hmac username="${keyId}",algorithm="${algorithm}",headers="${headers}",signature="${signature}"';

// Get the list of headers
var headers = getHeadersString(sigHeaders);
// Build the signature string
var sigString = getSigString(sigHeaders);
// Hash the signature string using the specified algorithm
var sigHash = hashString(algorithm, sigString, secret);

// Format the authorization header
var authHeader = strFormatMap(authHeaderTemplate, {
  keyId: keyId,
  algorithm: algorithm,
  headers: headers,
  signature: CryptoJS.enc.Base64.stringify(sigHash)
});

// Set Postman environment variables for the headers
postman.setEnvironmentVariable("auth-header", authHeader);
postman.setEnvironmentVariable("date-header", dateHeader);
postman.setEnvironmentVariable("content-md5", base64md5);
postman.setEnvironmentVariable("content-length", contentLength);
