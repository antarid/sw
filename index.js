const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const Subscription = require('./subscription');
const events = require('./eventList');
const _ = require('lodash');

const app = express();

app.use(bodyParser.json());

const publicVapidKey =
  'BIlBe7nPK0jRSLu2yF4WCGhpLDoJgxjwrohtFkYyzkseUfCy3mw7q06L5sOS2ZS-rdz-9MiAK2B-9rudY_zMtEU';
const privateVapidKey = 'fRwJTrfWzu_jxPp4FCSMTiNdgleW0rAgMEsvHbITGm4';

webPush.setVapidDetails(
  'mailto:text@test.com',
  publicVapidKey,
  privateVapidKey
);

const inSomeDays = (eventDate, days) =>
  new Date(eventDate).getTime() >
    Date.now() + days * 24 * 3600 * 1000 - 12 * 3600 * 1000 &&
  new Date(eventDate).getTime() <
    Date.now() + days * 24 * 3600 * 1000 + 12 * 3600 * 1000;

const remindUsers = async () => {
  const eventsByDate = {
    3: events.filter(event => inSomeDays(event.date, 3)),
    7: events.filter(event => inSomeDays(event.date, 7)),
    14: events.filter(event => inSomeDays(event.date, 14))
  };

  let subscriptions = await Promise.all([
    Subscription.find({days: 3}),
    Subscription.find({days: 7}),
    Subscription.find({days: 14})
  ]);

  subscriptions = subscriptions.map(subscription =>
    subscription.map(subscr => subscr.subscription)
  );

  const subscriptionsByDate = {
    3: subscriptions[0],
    7: subscriptions[1],
    14: subscriptions[2]
  };

  console.log(eventsByDate, subscriptionsByDate);

  _.forEach(subscriptionsByDate, (subscriptions, date) => {
    _.forEach(subscriptions, subscription => {
      _.forEach(eventsByDate[date], event => {
        webPush.sendNotification(
          JSON.parse(subscription),
          JSON.stringify({title: 'Visit ' + event.name})
        );
        console.log(subscription, event.name);
      });
    });
  });
};

app.use(express.static(path.join(__dirname, 'client')));

app.post('/subscribe', async (req, res) => {
  const {subscription, days} = req.body;
  const oldSubscription = await Subscription.findOne({
    subscription: JSON.stringify(subscription),
    days
  });
  if (oldSubscription) {
    res.status(201).json({message: 'already subscribed'});
  } else {
    const newSubscription = new Subscription({
      subscription: JSON.stringify(subscription),
      days
    });
    await newSubscription.save();
    res.status(200).json({});
  }
});

const port = process.env.PORT || 4999;

// app.listen(port, () => console.log(`on ${port} port`));

mongoose
  .connect(
    'mongodb://admin:helloworld123@ds117164.mlab.com:17164/yandexsubscriptions',
    {useNewUrlParser: true}
  )
  .then(() => {
    app.listen(port, () => {
      console.log('server is working on port: ' + port);
      setInterval(remindUsers, 24 * 3600 * 1000);
    });
  })
  .catch(err => {
    throw err;
  });
