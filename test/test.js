const chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;
const expect = chai.expect;
chai.should();
const sinon = require('sinon');

const theModule = require('../');

describe('eService integration module', () => {
    describe('configure', () => {
        let OPTIONS = {
            channel: 'OTHER_CHANNEL'
        }
        beforeEach(() => {
        });
        afterEach(() => {
        });

        it('configuration overwrite', () => {
            theModule.configure(OPTIONS);
            return expect(theModule.options.channel).equals(OPTIONS.channel);
        })
        it('configuration preserve defaults', () => {
            theModule.configure(OPTIONS);
            return expect(theModule.options.currency).equals('PLN');
        })
    })
    describe('_retrieveResponseStatus', () => {
        let RESPONSE = {
            connection: {
                _httpMessage: {
                    res: {
                        statusMessage: 'OK',
                        statusCode: 200
                    }
                }
            }
        }
        beforeEach(() => {
        });
        afterEach(() => {
        });

        it('message is extracted', () => {
            var response = theModule._retrieveResponseStatus(RESPONSE);
            return expect(response.message).equals(RESPONSE.connection._httpMessage.res.statusMessage);
        })
        it('code is extracted', () => {
            var response = theModule._retrieveResponseStatus(RESPONSE);
            return expect(response.code).equals(RESPONSE.connection._httpMessage.res.statusCode);
        })

    })
    describe('_getRestClient', () => {
        beforeEach(() => {
        });
        afterEach(() => {
        });

        it('client is initialized', () => {
            var client = theModule._getRestClient();
            return expect(client).to.exist;
        })


    })
    describe('_invokeWithPost No Error', () => {
        let RESPONSE = {
            responseBody: {

            },
            response: {
                connection: {
                    _httpMessage: {
                        res: {
                            statusMessage: 'OK',
                            statusCode: 200
                        }
                    }
                }
            }
        }
        let ENDPOINT = '/token'
        let OPTIONS = {
            some: 'some'
        }

        beforeEach(() => {
            restClient = {
                post(url, options, someFunction) {            
                    someFunction.call(this, RESPONSE.responseBody, RESPONSE.response);
                    return this;
                },
                on(kind, someErrorFunction) {
                    //someErrorFunction.call(this, 'my error');
                    return;
                 }
            }
            rcs = sinon.stub(theModule, '_getRestClient').returns(restClient);
            
        });
        afterEach(() => {
            rcs.restore();
        });

        it('resolve when valid call', () => {
            return theModule._invokeWithPost(ENDPOINT, OPTIONS).then(response => {
                return expect(response.status.code).equals(RESPONSE.response.connection._httpMessage.res.statusCode);
            })
        })


    })
    describe('_invokeWithPost With Error', () => {
        let RESPONSE = {
            responseBody: {

            },
            response: {
                connection: {
                    _httpMessage: {
                        res: {
                            statusMessage: 'OK',
                            statusCode: 200
                        }
                    }
                }
            }
        }
        let ENDPOINT = '/token'
        let OPTIONS = {
            some: 'some'
        }

        beforeEach(() => {
            restClient = {
                post(url, options, someFunction) {            
                    //someFunction.call(this, RESPONSE.responseBody, RESPONSE.response);
                    return this;
                },
                on(kind, someErrorFunction) {
                    someErrorFunction.call(this, new Error('Some error'));
                    return;
                 }
            }
            rcs = sinon.stub(theModule, '_getRestClient').returns(restClient);
            
        });
        afterEach(() => {
            rcs.restore();
        });

        it('reject with error when anythings breaks', () => {
            return theModule._invokeWithPost(ENDPOINT, OPTIONS).should.be.rejectedWith('Some error');            
        })
    })

    

    describe('payWithBLIKSingleItem', () => {
        let AMOUNT = 10;
        let BLIK_CODE = 123443;
        let EMAIL = 'some@email.com';
        let C_EXT_ID = '#excid';
        let DESCRIPTION = 'some description';
        let TRANSACTION_ID = '#tid';
        let RESPONSE_TOKEN = {
            "result": "success",
            "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
            "merchantId": "176689",
            "additionalDetails": {},
            "processingTime": 7,
            "token": "b4940f30-563a-4242-a2a9-02aa3ecb2840"
        }
        let RESPONSE_PAYMENTS = {
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
            merchantId: '176689',
            brandId: '1766890000',
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
            status: 'SET_FOR_CAPTURE'           
        }
        let RESPONSE = {
            status: { message: 'OK', code: 200 },
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
                merchantId: '176689',
                brandId: '1766890000',
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
                status: 'SET_FOR_CAPTURE'                 
            }
        }
        let OPTIONS = {
            merchantId: '449900'
        }
        beforeEach(() => {            
            theModule.configure(OPTIONS);
            ss = sinon.stub(theModule, '_invokeWithPost')
            ss.onCall(0).resolves({});
            ss.onCall(1).resolves({});

            hr = sinon.stub(theModule, '_handleResponse');
            hr.onCall(0).returns(RESPONSE_TOKEN);
            hr.onCall(1).returns(RESPONSE_PAYMENTS);

            s3 = sinon.stub(theModule, '_generateResponse');
            s3.onCall(0).returns(RESPONSE);
            s3.onCall(1).returns(RESPONSE);
        });
        afterEach(() => {
            ss.restore();
            hr.restore();
            s3.restore();
        });

        it('should resolve on success', () => {
            return theModule.payWithBLIKSingleItem(AMOUNT, BLIK_CODE, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).should.be.fulfilled;            
        })
        it('make sure that blik code is passed on', () => {
            return theModule.payWithBLIKSingleItem(AMOUNT, BLIK_CODE, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                
                return expect(call.args[1].data.blikCode).equal(BLIK_CODE);
            })
        })
        it('make sure that amount is passed on', () => {
            return theModule.payWithBLIKSingleItem(AMOUNT, BLIK_CODE, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.amount).equal(AMOUNT);
            })
        })
        it('make sure that transaction is passed on', () => {
            return theModule.payWithBLIKSingleItem(AMOUNT, BLIK_CODE, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.merchantTxId).equal(TRANSACTION_ID);
            })
        })        
        it('make sure that token is passed on', () => {
            return theModule.payWithBLIKSingleItem(AMOUNT, BLIK_CODE, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);
                return expect(call.args[1].data.token).equal(RESPONSE_TOKEN.token);
            })
        })        
        it('make sure that merchant id is passed on', () => {
            return theModule.payWithBLIKSingleItem(AMOUNT, BLIK_CODE, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);
                
                return expect(call.args[1].data.merchantId).equal(OPTIONS.merchantId);
            })
        })
    })

    describe('payWithGooglePaySingleItem', () => {
        let AMOUNT = 10;
        let GOOGLE_PAY_TOKEN = { 
            "signature": "MEUCIQDUnxiEWgp953lWGdRrXjDuP+mwUkB+uVkhyVL1/d9yXAIgUQbmPQzxuBDOdz72by6vwwFD+LHett6nY0HLjRionjA\u003d", 
            "protocolVersion": "ECv1", 
            "signedMessage": "{\"encryptedMessage\":\"Bs26e4q/iDNwwpgLRD+CDitVyygjxnwNF4r0CbAitFLcEkDPZ/8gEk7iYrcejXf+OlLnGaBzT/wOfRZoJ5zquteNCv2rFLUpK+7ClBKQ6l30P9NUGs4yAaidgIZXOgcN6pj2T5AiP0frss7eJKPNWTVVuatr2f1mIVyrma5GL4vZjBleggEzIUu1dVCTmCJJTKk63SYDUxDukOd2AIOykQddvLge1q4DHhLYd9NVLYK24TaAgk6un7sNJICPp8xQcPx1BQ56REtftLkVxPmPjyrZmNlpH9uw7voGt/ZRBVTlXlsk+DQf8Yq3A0BQWlC5fqd7FRxB8w7nP9XrophnWN6/b9jcF6RC6WQ1s3HCGQlVaMEStD6+IzYsm2C3LMztUuIFKy5L7bhQvS1t2LmCLzTU/en34sZ+pSPjRtut63XyTpFsxC1CFEB+YrFidRyJ3Q\\u003d\\u003d\",\"ephemeralPublicKey\":\"BHoCnrEN4eTH23Ds+R1Gq8LQMvJyGjl2iaqBOr0q3PtbGVwmus7JWTZ/SeapdYoeVa7PgqHfsLIL1TjmT92j91M\\u003d\",\"tag\":\"rsx9d9BmXAgWNgDNgHy0/Tt/Awx/J1V65MTwyFyyeQE\\u003d\"}" 
        };
        let EMAIL = 'some@email.com';
        let C_EXT_ID = '#excid';
        let DESCRIPTION = 'some description';
        let TRANSACTION_ID = '#tid';
        let RESPONSE_TOKEN = {
            "result": "success",
            "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
            "merchantId": "176689",
            "additionalDetails": {},
            "processingTime": 7,
            "token": "b4940f30-563a-4242-a2a9-02aa3ecb2840"
        }
        let RESPONSE_PAYMENTS = {
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
            merchantId: '176689',
            brandId: '1766890000',
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
            status: 'SET_FOR_CAPTURE'           
        }
        let RESPONSE = {
            status: { message: 'OK', code: 200 },
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
                merchantId: '176689',
                brandId: '1766890000',
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
                status: 'SET_FOR_CAPTURE'                 
            }
        }
        let OPTIONS = {
            merchantId: '449900'
        }
        beforeEach(() => {            
            theModule.configure(OPTIONS);
            ss = sinon.stub(theModule, '_invokeWithPost')
            ss.onCall(0).resolves({});
            ss.onCall(1).resolves({});

            hr = sinon.stub(theModule, '_handleResponse');
            hr.onCall(0).returns(RESPONSE_TOKEN);
            hr.onCall(1).returns(RESPONSE_PAYMENTS);

            s3 = sinon.stub(theModule, '_generateResponse');
            s3.onCall(0).returns(RESPONSE);
            s3.onCall(1).returns(RESPONSE);
        });
        afterEach(() => {
            ss.restore();
            hr.restore();

            s3.restore();
        });

        it('should resolve on success', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).should.be.fulfilled;            
        })
        it('make sure that google token is passed on', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);
                
                return expect(call.args[1].data.specinCCWalletToken).equal(JSON.stringify(GOOGLE_PAY_TOKEN));
            })
        })        
        it('make sure that eservice token value is passed on', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);                
                return expect(call.args[1].data.token).equal(RESPONSE_TOKEN.token);
            })
        })
        
        it('make sure that merchantId is passed on', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.merchantId).equal(OPTIONS.merchantId);
            })
        })
        it('make sure that amount is passed on', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.amount).equal(AMOUNT);
            })
        })
        it('make sure that transaction is passed', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.merchantTxId).equal(TRANSACTION_ID);
            })
        })        
        it('make sure that proper wallet type is passed', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);
                return expect(call.args[1].data.specinCCWalletId).equal(502);
            })
        })        
    })

    describe('payWithPaymentForm', () => {
        let AMOUNT = 10;
        
        let EMAIL = 'some@email.com';
        let C_EXT_ID = '#excid';
        let DESCRIPTION = 'some description';
        let TRANSACTION_ID = '#tid';
        let RESPONSE_TOKEN = {
            "result": "success",
            "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
            "merchantId": "176689",
            "additionalDetails": {},
            "processingTime": 7,
            "token": "b4940f30-563a-4242-a2a9-02aa3ecb2840"
        }        
        let OPTIONS = {
            merchantId: '449900'
        }
        beforeEach(() => {            
            theModule.configure(OPTIONS);
            ss = sinon.stub(theModule, '_invokeWithPost')
            ss.onCall(0).resolves({}); 
            hr = sinon.stub(theModule, '_handleResponse');
            hr.onCall(0).returns(RESPONSE_TOKEN);           
        });
        afterEach(() => {
            ss.restore();   
            hr.restore();         
        });

        it('should return payment URL on success', () => {
            return theModule.generatePaymentFormURL(AMOUNT, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).should.be.fulfilled;            
        })
        it('make sure that valid token is used in payment URL', () => {
            return theModule.generatePaymentFormURL(AMOUNT, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(paymentURL=>{
                return expect(paymentURL).contains(RESPONSE_TOKEN.token);
            })
        })
        it('make sure that HostedPayPage is used in payment URL', () => {
            return theModule.generatePaymentFormURL(AMOUNT, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(paymentURL=>{
                return expect(paymentURL).contains('HostedPayPage');
            })
        })
        it('make sure that paymentSolutionId is not set when requesting token', () => {
            return theModule.generatePaymentFormURL(AMOUNT, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(paymentURL=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.paymentSolutionId).is.undefined;
            })
        })
        it('make sure that amount is passed on', () => {
            return theModule.generatePaymentFormURL(AMOUNT, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.amount).equal(AMOUNT);
            })
        })
        
        it('make sure that merchantId is passed on', () => {
            return theModule.generatePaymentFormURL(AMOUNT, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.merchantId).equal(OPTIONS.merchantId);
            })
        })
        it('make sure that transaction is passed on', () => {
            return theModule.generatePaymentFormURL(AMOUNT, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.merchantTxId).equal(TRANSACTION_ID);
            })
        })        
    })

    describe('_handleResponse', () => {        
        let RESPONSE = {
            status: {
                code: 200,
                message: 'OK'
            },
            body: {
                "result": "success",
                "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
                "merchantId": "176689",
                "additionalDetails": {},
                "processingTime": 7,
                "token": "b4940f30-563a-4242-a2a9-02aa3ecb2840"
            }
        }
        let RESPONSE_HTTP_ERROR = {
            status: {
                code: 404,
                message: 'NOT FOUND'
            },
            body: {                
            }
        }
        let RESPONSE_LOGIC_ERROR = {
            status: {
                code: 200,
                message: 'OK'
            },
            body: {
                "result": "failure",
                "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
                "merchantId": "176689",
                "additionalDetails": {},
                "processingTime": 7,
                "errors" : [
                    {
                        "messageCode": "error.access.denied.176689",
                        "fieldName": "89.71.13.62"
                    }
                ]
            }
        }
        
        beforeEach(() => {            

        });
        afterEach(() => {

        });

        it('should return on success', () => {
            var response = theModule._handleResponse(RESPONSE);
            return expect(response.result).equal('success');
        })
        it('should throw error on http exception', () => {            
            return expect(theModule._handleResponse.bind(theModule, RESPONSE_HTTP_ERROR)).to.throw();
        })
        it('should throw error on logic exception', () => {            
            return expect(theModule._handleResponse.bind(theModule, RESPONSE_LOGIC_ERROR)).to.throw();
        })
        
    })
    describe('_generateResponse', () => {                
        let RESPONSE = {
            status: {
                code: 200,
                message: 'OK'
            },
            body: {
                "result": "success",
                "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
                "merchantId": "176689",
                "additionalDetails": {},
                "processingTime": 7,
                "token": "b4940f30-563a-4242-a2a9-02aa3ecb2840"
            }
        }
        let RESPONSE_HTTP_ERROR = {
            status: {
                code: 404,
                message: 'NOT FOUND'
            },
            body: {     
                "result": "failure",
                "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
                "merchantId": "176689",
                "additionalDetails": {},
                "processingTime": 7,
                "errors" : [
                    {
                        "messageCode": "error.access.denied.176689",
                        "fieldName": "89.71.13.62"
                    }
                ]           
            }
        }
        let RESPONSE_LOGIC_ERROR = {
            status: {
                code: 200,
                message: 'OK'
            },
            body: {
                "result": "failure",
                "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
                "merchantId": "176689",
                "additionalDetails": {},
                "processingTime": 7,
                "errors" : [
                    {
                        "messageCode": "error.access.denied.176689",
                        "fieldName": "89.71.13.62"
                    }
                ]
            }
        }
        
        beforeEach(() => {            

        });
        afterEach(() => {

        });

        it('always should return status (1)', () => {
            var response = theModule._generateResponse(RESPONSE);
            return expect(response.status).equal(RESPONSE.status);
        })
        it('always should return status (2)', () => {
            var response = theModule._generateResponse(RESPONSE_HTTP_ERROR);
            return expect(response.status).equal(RESPONSE_HTTP_ERROR.status);
        })
        it('always should return status (3)', () => {
            var response = theModule._generateResponse(RESPONSE_LOGIC_ERROR);
            return expect(response.status).equal(RESPONSE_LOGIC_ERROR.status);
        })
        it('always should return body (1)', () => {
            var response = theModule._generateResponse(RESPONSE);
            return expect(response.body).equal(RESPONSE.body);
        })
        it('always should return body (2)', () => {
            var response = theModule._generateResponse(RESPONSE_HTTP_ERROR);
            return expect(response.body).equal(RESPONSE_HTTP_ERROR.body);
        })
        it('always should return body (3)', () => {
            var response = theModule._generateResponse(RESPONSE_LOGIC_ERROR);
            return expect(response.body).equal(RESPONSE_LOGIC_ERROR.body);
        })

        it('always should return body with order id which is the result id (1)', () => {
            var response = theModule._generateResponse(RESPONSE);            
            return expect(response.body.orderId).equal(RESPONSE.body.resultId);
        })
        it('always should return body with order id which is the result id (2)', () => {
            var response = theModule._generateResponse(RESPONSE_HTTP_ERROR);
            return expect(response.body.orderId).equal(RESPONSE_HTTP_ERROR.body.resultId);
        })
        it('always should return body with order id which is the result id (3)', () => {
            var response = theModule._generateResponse(RESPONSE_LOGIC_ERROR);
            return expect(response.body.orderId).equal(RESPONSE_LOGIC_ERROR.body.resultId);
        })        
    })
    
})
