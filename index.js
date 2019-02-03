const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client')));

const publicVapidKey =
  'BIlBe7nPK0jRSLu2yF4WCGhpLDoJgxjwrohtFkYyzkseUfCy3mw7q06L5sOS2ZS-rdz-9MiAK2B-9rudY_zMtEU';
const privateVapidKey = 'fRwJTrfWzu_jxPp4FCSMTiNdgleW0rAgMEsvHbITGm4';

webPush.setVapidDetails(
  'mailto:text@test.com',
  publicVapidKey,
  privateVapidKey
);

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  console.log('was on subscribe route');
  console.log(JSON.stringify(subscription).length);
  res.status(201).json({});

  const payload = JSON.stringify({title: 'Push test'});
  webPush.sendNotification(subscription, payload).catch(console.error);
});

app.listen(5000, () => console.log('on 5000 port'));
