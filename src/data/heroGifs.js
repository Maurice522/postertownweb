// Banner GIFs for the products page and the login page; one is picked at random per visit.
export const HERO_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3J4cnI1NXY3ZWV3ZHVwNHVuMmV4cmt2cTVrMmd6b2Z1cXR1MW92MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/lsUWq3SQ3NLYusKJ4O/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3J4cnI1NXY3ZWV3ZHVwNHVuMmV4cmt2cTVrMmd6b2Z1cXR1MW92MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4ajQEQgTHvKxNWGFCK/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bGdxMHE1MGttcmk5YzhvdDZkZGV0M2ptdWJkY3Q1N3c2b2d0a3kxdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/EjLTU9HAnnskywtJ9j/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGFvdHhhYzcxZzg4ZXRvMnlscGtldjZhaWo5MDE3MjN3dThzOHJnMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/h2GpJK6ljDJJnLDWUA/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmswN3ZkOWVhZmZsMHoxbXg4cDBva25qa3dya2cxZzhhdDNrNGttbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xLzOrO1e19V3q/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmswN3ZkOWVhZmZsMHoxbXg4cDBva25qa3dya2cxZzhhdDNrNGttbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/NeqRhamuUqjjxVGIqh/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MDBpeG13cTU5YXYycjN3NHZ1YzcwNWFlb3BwcGF2dWhkdHFqNWIybCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pGlDpwgWTLgBi/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGd4bXVjMWJncGVmYWRiOWFza2FxZTRydXhuNWYwajQ2bGswOTYyeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/aiaWqNYWKrYigXbupB/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGd4bXVjMWJncGVmYWRiOWFza2FxZTRydXhuNWYwajQ2bGswOTYyeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/rxRGdhd9qFb0dxOXfq/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGpkZnU2bnR1dHE5cXZmeWpmbjFiNng3a3piY2ZoeWF3MTdnNWVlZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5BHfgGCaULd5WHD8oO/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5kdXdjMGJvdmN4ZXdocmd2bGxveWZibXZhcHpseXo1OW0zYXZkMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DuVRadBbaX6A8/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG5kdXdjMGJvdmN4ZXdocmd2bGxveWZibXZhcHpseXo1OW0zYXZkMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4OvkwyzJ2cSdy/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnV3YWx2cm5yY2J4azkycjZ6eWJzOHd1c2hpMzhwZzZmZGplMTN0aSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/14pPFIQ1ToXriM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHlsMTRyY3g0NW4yOGlzd3c4aHd0MHU0bG50ZDQ2NG5pcm5zczN6aiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/10i8xVp7WmJrri/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2JtenVtbjR6MGdkMGZsN2oza3F6N2E2ZGIzczVqM3E3cjVjejltMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cCey0uDZ6Y09O/giphy.gif",
];

export const pickHeroGif = () => HERO_GIFS[Math.floor(Math.random() * HERO_GIFS.length)];
