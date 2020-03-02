var RESTClient = require('node-rest-client').Client;


class eServiceIntegrationModule {
    constructor(options) {
        this.options = {
            apiBaseURL: 'https://apiuat.test.secure.eservice.com.pl',
            formBaseURL: 'https://cashierui-apiuat.test.secure.eservice.com.pl',
            tokenEndpoint: '/token',
            paymentsEndpoint: '/payments',
            formEndpoint: '',
            merchantId: '',
            password: '',
            allowOriginUrl: '',
            channel: 'ECOM',
            currency: 'PLN',
            country: 'PL',
            blikPaymentSolutionId: 2222,
            googlePayPaymentSolutionId: 502,
            merchantNotificationUrl: ''
        }
    }
    configure(options){
        Object.assign(this.options, options);
    }

    _retrieveResponseStatus (restClientResponse) {
        var httpStatus = {
            message: restClientResponse.connection._httpMessage.res.statusMessage,
            code: restClientResponse.connection._httpMessage.res.statusCode
        }
    
        return httpStatus;
    }

    _getRestClient(){
        return new RESTClient();
    }

    _invokeWithPost (endpoint, requestOptions) {
        var self = this;
        
        return new Promise(function (resolve, reject) {
            var restClient = self._getRestClient();            
            var url = self.options.apiBaseURL + endpoint;
            var options = requestOptions;    
                
            console.info("Going to request with POST.", url, options);
    
            restClient.post(url, options, function (responseBody, response) {
                var status = self._retrieveResponseStatus(response);                
                resolve({status: status, body: responseBody});
            }).on('error', function (err) {
                console.error("Error while requesting");
                reject(err);
            });
        });
    }

    _handleResponse(response){
        console.log('Received response', response);
        var status = response.status;
        var responseBody = response.body;
        // Sample response from eService
        // {
        //     status: { message: 'OK', code: 200 },
        //     body:
        //     {
        //         result: 'success',
        //             resultId: '602e0ee0-4ef5-4b32-9885-1b2ca92bdb17',
        //                 merchantId: '176689',
        //                     additionalDetails: { },
        //         processingTime: 5,
        //             token: '2270009c-3218-4881-a279-e02d70c25c74'
        //     }
        // }
        if (status.code == 200) {            
            if(responseBody.result == 'success'){
                return responseBody;
            }else{                
                throw new Error('Request error: '+JSON.stringify(responseBody.errors));
            }
            
        }else{
            throw new Error('Connection error: '+status.code+' '+status.message);
        }   
    }

    _generateResponse(eServiceResponse){
        var response = {
            status: eServiceResponse.status, 
            body: eServiceResponse.body
        }
        // use eservice resultId as external orderId of the transaction
        console.log(eServiceResponse);
        response.body.orderId = eServiceResponse.body.resultId
        console.log(response);
        return response;
    }

    payWithBLIKSingleItem(amount, customerBLIKCode, customerEmail, customerExternalId, itemDescription, transactionId) {
        var that = this;
        var self = this;
        // request token

        var data = "action=PURCHASE&merchantId={merchantId}&password={password}&timestamp={now}&allowOriginUrl={allowOriginUrl}&channel={channel}&amount={amount}&currency={currency}&country={country}&paymentSolutionId={paymentSolutionId}&merchantNotificationUrl={merchantNotificationUrl}&blikCode={blikCode}&merchantTxId={merchantTxId}";
        data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{password}", self.options.password)
            .replace("{now}", new Date().getTime())
            .replace("{allowOriginUrl}", self.options.allowOriginUrl)
            .replace("{channel}", self.options.channel)
            .replace("{amount}", amount)
            .replace("{currency}", self.options.currency)
            .replace("{country}", self.options.country)
            .replace("{paymentSolutionId}", self.options.blikPaymentSolutionId )
            .replace("{merchantNotificationUrl}", self.options.merchantNotificationUrl)
            .replace("{merchantTxId}", transactionId)            
            .replace("{blikCode}", customerBLIKCode);
            

        
        var requestOptions = {   
            data: data         
        }

        return that._invokeWithPost(that.options.tokenEndpoint, requestOptions)
        .then(response=>{            
            return this._handleResponse(response);
        }).then(tokenResponse=>{
            // now as we have token we may request payment
            var data = "merchantId={merchantId}&token={token}";
            data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{token}", tokenResponse.token);

            var requestOptions = {                
                data: data
            }

            return that._invokeWithPost(that.options.paymentsEndpoint, requestOptions);
        }).then(paymentsResponse=>{
            this._handleResponse(paymentsResponse);
            return paymentsResponse;
        }).then(paymentsResponse=>{
            return self._generateResponse(paymentsResponse);
        })
    }

