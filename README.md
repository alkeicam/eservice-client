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


eServiceModule.payWithGooglePaySingleItem(amount, gPayToken, customerEmail, customerExternalId, paymentDescription, transactionId).then(response=>{
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
// additional verification is required
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
