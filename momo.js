var axios = require('axios');
var data = JSON.stringify({"amount":"5000","currency":"EUR","externalId":"123456780011","payer":{"partyIdType":"MSISDN","partyId":"46733123453"},"payerMessage":"Money sent to Fapshi","payeeNote":"Money recieved from user"});

var config = {
  method: 'post',
  url: 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
  headers: { 
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6IjQ2YjljZjlhLWFkNjgtNDZiZS1iMjNjLWQzNzQ1ZDU1ZjA1NCIsImV4cGlyZXMiOiIyMDIxLTA2LTE4VDA3OjQ3OjE2LjI2MiIsInNlc3Npb25JZCI6ImQ1MGI5ZmVmLTg5MzktNDQ3Zi04YjMzLTUwMzk3MmFkMDUzZSJ9.Wi0zYLCJrZPBCdmEjRsnp-I7ovpin78YOb0iBGtA_payK1lDThk2JKAYrCSaJVg8DGtwHKHljaTY52rwy9PlHfjwpikejyS5Sm7yP1ITf88Gf8hmsAY3F9UscJYWPQ48fEVn0TnlIvgVC2L5fzjwRH8YO8RwPSW0QKdBFOXgEmO6x1GdcofR4xV6FYd4LMhibHyu2WqET3D_EFL1-tMutCUMsxWq_JP1TTMc-lCDQ01qXBogJC6uRoH2D2DZ9SKuDxUECzjcvqyOfkQpzq2FrqPRI9IF3A0oOUPuP7I-gKoasmpuxQ5MXmYwx2hzizFCUPRTLBi8nOnv5SOLm8T2Kg', 
    'X-Reference-Id': '87e5c73b-e0a7-4401-b825-1f2015e45e19', 
    'X-Target-Enviroment': 'sandbox', 
    'Content-Type': 'application/json', 
    'Ocp-Apim-Subscription-Key': 'f9902660ca734003ba1e5b7216141f27'
  },
  data : data, 
  config:{}
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});