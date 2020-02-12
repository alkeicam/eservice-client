const chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;
const expect = chai.expect;
chai.should();
const sinon = require('sinon');

const theModule = require('../');

describe('eService integration module', () => {
    describe('test', () => {
        
        beforeEach(() => {
        });
        afterEach(() => {
        });
        
        it('initial', () => {            
            return expect('a').equals('a');
        })      
    })
})