    payWithGooglePaySingleItem(amount, googlePayToken, customerEmail, customerExternalId, itemDescription, transactionId) {
        var that = this;
        var self = this;
        // request token

        var data = "action=PURCHASE&merchantId={merchantId}&password={password}&timestamp={now}&allowOriginUrl={allowOriginUrl}&channel={channel}&amount={amount}&currency={currency}&country={country}&paymentSolutionId={paymentSolutionId}&merchantNotificationUrl={merchantNotificationUrl}&merchantTxId={merchantTxId}";
        data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{password}", self.options.password)
            .replace("{now}", new Date().getTime())
            .replace("{allowOriginUrl}", self.options.allowOriginUrl)
            .replace("{channel}", self.options.channel)
            .replace("{amount}", amount)
            .replace("{currency}", self.options.currency)
            .replace("{country}", self.options.country)
            .replace("{paymentSolutionId}", self.options.googlePayPaymentSolutionId )
            .replace("{merchantTxId}", transactionId)      
            .replace("{merchantNotificationUrl}", self.options.merchantNotificationUrl);
            

        
        var requestOptions = {        
            data: data    
        }

        return that._invokeWithPost(that.options.tokenEndpoint, requestOptions)
        .then(response=>{            
            return this._handleResponse(response);
        }).then(tokenResponse=>{
            // now as we have token we may request payment
            var data = "merchantId={merchantId}&token={token}&specinCCWalletId={specinCCWalletId}&specinCCWalletToken={specinCCWalletToken}";
            data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{token}", tokenResponse.token)
            .replace("{specinCCWalletId}", self.options.googlePayPaymentSolutionId)
            .replace("{specinCCWalletToken}", JSON.stringify(googlePayToken))

            var requestOptions = {   
                data: data             
            }

            return that._invokeWithPost(that.options.paymentsEndpoint, requestOptions);
        }).then(paymentsResponse=>{
            this._handleResponse(paymentsResponse);
            return paymentsResponse;
        }).then(paymentsResponse=>{
            return self._generateResponse(paymentsResponse);
        })
    }

    generatePaymentFormURL(amount, customerEmail, customerExternalId, itemDescription, transactionId){
        var that = this;
        var self = this;
        // request token

        var data = "action=PURCHASE&merchantId={merchantId}&password={password}&timestamp={now}&allowOriginUrl={allowOriginUrl}&channel={channel}&amount={amount}&currency={currency}&country={country}&merchantNotificationUrl={merchantNotificationUrl}&merchantTxId={merchantTxId}";
        data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{password}", self.options.password)
            .replace("{now}", new Date().getTime())
            .replace("{allowOriginUrl}", self.options.allowOriginUrl)
            .replace("{channel}", self.options.channel)
            .replace("{amount}", amount)
            .replace("{currency}", self.options.currency)
            .replace("{country}", self.options.country)     
            .replace("{merchantTxId}", transactionId)                        
            .replace("{merchantNotificationUrl}", self.options.merchantNotificationUrl);            
        
        var requestOptions = {       
            data: data     
        }

        return that._invokeWithPost(that.options.tokenEndpoint, requestOptions)
        .then(response=>{            
            return this._handleResponse(response);
        }).then(tokenResponse=>{
            // now as we have token we may request payment
            var data = "merchantId={merchantId}&token={token}&integrationMode=HostedPayPage";
            data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{token}", tokenResponse.token);            

            var resultURL = that.options.formBaseURL+that.options.formEndpoint+"?"+data;

            return resultURL;
        })
    }
}

module.exports = new eServiceIntegrationModule({});