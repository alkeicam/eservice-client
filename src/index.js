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
        // sample token response
        // {
        //     "result": "success",
        //     "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
        //     "merchantId": "176689",
        //     "additionalDetails": {},
        //     "processingTime": 7,
        //     "token": "b4940f30-563a-4242-a2a9-02aa3ecb2840"
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

    payWithBLIKSingleItem(amount, customerBLIKCode, customerEmail, customerExternalId, itemDescription, transactionId) {
        var that = this;
        var self = this;
        // request token

        var data = "action=PURCHASE&merchantId={merchantId}&password={password}&timestamp={now}&allowOriginUrl={allowOriginUrl}&channel={channel}&amount={amount}&currency={currency}&country={country}&paymentSolutionId={paymentSolutionId}&merchantNotificationUrl={merchantNotificationUrl}&blikCode={blikCode}";
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
            .replace("{blikCode}", customerBLIKCode);
            

        
        var requestOptions = {            
        }

        return that._invokeWithPost(that.options.tokenEndpoint+"?"+data, requestOptions)
        .then(response=>{            
            return this._handleResponse(response);
        }).then(tokenResponse=>{
            // now as we have token we may request payment
            var data = "merchantId={merchantId}&token={token}";
            data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{token}", tokenResponse.token);

            var requestOptions = {                
            }

            return that._invokeWithPost(that.options.paymentsEndpoint+"?"+data, requestOptions);
        }).then(paymentsResponse=>{
            this._handleResponse(paymentsResponse);
        }).then(paymentsResponse=>{
            return;
        })
    }

    payWithGooglePaySingleItem(amount, googlePayToken, customerEmail, customerExternalId, itemDescription, transactionId) {
        var that = this;
        var self = this;
        // request token

        var data = "action=PURCHASE&merchantId={merchantId}&password={password}&timestamp={now}&allowOriginUrl={allowOriginUrl}&channel={channel}&amount={amount}&currency={currency}&country={country}&paymentSolutionId={paymentSolutionId}&merchantNotificationUrl={merchantNotificationUrl}&blikCode={blikCode}";
        data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{password}", self.options.password)
            .replace("{now}", new Date().getTime())
            .replace("{allowOriginUrl}", self.options.allowOriginUrl)
            .replace("{channel}", self.options.channel)
            .replace("{amount}", amount)
            .replace("{currency}", self.options.currency)
            .replace("{country}", self.options.country)
            .replace("{paymentSolutionId}", self.options.googlePayPaymentSolutionId )
            .replace("{merchantNotificationUrl}", self.options.merchantNotificationUrl);
            

        
        var requestOptions = {            
        }

        return that._invokeWithPost(that.options.tokenEndpoint+"?"+data, requestOptions)
        .then(response=>{            
            return this._handleResponse(response);
        }).then(tokenResponse=>{
            // now as we have token we may request payment
            var data = "merchantId={merchantId}&token={token}&specinCCWalletId={specinCCWalletId}&specinCCWalletToken={specinCCWalletToken}";
            data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{token}", tokenResponse.token)
            .replace("{specinCCWalletId}", self.options.googlePayPaymentSolutionId)
            .replace("{specinCCWalletToken}", googlePayToken)

            var requestOptions = {                
            }

            return that._invokeWithPost(that.options.paymentsEndpoint+"?"+data, requestOptions);
        }).then(paymentsResponse=>{
            this._handleResponse(paymentsResponse);
        }).then(paymentsResponse=>{
            return;
        })
    }

    payWithPaymentForm(amount, customerEmail, customerExternalId, itemDescription, transactionId){
        var that = this;
        var self = this;
        // request token

        var data = "action=PURCHASE&merchantId={merchantId}&password={password}&timestamp={now}&allowOriginUrl={allowOriginUrl}&channel={channel}&amount={amount}&currency={currency}&country={country}&merchantNotificationUrl={merchantNotificationUrl}";
        data = data.replace("{merchantId}", self.options.merchantId)
            .replace("{password}", self.options.password)
            .replace("{now}", new Date().getTime())
            .replace("{allowOriginUrl}", self.options.allowOriginUrl)
            .replace("{channel}", self.options.channel)
            .replace("{amount}", amount)
            .replace("{currency}", self.options.currency)
            .replace("{country}", self.options.country)            
            .replace("{merchantNotificationUrl}", self.options.merchantNotificationUrl);            
        
        var requestOptions = {            
        }

        return that._invokeWithPost(that.options.tokenEndpoint+"?"+data, requestOptions)
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