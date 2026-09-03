import type { Destination } from '../types';

export const destinations: Destination[] = [
  {
    id: 'tokyo', name: 'Tokyo', country: 'Japan', continent: 'Asia',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    description: "A mesmerizing mix of the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.",
    imageQuery: 'tokyo city skyline night', tags: ['city', 'culture', 'food'], bestTimeToVisit: 'March to May (Spring) or September to November (Autumn)',
    famousPlaces: [
      { id: 'shibuya', name: 'Shibuya Crossing', description: 'The rumored busiest intersection in the world.', imageQuery: 'shibuya crossing', category: 'Landmark' },
      { id: 'senso-ji', name: 'Senso-ji', description: 'Tokyo’s oldest and most significant Buddhist temple.', imageQuery: 'sensoji temple', category: 'Temple' },
      { id: 'meiji', name: 'Meiji Shrine', description: 'A Shinto shrine dedicated to the deified spirits of Emperor Meiji.', imageQuery: 'meiji shrine', category: 'Temple' }
    ]
  },
  {
    id: 'paris', name: 'Paris', country: 'France', continent: 'Europe',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    description: "The global center for art, fashion, gastronomy, and culture, featuring a 19th-century cityscape.",
    imageQuery: 'paris eiffel tower sunset', tags: ['city', 'culture', 'food'], bestTimeToVisit: 'April to June or October to early November',
    famousPlaces: [
      { id: 'louvre', name: 'Louvre Museum', description: 'The world’s largest art museum and a historic monument.', imageQuery: 'louvre museum', category: 'Museum' },
      { id: 'eiffel', name: 'Eiffel Tower', description: 'The iconic wrought-iron lattice tower on the Champ de Mars.', imageQuery: 'eiffel tower', category: 'Landmark' },
      { id: 'montmartre', name: 'Montmartre', description: 'A large hill in Paris known for its artistic history.', imageQuery: 'montmartre paris', category: 'Neighborhood' }
    ]
  },
  {
    id: 'bali', name: 'Bali', country: 'Indonesia', continent: 'Asia',
    coordinates: { lat: -8.4095, lng: 115.1889 },
    description: "A picturesque Indonesian island known for its forested volcanic mountains, iconic rice paddies, and beaches.",
    imageQuery: 'bali rice terraces', tags: ['beach', 'nature', 'culture'], bestTimeToVisit: 'April to October (Dry season)',
    famousPlaces: [
      { id: 'uluwatu', name: 'Uluwatu Temple', description: 'A Balinese Hindu sea temple located in Uluwatu.', imageQuery: 'uluwatu temple', category: 'Temple' },
      { id: 'ubud', name: 'Ubud Monkey Forest', description: 'A natural sanctuary for the Balinese long-tailed monkey.', imageQuery: 'ubud monkey forest', category: 'Nature' },
      { id: 'tegallalang', name: 'Tegallalang Rice Terrace', description: 'Famous scenic rice terraces in Ubud.', imageQuery: 'tegallalang rice terrace', category: 'Nature' }
    ]
  },
  {
    id: 'cape-town', name: 'Cape Town', country: 'South Africa', continent: 'Africa',
    coordinates: { lat: -33.9249, lng: 18.4241 },
    description: "A port city on South Africa’s southwest coast, crowned by the imposing Table Mountain.",
    imageQuery: 'cape town table mountain', tags: ['nature', 'beach', 'adventure'], bestTimeToVisit: 'March to May or September to November',
    famousPlaces: [
      { id: 'table-mountain', name: 'Table Mountain', description: 'A flat-topped mountain forming a prominent landmark.', imageQuery: 'table mountain', category: 'Nature' },
      { id: 'cape-point', name: 'Cape Point', description: 'A spectacular promontory at the southeast corner of the Cape Peninsula.', imageQuery: 'cape point', category: 'Nature' },
      { id: 'kirstenbosch', name: 'Kirstenbosch Gardens', description: 'Acclaimed botanical garden nestled at the eastern foot of Table Mountain.', imageQuery: 'kirstenbosch botanical gardens', category: 'Park' }
    ]
  },
  {
    id: 'new-york', name: 'New York', country: 'United States', continent: 'Americas',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    description: "The city that never sleeps, known for its towering skyscrapers, Broadway shows, and diverse culinary scene.",
    imageQuery: 'new york city skyline central park', tags: ['city', 'culture', 'food'], bestTimeToVisit: 'April to June or September to early November',
    famousPlaces: [
      { id: 'central-park', name: 'Central Park', description: 'An urban park in Manhattan offering an oasis in the city.', imageQuery: 'central park', category: 'Park' },
      { id: 'statue-liberty', name: 'Statue of Liberty', description: 'A colossal neoclassical sculpture on Liberty Island.', imageQuery: 'statue of liberty', category: 'Landmark' },
      { id: 'times-square', name: 'Times Square', description: 'A major commercial intersection and entertainment center.', imageQuery: 'times square night', category: 'Landmark' }
    ]
  },
  {
    id: 'sydney', name: 'Sydney', country: 'Australia', continent: 'Oceania',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    description: "The capital of New South Wales, distinguished by its harbourfront Sydney Opera House, with a distinctive sail-like design.",
    imageQuery: 'sydney opera house harbour', tags: ['city', 'beach', 'adventure'], bestTimeToVisit: 'September to November or March to May',
    famousPlaces: [
      { id: 'opera-house', name: 'Sydney Opera House', description: 'A multi-venue performing arts centre in Sydney.', imageQuery: 'sydney opera house', category: 'Landmark' },
      { id: 'bondi', name: 'Bondi Beach', description: 'One of the world’s most famous beaches.', imageQuery: 'bondi beach sydney', category: 'Beach' },
      { id: 'harbour-bridge', name: 'Sydney Harbour Bridge', description: 'A steel through arch bridge across Sydney Harbour.', imageQuery: 'sydney harbour bridge', category: 'Landmark' }
    ]
  },
  {
    id: 'kyoto', name: 'Kyoto', country: 'Japan', continent: 'Asia',
    coordinates: { lat: 35.0116, lng: 135.7681 },
    description: "Once the capital of Japan, famous for its numerous classical Buddhist temples, gardens, and traditional wooden houses.",
    imageQuery: 'kyoto japan temple', tags: ['culture', 'nature', 'food'], bestTimeToVisit: 'March to May (Cherry blossoms) or October to November',
    famousPlaces: [
      { id: 'fushimi', name: 'Fushimi Inari Taisha', description: 'Famous for its thousands of vermilion torii gates.', imageQuery: 'fushimi inari', category: 'Temple' },
      { id: 'kinkaku', name: 'Kinkaku-ji (Golden Pavilion)', description: 'A Zen temple whose top two floors are covered in gold leaf.', imageQuery: 'kinkakuji kyoto', category: 'Temple' },
      { id: 'arashiyama', name: 'Arashiyama Bamboo Grove', description: 'A mesmerizing grove of towering bamboo.', imageQuery: 'arashiyama bamboo grove', category: 'Nature' }
    ]
  },
  {
    id: 'dubai', name: 'Dubai', country: 'UAE', continent: 'Asia',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    description: "A city known for luxury shopping, ultramodern architecture, and a lively nightlife scene.",
    imageQuery: 'dubai burj khalifa', tags: ['city', 'adventure', 'culture'], bestTimeToVisit: 'November to March',
    famousPlaces: [
      { id: 'burj-khalifa', name: 'Burj Khalifa', description: 'The tallest building in the world.', imageQuery: 'burj khalifa', category: 'Landmark' },
      { id: 'palm-jumeirah', name: 'Palm Jumeirah', description: 'An artificial offshore island in Dubai.', imageQuery: 'palm jumeirah', category: 'Neighborhood' },
      { id: 'dubai-mall', name: 'The Dubai Mall', description: 'One of the world’s largest shopping malls.', imageQuery: 'dubai mall', category: 'Market' }
    ]
  },
  {
    id: 'london', name: 'London', country: 'United Kingdom', continent: 'Europe',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    description: "The capital of England, a 21st-century city with history stretching back to Roman times.",
    imageQuery: 'london big ben thames', tags: ['city', 'culture', 'food'], bestTimeToVisit: 'May to August',
    famousPlaces: [
      { id: 'tower-london', name: 'Tower of London', description: 'A historic castle on the north bank of the River Thames.', imageQuery: 'tower of london', category: 'Landmark' },
      { id: 'british-museum', name: 'The British Museum', description: 'Dedicated to human history, art and culture.', imageQuery: 'british museum london', category: 'Museum' },
      { id: 'london-eye', name: 'London Eye', description: 'A giant observation wheel offering spectacular city views.', imageQuery: 'london eye', category: 'Landmark' }
    ]
  },
  {
    id: 'rome', name: 'Rome', country: 'Italy', continent: 'Europe',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    description: "The capital city of Italy, known for its nearly 3,000 years of globally influential art, architecture, and culture.",
    imageQuery: 'rome colosseum sunset', tags: ['culture', 'city', 'food'], bestTimeToVisit: 'April to June or September to October',
    famousPlaces: [
      { id: 'colosseum', name: 'Colosseum', description: 'An oval amphitheatre in the centre of the city of Rome.', imageQuery: 'colosseum rome', category: 'Landmark' },
      { id: 'trevi', name: 'Trevi Fountain', description: 'A breathtaking Baroque fountain in the Trevi district.', imageQuery: 'trevi fountain', category: 'Landmark' },
      { id: 'pantheon', name: 'Pantheon', description: 'A former Roman temple, now a Catholic church.', imageQuery: 'pantheon rome', category: 'Temple' }
    ]
  },
  {
    id: 'barcelona', name: 'Barcelona', country: 'Spain', continent: 'Europe',
    coordinates: { lat: 41.3851, lng: 2.1734 },
    description: "The cosmopolitan capital of Spain’s Catalonia region, known for its art and architecture.",
    imageQuery: 'barcelona sagrada familia', tags: ['city', 'culture', 'beach'], bestTimeToVisit: 'May to June or September to October',
    famousPlaces: [
      { id: 'sagrada', name: 'La Sagrada Familia', description: 'A large unfinished Roman Catholic minor basilica.', imageQuery: 'sagrada familia', category: 'Landmark' },
      { id: 'park-guell', name: 'Park Güell', description: 'A public park system composed of gardens and architectonic elements.', imageQuery: 'park guell', category: 'Park' },
      { id: 'gothic-quarter', name: 'Gothic Quarter', description: 'The historic centre of the old city of Barcelona.', imageQuery: 'gothic quarter', category: 'Neighborhood' }
    ]
  },
  {
    id: 'istanbul', name: 'Istanbul', country: 'Turkey', continent: 'Europe',
    coordinates: { lat: 41.0082, lng: 28.9784 },
    description: "A major city in Turkey that straddles Europe and Asia across the Bosphorus Strait.",
    imageQuery: 'istanbul hagia sophia', tags: ['culture', 'city', 'food'], bestTimeToVisit: 'April to May or September to October',
    famousPlaces: [
      { id: 'hagia-sophia', name: 'Hagia Sophia', description: 'A Late Antique place of worship in Istanbul.', imageQuery: 'hagia sophia', category: 'Landmark' },
      { id: 'blue-mosque', name: 'The Blue Mosque', description: 'An Ottoman-era historical imperial mosque.', imageQuery: 'blue mosque istanbul', category: 'Temple' },
      { id: 'grand-bazaar', name: 'Grand Bazaar', description: 'One of the largest and oldest covered markets in the world.', imageQuery: 'grand bazaar', category: 'Market' }
    ]
  },
  {
    id: 'vancouver', name: 'Vancouver', country: 'Canada', continent: 'Americas',
    coordinates: { lat: 49.2827, lng: -123.1207 },
    description: "A bustling west coast seaport in British Columbia, among Canada’s most ethnically diverse cities.",
    imageQuery: 'vancouver canada mountains city', tags: ['nature', 'adventure', 'city'], bestTimeToVisit: 'June to September',
    famousPlaces: [
      { id: 'stanley-park', name: 'Stanley Park', description: 'A magnificent green oasis in the midst of the urban landscape.', imageQuery: 'stanley park vancouver', category: 'Park' },
      { id: 'capilano', name: 'Capilano Suspension Bridge', description: 'A simple suspension bridge crossing the Capilano River.', imageQuery: 'capilano suspension bridge', category: 'Nature' },
      { id: 'granville', name: 'Granville Island', description: 'A peninsula and shopping district known for its public market.', imageQuery: 'granville island', category: 'Market' }
    ]
  },
  {
    id: 'queenstown', name: 'Queenstown', country: 'New Zealand', continent: 'Oceania',
    coordinates: { lat: -45.0312, lng: 168.6626 },
    description: "Renowned for adventure sports, it's also a base for exploring the region's historic mining towns.",
    imageQuery: 'queenstown new zealand lake', tags: ['adventure', 'nature'], bestTimeToVisit: 'December to February (Summer) or June to August (Winter sports)',
    famousPlaces: [
      { id: 'milford', name: 'Milford Sound', description: 'A fiord in the southwest of New Zealand’s South Island.', imageQuery: 'milford sound', category: 'Nature' },
      { id: 'remarkables', name: 'The Remarkables', description: 'A mountain range and skifield in Otago.', imageQuery: 'the remarkables queenstown', category: 'Nature' },
      { id: 'skyline', name: 'Skyline Gondola', description: 'Take a scenic ride to enjoy panoramic views of the region.', imageQuery: 'skyline queenstown', category: 'Adventure' }
    ]
  },
  {
    id: 'singapore', name: 'Singapore', country: 'Singapore', continent: 'Asia',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    description: "A global financial center with a tropical climate and multicultural population.",
    imageQuery: 'singapore gardens by the bay', tags: ['city', 'nature', 'food'], bestTimeToVisit: 'February to April',
    famousPlaces: [
      { id: 'gardens-bay', name: 'Gardens by the Bay', description: 'A nature park spanning 101 hectares in the Central Region.', imageQuery: 'gardens by the bay singapore', category: 'Nature' },
      { id: 'marina-bay', name: 'Marina Bay Sands', description: 'An integrated resort fronting Marina Bay.', imageQuery: 'marina bay sands', category: 'Landmark' },
      { id: 'botanic', name: 'Singapore Botanic Gardens', description: 'A 163-year-old tropical garden located at the fringe of the orchard road shopping district.', imageQuery: 'singapore botanic gardens', category: 'Park' }
    ]
  },
  {
    id: 'jaipur', name: 'Jaipur', country: 'India', continent: 'Asia',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    description: "The vibrant 'Pink City' of Rajasthan, celebrated for its majestic palaces, ancient hill forts, and royal heritage.",
    imageQuery: 'jaipur hawa mahal rajasthan', tags: ['culture', 'city', 'food'], bestTimeToVisit: 'October to March (Winter)',
    famousPlaces: [
      { id: 'hawa-mahal', name: 'Hawa Mahal', description: 'The iconic Palace of Winds with 953 intricately carved windows.', imageQuery: 'hawa mahal jaipur', category: 'Landmark' },
      { id: 'amer-fort', name: 'Amer Fort', description: 'A magnificent hilltop fort overlooking Maota Lake.', imageQuery: 'amer fort jaipur', category: 'Landmark' },
      { id: 'city-palace', name: 'City Palace', description: 'A stunning complex of courtyards, gardens, and royal Rajasthani buildings.', imageQuery: 'city palace jaipur', category: 'Landmark' }
    ]
  },
  {
    id: 'goa', name: 'Goa', country: 'India', continent: 'Asia',
    coordinates: { lat: 15.2993, lng: 74.1240 },
    description: "India's coastal paradise famous for sun-kissed Arabian Sea beaches, Portuguese heritage, and vibrant nightlife.",
    imageQuery: 'goa beach sunset palms', tags: ['beach', 'nature', 'adventure'], bestTimeToVisit: 'November to February',
    famousPlaces: [
      { id: 'palolem', name: 'Palolem Beach', description: 'A scenic crescent beach lined with swaying coconut palms.', imageQuery: 'palolem beach goa', category: 'Beach' },
      { id: 'aguada', name: 'Fort Aguada', description: 'A 17th-century Portuguese fort and lighthouse overlooking the ocean.', imageQuery: 'fort aguada goa', category: 'Landmark' },
      { id: 'dudhsagar', name: 'Dudhsagar Falls', description: 'A majestic four-tiered waterfall cascading through lush western ghats.', imageQuery: 'dudhsagar waterfall', category: 'Nature' }
    ]
  }
];
