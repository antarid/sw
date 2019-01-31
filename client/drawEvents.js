const events = [
  {
    name: 'React Iran',
    link: 'http://reactiran.com/',
    place: 'Tehran, Iran',
    date: 'January 31 2019'
  },
  {
    name: 'FFS Conf Down Under',
    link: 'https://ffsconfdownunder.com/',
    place: 'Melbourne, Australia',
    date: 'February 2 2019'
  },
  {
    name: 'Interaction Design Education Summit (IxDA)',
    link: 'https://edusummit.ixda.org/',
    place: 'Seattle, WA, U.S.A.',
    date: 'February 3 2019'
  },
  {
    name: 'Interaction (IxDA)',
    link: 'https://interaction19.ixda.org/',
    place: 'Seattle, WA, U.S.A.',
    date: 'February 3 2019'
  },
  {
    name: 'Pause Fest',
    link: 'https://pausefest.com.au/',
    place: 'Melbourne, Australia',
    date: 'February 6 2019'
  },
  {
    name: `c't <webdev>`,
    link: 'https://ctwebdev.de/',
    place: 'Köln, Germany',
    date: 'February 6 2019'
  },
  {
    name: 'JSConf Hawaii',
    link: 'https://www.jsconfhi.com/',
    place: 'Hawaiʻi, U.S.A.',
    date: 'February 7 2019'
  }
];

window.onload = function() {
  drawEvents();
};

function drawEvents() {
  const eventList = document.createElement('div');
  eventList.classList.add('event-list');

  events
    .filter(event => new Date(event.date).getTime() > Date.now())
    .forEach(event => {
      const eventListItem = document.createElement('div');
      eventListItem.classList.add('event-list-item');

      const link = document.createElement('a');
      link.innerText = event.name;
      link.href = event.link;

      const place = document.createElement('div');
      place.classList.add('place');
      place.innerText = event.place;

      const date = document.createElement('div');
      date.classList.add('date');
      date.innerText = event.date;

      eventListItem.appendChild(link);
      eventListItem.appendChild(place);
      eventListItem.appendChild(date);

      eventList.appendChild(eventListItem);
    });

  const container = document.querySelector('.event-list-container');
  container.appendChild(eventList);
}
