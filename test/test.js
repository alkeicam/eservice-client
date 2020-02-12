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
