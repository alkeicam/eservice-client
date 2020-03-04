const themodule = require('./src/index');

var options = {
    apiBaseURL: 'https://apiuat.test.secure.eservice.com.pl',
    tokenEndpoint: '/token',
    merchantId: '--id--',
    password: '--pass--',
    allowOriginUrl: 'https://mydomain.com',
    channel: 'ECOM',
    currency: 'PLN',
    country: 'PL',
    blikPaymentSolutionId: 2222,
    merchantNotificationUrl: 'https://mydomain.com/status'
}
themodule.configure(options);

// themodule.payWithBLIKSingleItem(15.90, 777908, 'john.legend@gmail.com', 'customerId', 'Zakup', 'receivableId').catch(error=>{
//     console.error(error);
// });

var googlePayToken = JSON.stringify({"signature":"MEQCIFLrdB1q+4i823yNoSJKb/74lSW9w0soc/X3tWpJokWEAiAkOj+jx/V8WadwGjtQ2J80oYTahcmA7r6ByqUAA8NJzw\u003d\u003d","protocolVersion":"ECv1","signedMessage":"{\"encryptedMessage\":\"y4ZraczZhbD3kqf5pbehsMusIYmSh0R8a7JIgKNihI3v/zT3KTfpB8XjmlVtuK89o9rGFGJH2o3G0PWdV3J7+gj8RUJ8q3LhrySXbhiqBW23QL0X2d6aPOxj336YgugKH1OUgcn6+M0E08OnKEXuHuN++vZVctPDg942lv4SGxy9xvLlkShMJn39n2y2JPS758p1dCbtASufon37ax7KQ7kLv8oNqTFa0CArlqw2B478Oi+dHpiSHqavV8cstcOac80Wh6liEVh3ArAuPirBzO0dTVOB2ICeEEjPiyCrDuUaCtD9aVTdDYnWQuxCXw2SaGYbNJ2g3ZbdsUIZiod9FwLMCI3WOdWan+Euk56uKu1jsiLcN4IaoFlWGfS56jYfdx0g93KXRMBV/2pCUg1q6HnRpJgE9QdiZ9yDQpsuwugkYCEOQuAY22A7GuBHzgdLDg\\u003d\\u003d\",\"ephemeralPublicKey\":\"BFYla1MFmEQEJF1O9HUTUWzNwzvssSYp/6TfeuHTj5tia/0GHRPO/1Mrrv58n3qhJ10q9QlL9yT2jHmul02gYFg\\u003d\",\"tag\":\"cmgAVjh9ttfzvt7z3wFwYmbASt9TGFtCwwj2H9gtk+Q\\u003d\"}"});

//var gpaytokencheat = "%7B%22signature%22%3A%22MEUCIH6thNd2jNh1DBCCFXOR%2FGO0g%2FicVATNEsTXDT378tJcAiEAo4hZyyh9ZA4Ro0h1nK2UdEI8UdujkCmiE8h1kzKYks0%5Cu003d%22%2C%22protocolVersion%22%3A%22ECv1%22%2C%22signedMessage%22%3A%22%7B%5C%22encryptedMessage%5C%22%3A%5C%22CRqIgvZdE1TR8XpHov3PThrHpNFhVdDJ8ImJCoQ2mktrmkSLP7QElmleFdkZoogDiP5jSh6SLxyd3330ZQoW5PqIHLlBjw%2FTpXD07WE74aC6XhOZix8DCEs%2F2yzSKzNc2gf0wcF4njTKMG%2BAJaTCQGI%2B8B1U0NzxWmOJsRwmyLrP28xIPAilEi%2F9%2FC7IwHvNj3RJ7XFa1C3Cosw4ijoJer%2BESIWytEw2g8Tv%2BrycFtjaPeE1BlqHbye2Why8pwn1gwhpSGd7t8h1Dx4naF4pDHFEGcBghiz6omLaqb%2FTxlmQKFtlPHkpwqmPwbSD0CjKBKvVr800%2BRfPSLxPYDaov5%2Bk7mzmjLyuSnw4dnUBam5ln2wFT%2Fuc1hDRBksLcmaL7cwGZiS3%2F3QEuSZJU6ODtJPiOP1p%2BDD7uahcXmEAgIutl0t4cg8s1Re88FOG8%2F9Zwg%5C%5Cu003d%5C%5Cu003d%5C%22%2C%5C%22ephemeralPublicKey%5C%22%3A%5C%22BBdddZR0IcMCYfanKGizq%2F4JtNovtx3ddwTivPPvk%2FSOWGzrHOxYhBJesr1Y95N9DPhPejk%2BL%2B%2Fq8Z3Ze8GnDVU%5C%5Cu003d%5C%22%2C%5C%22tag%5C%22%3A%5C%22Q%2FQSAHjYXNxg%2BL50hyTTHmaH6x0hMnDcJ%2BDH1Qsh8pQ%5C%5Cu003d%5C%22%7D%22%7D"
themodule.payWithGooglePaySingleItem(1.0, googlePayToken, 'maciej.legend@gmail.com', 'customerId', 'Zakup', 'receivableId').then(result=>{
    console.log(result);
}).catch(error=>{
    console.error(error);
})

