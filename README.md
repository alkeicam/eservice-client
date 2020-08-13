A simple and lightweight eService BLIK and Google Pay payment facility
=======
> This module performs eService integration

## Table of contents
* [Installation](#installation)
    * [Node/Javascript](#nodejavascript)    
    * [Browser](#browser)
* [Usage](#usage)
    * [Create a connector](#create-a-connector)
    * [Invoke BLIK payments](#invoke-blik-payments)
    * [Invoke Google Pay payments](#invoke-google-pay-payments)
    * [Invoke PayByLink form generation](#invoke-paybylink-form-generation)
    * [Invoke Apple Pay payments](#invoke-apple-pay-payments)    
* [Response structure](#response-structure)  


## Installation
### Node/Javascript
```js
npm install eservice-pl
```

### Browser
```html
<script type="text/javascript" src="https://unpkg.com/eservice-pl"></script>

<!-- from now one in the window global scope there is an eservice object -->
```


## Usage
To use:
* simply require module 
* create connector 
* call payWithBLIK() method or payWithGooglePay() method


### Create a connector
```js
const eServiceModule = require('eservice-pl');

// configure options
// these is the minimal set of configuration options, you MUST provide your merchant data agreed with eService
// and application details
const ESERVICE_OPTIONS = {
    // for production usage change URLs below to your production eservice endpoint - by default
    // test environment is used
    //apiBaseURL: 'https://apiuat.test.secure.eservice.com.pl',
    //formBaseURL: 'https://cashierui-apiuat.test.secure.eservice.com.pl',
    merchantId: '--your merchant id--',
    password: '--your password--',
    currency: 'PLN', //iso currency code
    country: 'PL', // iso country code
    allowOriginUrl: '--your domain--',
    merchantNotificationUrl: '--your notification url (where status will be sent in async way)--'
}

eServiceModule.configure(ESERVICE_OPTIONS);
// from now on you can request payments
```

### Invoke BLIK payments
```js
// make a BLIK payment

// this is the BLIK code that is entered by the customer
var BLIKCode = 712898;

var customerEmail = 'test@test.pl';
var customerExternalId = 'myCRMId1';
var amount = '1.00';
var paymentDescription = 'Your product';
var transactionId = 'your internal transaction id - will be used in status async notification';


eServiceModule.payWithBLIKSingleItem(amount, BLIKCode, customerEmail, customerExternalId, paymentDescription, transactionId).then(response=>{
  // here one can check on the response if the payment was a success 
	console.log('There was a valid response', response);
}).catch(error=>{
  // this is called when any business related error has happened (such as unauthorized payment attempt)
	console.log('Failed to handle payment', error);
});
```

### Invoke Google Pay payments
```js

//...
// handle Google Pay flow ( https://developers.google.com/pay/api/web/guides/tutorial ) until you get Token Google Pay (example below)
{
    "signature": "MEUCIQDY3wBQyHB4sZcktRoJXKxm+OLcjHzCvdDeGn23oX0kkwIgKznRFZZL+sDMv1b5cuD+YurXMZraYBsr9hbravVY5Ro\u003d",
    "protocolVersion": "ECv1",
    "signedMessage": "{\"encryptedMessage\":\"cI87tLqzqTGyCFnMMCVWcTHw3xhYIK+CEnuQ74K+nlLpCgOlfpScib9jds4sxDtN6CunCqCSMfd/3yHeeRy6aCx1yyqcT4ey6NueeBznprJpkmVVgI1JHWLQt4hzAXMUAcYASYLOabKP9fUZvHkOBDytD531jpzNXa+Spc/zrpGzFKx2C4VU9sC95q9i+ey+kr7ZMNVCOFJPWXu7lKZ105IOOqozJ6/70MKmxP3jM89eeq+/19QnyHjQLXfnQPvQjiUJKGCcRKDLlrb3XoY5ZUUzGfN5eZCLzCVg0hWEbwU+6J7KWYJyW+Wr1r8bagN9zWsrMKhDpsQbHfyzb+yBzFUoxeUgL4a7FeVvEllIcHtqsvTCf6FENV20aF5VLDv5qzUkV+PzTAIbFEuabA0God9UbVCVVv7nM8QFzvRPhzYYFVFTn4JHvL2qZ4pAR9lE+w\\u003d\\u003d\",\"ephemeralPublicKey\":\"BPHLC4sBHpenY1M0ixmiDMuWJTaTJOqggRUwtgBJMcBp28VsxHD7zPI7985x4F5EjMP5y8j/cuUzbe/cGPjOKGk\\u003d\",\"tag\":\"RaXrPOUuc5iw3oxDa0C2MOjaKxgxIRQvwOspmtFV0zU\\u003d\"}"
}


// since You have received Token Google Pay you can make a Google Pay payment



// this is the Token Google Pay received from Google Pay (notice that this is a string)
var gPayToken = "{"signature":"MEUCIEJoMGDQ3eIAty6A0IHFaVOU3PEp0tE2NVwuQdJU7hGDAiEAk/P8so4D0riPSaPaYDK7LlS/LSLWku35cDpqOLolbt4\u003d","protocolVersion":"ECv1","signedMessage":"{\"encryptedMessage\":\"CqgxuNJ5GPD05mvx2vJ1TljNIYxoKeTNVOowjJQsgwHqKmN+nlBJ4C/b0RxiGMiNwb3xxzlnLt13fnszi7sawSuQ0mY2go/XE5qTukgFSrUKjKON044Np5b5suNnS0LCynNAme2OJGl3JJ5nMNTq+mBN82klA+LKGg6EKSmLBGIEaShFeqxGOXxpqNuzmnXoW4zMlXwwNasKM48cVOC2AqW7svipxDskZbD7dLuwFzJowZq3v//Yh5VDR1ktZRsjqRhU7DDcZkA33S6oWK1Rx7DTpMeSDtmkgSd7Da7YrIM1WCLFr/4cljUXQTAY9+hbf+yWS4a4rmg5qLZej6RGDVySSvyivZwSLBy5olxNYUxHVMBGNj/ia7Adzzh6REr0XBogvXpzOdf4CzrJllvusRxlwZbSnNLUW1PawdW/OtDEDVFZ+id3vXFILvYjgXLV7g\\u003d\\u003d\",\"ephemeralPublicKey\":\"BIBCdO1fyvbl2Jk/Q4yGICJarDVbzT0N3737T+McJ089lVv0zjdKgyqYhznR3saKK4e5Qc4VLJTNRTKin3stYFs\\u003d\",\"tag\":\"C4cxIqJF1iPKWI9vPN+URR3GyFo5l34Ks+BPyFQwtCg\\u003d\"}"}";

var customerEmail = 'test@test.pl';
var customerExternalId = 'myCRMId1';
var amount = '1.00';
var paymentDescription = 'Your product';
var transactionId = 'your internal transaction id - will be used in status async notification';
var landingPageURL = 'https//your.landing.page' // used when additional 3DS verification is required


eServiceModule.payWithGooglePaySingleItem(amount, gPayToken, customerEmail, customerExternalId, paymentDescription, transactionId, landingPageURL).then(response=>{
  // here one can check on the response if the payment was a success 
	console.log('There was a valid response', response);
}).catch(error=>{
  // this is called when any business related error has happened (such as unauthorized payment attempt)
	console.log('Failed to handle payment', error);
});
```

### Invoke Apple Pay payments
```js

//...
// handle Apple Pay Flow
// ...
// since You have received Apple Pay Token you can make a payment



// this is the Apple Pay Token received from Apple (notice that this is a string)
var aPayToken = "{
  "paymentData": {
    "version": "EC_v1",
    "data": "1gbgeAeUODHcOsNuUqxURZhACqjhSMBcVQwZVlgX56F7y/yiWAPa/jSv9nFuShelPbRFOjTeE+lGu9iZ/v8Bf78+4ee/GgXH5UJ6a6k+NGkhqXjOm4nIYnV7Nwz74w4vdTciBk8epeqzCvSb6Y2yNH22Z+WuxvqOTV3iVN7JqbMxfypEpiQQEnqgtqwBtrfd3K4xdFL0gq71wJDM21Gbq0bRWjprNIF/Vy8D6BJ7U8bIl2ydUX0h2hsILG4Np6HrRCcnxQtqYOK1wniGQZh8/U0lk8FLIzOkjLwkeNYyneKEfyC7BH4dbL60/P4IMO7/SKwHbiaINx9829A1h9edDJdbc2aE6kyZOuc6nLpvfuWFaoNlxp++ygYTnoVBeAdPwVK+dbROlL6tF5kUqr1o09QElpShOvHW8iVONKR9bg==",
    "signature": "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",
    "header": {
      "ephemeralPublicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEoTSeQT84yCvNXye7jxxzgYklwMQU8HqTvdPM/YfDebtrs8jWpEzdjaIGQ9hze+EebzhD39Fe3Y/klxxqkttctA==",
      "publicKeyHash": "OO+vh06ZMNrZqhyUvXvsAWv/3HrIm5Ya6xkwUXmol2o=",
      "transactionId": "0415963a4a66ec63ffd29027594337802856d020f98ba6d00e5c46b7657ce813"
    }
  },
  "paymentMethod": {
    "displayName": "Visa 6041",
    "network": "Visa",
    "type": "debit"
  },
  "transactionIdentifier": "0415963A4A66EC63FFD29027594337802856D020F98BA6D00E5C46B7657CE813"
}";

var customerEmail = 'test@test.pl';
var customerExternalId = 'myCRMId1';
var amount = '1.00';
var paymentDescription = 'Your product';
var transactionId = 'your internal transaction id - will be used in status async notification';


eServiceModule.payWithApplePaySingleItem(amount, aPayToken, customerEmail, customerExternalId, paymentDescription, transactionId).then(response=>{
  // here one can check on the response if the payment was a success 
	console.log('There was a valid response', response);
}).catch(error=>{
  // this is called when any business related error has happened (such as unauthorized payment attempt)
	console.log('Failed to handle payment', error);
});
```

### Invoke PayByLink form generation
```js

var customerEmail = 'test@test.pl';
var customerExternalId = 'myCRMId1';
var amount = '1.00';
var paymentDescription = 'Your product';
var transactionId = 'your internal transaction id - will be used in status async notification';


generatePaymentFormURL(amount, customerEmail, customerExternalId, itemDescription, transactionId).then(payByLinkURL=>{
    // here you have a link that you may use in POST form
})
```

## Response structure
```js
// sample success response (no 3DS verification required)
{ 
    status: { 
        message: 'OK', 
        code: 200 
    },
    body: {
        orderId: 'cd0024dc-184c-41df-acec-81e42ebc0d6a',
        amount: '1500',
        resultId: 'cd0024dc-184c-41df-acec-81e42ebc0d6a',
        merchantLandingPageUrl: null,
        acquirerTxId: null,
        txId: '11837815',
        language: null,
        paymentSolutionDetails: null,
        additionalDetails: {},
        acquirerAmount: null,
        processingTime: 5910,
        result: 'success',
        merchantId: '173322',
        brandId: '1722330000',
        freeText: null,
        merchantTxId: '-M1QCzUruoppxOqMn0Ac',
        customerId: 'N1UKmyXZdApuNEbjcU94',
        merchantLandingPageRedirectMethod: null,
        acquirerCurrency: null,
        action: 'PURCHASE',
        paymentSolutionId: '2222',
        currency: 'PLN',
        pan: 'N/A',
        errors: null,
        status: 'SET_FOR_CAPTURE',        
    }  
}

// sample 3DS verification required response - you shall use redirectionUrl in your application and redirect customer as 
// additional verification is required. As a result the customer will be redirected back to 
// the URL provided in landingPageURL parameter
{
    status: {
        code: 200,
        message: 'OK'
    },
    body: {
        result: 'redirection',
        resultId: 'f06196f5-b4f6-4537-b9d5-9d48a99f1349',
        merchantId: '112200',
        merchantTxId: '-M1_LCro_m8xdi9skLnn',
        merchantLandingPageRedirectMethod: null,
        txId: '11838909',
        redirectTarget: null,
        additionalDetails: {},
        redirectionUrl: 'https://nvpreceptor-apiuat.test.secure.eservice.com.pl/public/IPGRedirector?ipgSessionId=0a33a487-e79c-44a5-9d6e-abeb41f69947',
        errors: null,
        processingTime: 2040,
        status: 'INCOMPLETE'
    }
}
```

## Changelog
- **v1.0.18** - BLIK, GooglePay and PayByLink integration
