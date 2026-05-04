// Fog of World — visited countries and city highlights.
// ISO 3166-1 numeric codes match the TopoJSON countries-110m feature IDs.
// Run `node scripts/parseFow.js` after dropping your FoW export into the repo root
// to auto-populate this file from your app's data.

const fowData = {
  visitedCountryCodes: [
    158, // Taiwan
    840, // United States
    702, // Singapore
    392, // Japan
    344, // Hong Kong
    410, // South Korea
    124, // Canada
    764, // Thailand
    360, // Indonesia
    458, // Malaysia
  ],
  stats: {
    countries: 10,
    cities: 22,
  },
  highlights: [
    { name: 'Taipei',        lat: 25.033,  lng: 121.565 },
    { name: 'San Francisco', lat: 37.775,  lng: -122.419 },
    { name: 'Singapore',     lat: 1.352,   lng: 103.820 },
    { name: 'Tokyo',         lat: 35.676,  lng: 139.650 },
    { name: 'Kyoto',         lat: 35.012,  lng: 135.768 },
    { name: 'Seoul',         lat: 37.566,  lng: 126.978 },
    { name: 'Hong Kong',     lat: 22.320,  lng: 114.170 },
    { name: 'Bangkok',       lat: 13.756,  lng: 100.502 },
    { name: 'Bali',          lat: -8.339,  lng: 115.092 },
    { name: 'Kuala Lumpur',  lat: 3.140,   lng: 101.687 },
    { name: 'Vancouver',     lat: 49.283,  lng: -123.121 },
  ],
}

module.exports = fowData
