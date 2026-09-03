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
    id: 'goa', name: 'Goa', country: 'India', continent: 'Asia',
    coordinates: { lat: 15.2993, lng: 74.1240 },
    description: "India's coastal paradise famous for sun-kissed Arabian Sea beaches, Portuguese heritage, and vibrant nightlife.",
    imageQuery: 'india goa beach sunset palms', tags: ['beach', 'nature', 'adventure'], bestTimeToVisit: 'November to February',
    famousPlaces: [
      { id: 'palolem', name: 'Palolem Beach', description: 'A scenic crescent beach lined with swaying coconut palms.', imageQuery: 'india goa palolem beach', category: 'Beach' },
      { id: 'aguada', name: 'Fort Aguada', description: 'A 17th-century Portuguese fort and lighthouse overlooking the ocean.', imageQuery: 'india goa fort aguada lighthouse', category: 'Landmark' },
      { id: 'dudhsagar', name: 'Dudhsagar Falls', description: 'A majestic four-tiered waterfall cascading through lush western ghats.', imageQuery: 'india goa dudhsagar waterfall falls', category: 'Nature' }
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
    id: 'jaipur', name: 'Jaipur', country: 'India', continent: 'Asia',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    description: "The vibrant 'Pink City' of Rajasthan, celebrated for its majestic palaces, ancient hill forts, and royal heritage.",
    imageQuery: 'india jaipur hawa mahal rajasthan', tags: ['culture', 'city', 'food'], bestTimeToVisit: 'October to March (Winter)',
    famousPlaces: [
      { id: 'hawa-mahal', name: 'Hawa Mahal', description: 'The iconic Palace of Winds with 953 intricately carved windows.', imageQuery: 'india jaipur hawa mahal palace', category: 'Landmark' },
      { id: 'amer-fort', name: 'Amer Fort', description: 'A magnificent hilltop fort overlooking Maota Lake.', imageQuery: 'india jaipur amer amber fort', category: 'Landmark' },
      { id: 'city-palace', name: 'City Palace', description: 'A stunning complex of courtyards, gardens, and royal Rajasthani buildings.', imageQuery: 'india jaipur city palace', category: 'Landmark' }
    ]
  },
  {
    id: 'bangalore', name: 'Bengaluru', country: 'India', continent: 'Asia',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    description: "The vibrant Garden City and Silicon Valley of India, famed for pleasant weather, lush parks, craft breweries, and royal palaces.",
    imageQuery: 'india bangalore city skyline cubbon park', tags: ['city', 'nature', 'food'], bestTimeToVisit: 'October to March',
    famousPlaces: [
      { id: 'lalbagh', name: 'Lalbagh Botanical Garden', description: 'A 240-acre botanical garden housing a historic glasshouse.', imageQuery: 'lalbagh botanical garden bangalore', category: 'Park' },
      { id: 'bangalore-palace', name: 'Bangalore Palace', description: 'A Tudor-style royal palace with fortified towers and wood carvings.', imageQuery: 'bangalore palace karnataka', category: 'Landmark' },
      { id: 'cubbon-park', name: 'Cubbon Park', description: 'A landmark lung space in the heart of the city with lush flora.', imageQuery: 'cubbon park bangalore', category: 'Park' }
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
    id: 'agra', name: 'Agra', country: 'India', continent: 'Asia',
    coordinates: { lat: 27.1767, lng: 78.0081 },
    description: "Home to the world-famous Taj Mahal, magnificent Mughal fortresses, and centuries of immortal imperial history.",
    imageQuery: 'taj mahal agra india sunrise', tags: ['culture', 'city', 'food'], bestTimeToVisit: 'October to March',
    famousPlaces: [
      { id: 'taj-mahal', name: 'Taj Mahal', description: 'An ivory-white marble mausoleum on the south bank of the Yamuna river.', imageQuery: 'taj mahal agra wonder of the world', category: 'Landmark' },
      { id: 'agra-fort', name: 'Agra Fort', description: 'A historical red sandstone fortress of the Mughal dynasty.', imageQuery: 'agra fort red sandstone', category: 'Landmark' },
      { id: 'mehtab-bagh', name: 'Mehtab Bagh', description: 'A charbagh complex aligned perfectly with the Taj Mahal across the river.', imageQuery: 'mehtab bagh taj mahal sunset', category: 'Park' }
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
    id: 'varanasi', name: 'Varanasi', country: 'India', continent: 'Asia',
    coordinates: { lat: 25.3176, lng: 82.9739 },
    description: "The spiritual heart of India on the sacred banks of the Ganges, one of the oldest continuously inhabited cities on Earth.",
    imageQuery: 'varanasi india ganga ghat aarti', tags: ['culture', 'city', 'food'], bestTimeToVisit: 'November to February',
    famousPlaces: [
      { id: 'dashashwamedh', name: 'Dashashwamedh Ghat', description: 'The main and most spectacular ghat known for the mesmerizing evening Ganga Aarti.', imageQuery: 'dashashwamedh ghat varanasi aarti', category: 'Landmark' },
      { id: 'kashi-vishwanath', name: 'Kashi Vishwanath Temple', description: 'One of the most sacred Hindu temples dedicated to Lord Shiva.', imageQuery: 'kashi vishwanath temple varanasi', category: 'Temple' },
      { id: 'assi-ghat', name: 'Assi Ghat', description: 'The southernmost ghat where pilgrims and travelers gather at dawn.', imageQuery: 'assi ghat varanasi sunrise', category: 'Landmark' }
    ]
  },
  {
    id: 'kerala', name: 'Kerala', country: 'India', continent: 'Asia',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    description: "Known as 'God's Own Country', celebrated for tranquil backwaters, mist-covered tea plantations, and pristine beaches.",
    imageQuery: 'kerala backwaters houseboat palms', tags: ['nature', 'beach', 'culture'], bestTimeToVisit: 'September to March',
    famousPlaces: [
      { id: 'alleppey', name: 'Alleppey Backwaters', description: 'Sail through emerald palm-fringed canals on traditional houseboats.', imageQuery: 'alleppey backwaters houseboat kerala', category: 'Nature' },
      { id: 'munnar', name: 'Munnar Tea Hills', description: 'Endless rolling hills covered with lush green tea plantations.', imageQuery: 'munnar tea plantations hills kerala', category: 'Nature' },
      { id: 'varkala', name: 'Varkala Cliff Beach', description: 'Unique dramatic red cliffs overlooking the turquoise Arabian Sea.', imageQuery: 'varkala cliff beach kerala', category: 'Beach' }
    ]
  },
  {
    id: 'mumbai', name: 'Mumbai', country: 'India', continent: 'Asia',
    coordinates: { lat: 18.9220, lng: 72.8347 },
    description: "The energetic City of Dreams, featuring colonial Victorian architecture, the Arabian Sea coastline, and Bollywood.",
    imageQuery: 'mumbai gateway of india marine drive', tags: ['city', 'culture', 'food'], bestTimeToVisit: 'October to March',
    famousPlaces: [
      { id: 'gateway-india', name: 'Gateway of India', description: 'An arch monument built during the 20th century overlooking Mumbai Harbour.', imageQuery: 'gateway of india mumbai', category: 'Landmark' },
      { id: 'marine-drive', name: 'Marine Drive', description: 'A 3.6-kilometer-long boulevard along the coast known as the Queen’s Necklace.', imageQuery: 'marine drive queens necklace mumbai night', category: 'Neighborhood' },
      { id: 'elephanta', name: 'Elephanta Caves', description: 'Ancient rock-cut cave temples dedicated to Shiva on Elephanta Island.', imageQuery: 'elephanta caves mumbai', category: 'Landmark' }
    ]
  },
  {
    id: 'udaipur', name: 'Udaipur', country: 'India', continent: 'Asia',
    coordinates: { lat: 24.5854, lng: 73.7125 },
    description: "The 'City of Lakes' and 'Venice of the East', famous for romantic marble palaces floating on shimmering waters.",
    imageQuery: 'udaipur lake pichola city palace rajasthan', tags: ['culture', 'city', 'nature'], bestTimeToVisit: 'October to March',
    famousPlaces: [
      { id: 'udaipur-city-palace', name: 'City Palace Udaipur', description: 'A monumental palace complex overlooking Lake Pichola.', imageQuery: 'city palace udaipur lake pichola', category: 'Landmark' },
      { id: 'lake-pichola', name: 'Lake Pichola', description: 'An artificial freshwater lake with romantic boat rides and island palaces.', imageQuery: 'lake pichola udaipur sunset', category: 'Nature' },
      { id: 'jag-mandir', name: 'Jag Mandir', description: 'A palace built on an island in Lake Pichola, also known as the Lake Garden Palace.', imageQuery: 'jag mandir udaipur', category: 'Landmark' }
    ]
  },
  {
    id: 'manali', name: 'Manali', country: 'India', continent: 'Asia',
    coordinates: { lat: 32.2432, lng: 77.1892 },
    description: "A high-altitude Himalayan resort town known for snow-capped peaks, pine forests, and thrilling mountain adventures.",
    imageQuery: 'manali himalayas snow mountains india', tags: ['adventure', 'nature'], bestTimeToVisit: 'October to June (Snow season: Dec-Feb)',
    famousPlaces: [
      { id: 'solang-valley', name: 'Solang Valley', description: 'A side valley at the top of Kullu Valley famous for snow sports and paragliding.', imageQuery: 'solang valley manali adventure', category: 'Adventure' },
      { id: 'rohtang-pass', name: 'Rohtang Pass', description: 'A high mountain pass on the eastern Pir Panjal Range with dramatic glacier views.', imageQuery: 'rohtang pass snow manali', category: 'Nature' },
      { id: 'hadimba', name: 'Hadimba Temple', description: 'An ancient wooden pagoda temple surrounded by cedar forest.', imageQuery: 'hadimba temple manali', category: 'Temple' }
    ]
  },
  {
    id: 'hampi', name: 'Hampi', country: 'India', continent: 'Asia',
    coordinates: { lat: 15.3350, lng: 76.4600 },
    description: "A UNESCO World Heritage site amidst a surreal boulder-strewn landscape, the ancient capital of the Vijayanagara Empire.",
    imageQuery: 'hampi stone chariot virupaksha temple karnataka', tags: ['culture', 'adventure', 'nature'], bestTimeToVisit: 'October to February',
    famousPlaces: [
      { id: 'stone-chariot', name: 'Stone Chariot', description: 'An iconic stone-carved shrine dedicated to Garuda in the Vittala Temple.', imageQuery: 'stone chariot hampi vittala', category: 'Landmark' },
      { id: 'virupaksha', name: 'Virupaksha Temple', description: 'A towering 7th-century sacred temple dedicated to Lord Shiva.', imageQuery: 'virupaksha temple hampi', category: 'Temple' },
      { id: 'matanga-hill', name: 'Matanga Hill', description: 'The highest point in Hampi offering breathtaking 360-degree sunrise views.', imageQuery: 'matanga hill hampi sunrise', category: 'Nature' }
    ]
  },
  {
    id: 'andaman', name: 'Andaman Islands', country: 'India', continent: 'Asia',
    coordinates: { lat: 11.7401, lng: 92.6586 },
    description: "An archipelago of tropical islands in the Bay of Bengal with crystal turquoise waters, coral reefs, and pristine white beaches.",
    imageQuery: 'andaman islands radhanagar beach turquoise ocean', tags: ['beach', 'nature', 'adventure'], bestTimeToVisit: 'October to May',
    famousPlaces: [
      { id: 'radhanagar', name: 'Radhanagar Beach', description: 'Award-winning white sand beach consistently ranked among Asia’s best beaches.', imageQuery: 'radhanagar beach havelock andaman', category: 'Beach' },
      { id: 'cellular-jail', name: 'Cellular Jail', description: 'A historic colonial prison in Port Blair, now a revered national memorial.', imageQuery: 'cellular jail port blair andaman', category: 'Landmark' },
      { id: 'ross-island', name: 'Ross Island (Netaji Subhash Chandra Bose Dweep)', description: 'An island enveloped by giant banyan roots and historical British ruins.', imageQuery: 'ross island andaman ruins', category: 'Nature' }
    ]
  }
];
