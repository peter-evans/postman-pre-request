# Postman Pre-request script for HMAC Authentication with Kong
This is javascript for use with [Postman](https://www.getpostman.com/)'s pre-request script feature.
It generates HTTP request headers for HMAC authentication with [Kong](https://getkong.org/).
More specifically, Kong's [HMAC Authentication Plugin](https://getkong.org/plugins/hmac-authentication/).

The script could easily be modified for use with custom HMAC authentication schemes.

## Usage

1. Copy the contents of [postman-pre-request-script.js](postman-pre-request-script.js) into the "Pre-request Script" tab in Postman.
2. Create an environment and add two key-value pairs at Postman's "Manage Environments" settings dialog. `keyId` containing the ID or username of the API consumer, and `secret` containing the shared secret key.

    ![Manage Environments](/screenshots/postman-manage-env.png?raw=true)
3. Switch to the new environment.
4. On the "Headers" tab click "Bulk Edit" and paste the following content into the headers field. Note that the `Content-Type` header must be set manually to the content type of your request. The other headers will be generated automatically by the script.

        Authorization:{{auth-header}}
        Date:{{date-header}}
        Content-MD5:{{content-md5}}
        Content-Length:{{content-length}}
        Content-Type:application/json 
    As shown below:
    ![Headers](/screenshots/postman-headers.png?raw=true)
5. Send the request. 

## Modifying Signature Headers
If you don't require all five headers to be included in the signature hash you can comment out the headers you don't want in the javascript as shown below:
```javascript
var sigHeaders = {
    'request-line' : requestLine,
    'date' : dateHeader,
    //'content-type' : contentType,
    'content-md5' : base64md5,
    'content-length' : contentLength
    };
```  

## Debugging the Script

When making modifications to the script it is helpful to check the contents of the generated environment variables. You can do this by clicking on the eye icon next to the environment management button after sending a request.

![Headers](/screenshots/postman-env-vars.png?raw=true)

## Reference

[HTTP Signatures Specification](https://tools.ietf.org/html/draft-cavage-http-signatures-00)

## License

MIT License - see the [LICENSE](LICENSE) file for details