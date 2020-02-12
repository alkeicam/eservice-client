const themodule = require('./src/index');

var options = {
    apiBaseURL: 'https://apiuat.test.secure.eservice.com.pl',
    tokenEndpoint: '/token',
    merchantId: '176689',
    password: '56789',
    allowOriginUrl: 'xcft.io',
    channel: 'ECOM',
    currency: 'PLN',
    country: 'PL',
    blikPaymentSolutionId: 2222,
    merchantNotificationUrl: 'https://xcft.io/status'
}
themodule.configure(options);

themodule.payWithBLIKSingleItem(15.90, 777908, 'maciej.grula@gmail.com', 'customerId', 'Zakup', 'receivableId').catch(error=>{
    console.error(error);
});
