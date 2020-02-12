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
            "result": "success",
            "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
            "merchantId": "176689",
            "additionalDetails": {},
            "processingTime": 7            
        }
        beforeEach(() => {            
            ss = sinon.stub(theModule, '_invokeWithPost')
            ss.onCall(0).resolves({});
            ss.onCall(1).resolves({});

            hr = sinon.stub(theModule, '_handleResponse');
            hr.onCall(0).returns(RESPONSE_TOKEN);
            hr.onCall(0).returns(RESPONSE_PAYMENTS);
        });
        afterEach(() => {
            ss.restore();
            hr.restore();
        });

        it('should resolve on success', () => {
            return theModule.payWithBLIKSingleItem(AMOUNT, BLIK_CODE, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).should.be.fulfilled;            
        })
        it('make sure that blik code is passed on', () => {
            return theModule.payWithBLIKSingleItem(AMOUNT, BLIK_CODE, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                console.log(call.args);
                return expect(call.args[0]).contains(BLIK_CODE);
            })
        })
        it('make sure that amount is passed on', () => {
            return theModule.payWithBLIKSingleItem(AMOUNT, BLIK_CODE, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[0]).contains(AMOUNT);
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
            "result": "success",
            "resultId": "3b33ad50-f515-483b-ad7c-9ebbacdaeba5",
            "merchantId": "176689",
            "additionalDetails": {},
            "processingTime": 7            
        }
        beforeEach(() => {            
            ss = sinon.stub(theModule, '_invokeWithPost')
            ss.onCall(0).resolves({});
            ss.onCall(1).resolves({});

            hr = sinon.stub(theModule, '_handleResponse');
            hr.onCall(0).returns(RESPONSE_TOKEN);
            hr.onCall(0).returns(RESPONSE_PAYMENTS);
        });
        afterEach(() => {
            ss.restore();
            hr.restore();
        });

        it('should resolve on success', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).should.be.fulfilled;            
        })
        it('make sure that google token is passed on', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);
                console.log(call.args);
                return expect(call.args[0]).contains("specinCCWalletToken");
            })
        })
        it('make sure that amount is passed on', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(0);
                return expect(call.args[0]).contains(AMOUNT);
            })
        })
        it('make sure that proper wallet type is passed', () => {
            return theModule.payWithGooglePaySingleItem(AMOUNT, GOOGLE_PAY_TOKEN, EMAIL, C_EXT_ID, DESCRIPTION, TRANSACTION_ID).then(()=>{
                call = ss.getCall(1);
                return expect(call.args[0]).contains('502');
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

    
})
