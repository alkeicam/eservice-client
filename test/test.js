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
        let LANDING_PAGE_URL = 'https://some.landing.page?with=params';
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
        let GOOGLE_PAY_TOKEN = JSON.stringify({ 
            "signature": "MEUCIQDUnxiEWgp953lWGdRrXjDuP+mwUkB+uVkhyVL1/d9yXAIgUQbmPQzxuBDOdz72by6vwwFD+LHett6nY0HLjRionjA\u003d", 
            "protocolVersion": "ECv1", 
            "signedMessage": "{\"encryptedMessage\":\"Bs26e4q/iDNwwpgLRD+CDitVyygjxnwNF4r0CbAitFLcEkDPZ/8gEk7iYrcejXf+OlLnGaBzT/wOfRZoJ5zquteNCv2rFLUpK+7ClBKQ6l30P9NUGs4yAaidgIZXOgcN6pj2T5AiP0frss7eJKPNWTVVuatr2f1mIVyrma5GL4vZjBleggEzIUu1dVCTmCJJTKk63SYDUxDukOd2AIOykQddvLge1q4DHhLYd9NVLYK24TaAgk6un7sNJICPp8xQcPx1BQ56REtftLkVxPmPjyrZmNlpH9uw7voGt/ZRBVTlXlsk+DQf8Yq3A0BQWlC5fqd7FRxB8w7nP9XrophnWN6/b9jcF6RC6WQ1s3HCGQlVaMEStD6+IzYsm2C3LMztUuIFKy5L7bhQvS1t2LmCLzTU/en34sZ+pSPjRtut63XyTpFsxC1CFEB+YrFidRyJ3Q\\u003d\\u003d\",\"ephemeralPublicKey\":\"BHoCnrEN4eTH23Ds+R1Gq8LQMvJyGjl2iaqBOr0q3PtbGVwmus7JWTZ/SeapdYoeVa7PgqHfsLIL1TjmT92j91M\\u003d\",\"tag\":\"rsx9d9BmXAgWNgDNgHy0/Tt/Awx/J1V65MTwyFyyeQE\\u003d\"}" 
        });
        let EMAIL = 'some@email.com';
        let C_EXT_ID = '#excid';
        let DESCRIPTION = 'some description';
        let TRANSACTION_ID = '#tid';
        let LANDING_PAGE_URL = 'https://some.landing.page?with=params';
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
        let DEVICE = {
            customerBrowser: {"browserAcceptHeader":"application/json","browserJavaEnabled":false,"browserIP":"122.97.16.122","browserLanguage":"zh-CN","browserColorDepth":"24","browserScreenHeight":"1080","browserScreenWidth":"1920","browserTZ":"-480","challengeWindowSize":"05","browserJavascriptEnabled":true},
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
            userDevice: 'MOBILE'
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
        it('make sure that google token is passed on and is encoded', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);
                
                return expect(call.args[1].data.specinCCWalletToken).equal(GOOGLE_PAY_TOKEN);
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
        it('make sure that landingPageURL is used when provided', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID, LANDING_PAGE_URL).then(()=>{
                call = ss.getCall(0);
                
                return expect(call.args[1].data.merchantLandingPageUrl).equal(LANDING_PAGE_URL);
            })
        })   
        it('make sure that userDevice is used when provided', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID, LANDING_PAGE_URL, DEVICE).then(()=>{
                call = ss.getCall(0);
                
                return expect(call.args[1].data.userDevice).equal(DEVICE.userDevice);
            })
        })
        it('make sure that userAgent is used when provided', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID, LANDING_PAGE_URL, DEVICE).then(()=>{
                call = ss.getCall(0);
                
                return expect(call.args[1].data.userAgent).equal(DEVICE.userAgent);
            })
        }) 
        it('make sure that customerBrowser is used when provided', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID, LANDING_PAGE_URL, DEVICE).then(()=>{
                call = ss.getCall(0);
                
                return expect(call.args[1].data.customerBrowser).equal(DEVICE.customerBrowser);
            })
        }) 
    })

    describe('payWithApplePaySingleItem', () => {
        let AMOUNT = 10;
        let APPLE_PAY_TOKEN = JSON.stringify({"token": {
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
          }});
        let APPLE_PAY_TOKEN_INVALID_1 = JSON.stringify({"token": {            
            "paymentMethod": {
              "displayName": "Visa 6041",
              "network": "Visa",
              "type": "debit"
            },
            "transactionIdentifier": "0415963A4A66EC63FFD29027594337802856D020F98BA6D00E5C46B7657CE813"
          }});
        let APPLE_PAY_TOKEN_INVALID_2 = JSON.stringify({"token": {
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
            "transactionIdentifier": "0415963A4A66EC63FFD29027594337802856D020F98BA6D00E5C46B7657CE813"
          }});
          let APPLE_PAY_TOKEN_INVALID_3 = JSON.stringify({"token": {
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
            }
          }});
        let EMAIL = 'some@email.com';
        let C_EXT_ID = '#excid';
        let DESCRIPTION = 'some description';
        let TRANSACTION_ID = '#tid';
        let LANDING_PAGE_URL = 'https://some.landing.page?with=params';
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
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).should.be.fulfilled;            
        })
        it('make sure that apple token is passed on and is encoded', () => {
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);                                           
                return expect(call.args[1].data.specinCCWalletToken).equal(APPLE_PAY_TOKEN);
            })
        })        
        it('make sure that eservice token value is passed on', () => {
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);                  
                return expect(call.args[1].data.token).equal(RESPONSE_TOKEN.token);
            })
        })
        
        it('make sure that merchantId is passed on', () => {
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.merchantId).equal(OPTIONS.merchantId);
            })
        })
        it('make sure that amount is passed on', () => {
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.amount).equal(AMOUNT);
            })
        })
        it('make sure that transaction is passed', () => {
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[1].data.merchantTxId).equal(TRANSACTION_ID);
            })
        })        
        it('make sure that proper wallet type is passed', () => {
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);
                return expect(call.args[1].data.specinCCWalletId).equal(504);
            })
        })  
        it('make sure that only valid tokens are accepted', () => {
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN_INVALID_1, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).should.be.rejectedWith('Invalid Apple Pay Token provided. Make sure that paymentData, paymentMethod, transactionIdentifier are provided');
        })   
        it('make sure that only valid tokens are accepted 2', () => {
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN_INVALID_2, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).should.be.rejectedWith('Invalid Apple Pay Token provided. Make sure that paymentData, paymentMethod, transactionIdentifier are provided');
        }) 
        it('make sure that only valid tokens are accepted 3', () => {
            return theModule.payWithApplePaySingleItem(AMOUNT, APPLE_PAY_TOKEN_INVALID_3, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).should.be.rejectedWith('Invalid Apple Pay Token provided. Make sure that paymentData, paymentMethod, transactionIdentifier are provided');
        })             
    })

    describe('payWithPaymentForm', () => {
        let AMOUNT = 10;
        
        let EMAIL = 'some@email.com';
        let C_EXT_ID = '#excid';
        let DESCRIPTION = 'some description';
        let TRANSACTION_ID = '#tid';
        let LANDING_PAGE_URL = 'https://some.landing.page?with=params';
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
        let RESPONSE_3DS_REDIRECT = {
            status: {
                code: 200,
                message: 'OK'
            },
            body: {
                result: 'redirection',
                resultId: 'f06196f5-b4f6-4537-b9d5-9d48a99f1349',
                merchantId: '176611',
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
        it('should return redirect url on redirection response', () => {            
            var response = theModule._handleResponse(RESPONSE_3DS_REDIRECT);
            return expect(response.redirectionUrl).equal(RESPONSE_3DS_REDIRECT.body.redirectionUrl);
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
