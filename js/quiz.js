/* Quiz Functions and Data */

// questions are grouped by similarities: moon, colors, stars, animals, etc.
const multipleChoiceQuestions = [
  [
    'Yemen',
    'Iraq',
    'Egypt',
    'Syria'
  ],
  [
    'South Africa',
    'Central African Republic',
    'Mauritania',
    'Mauritius',
    'Armenia'
  ],
  [
    'Gambia',
    'Gabon',
    'Zimbabwe',
    'Zambia',
    'Nigeria',
    'Niger'
  ],
  [
    'Seychelles',
    'Republic of the Congo',
    'Libya',
    'Liberia',
    'Ethiopia',
    'Eritrea',
  ],
  [
    'Cameroon',
    'Ghana',
    'Burkina Faso',
    'Senegal'
  ],
  [ 
    'Nicaragua',
    'El Salvador',
    'Guatemala',
    'San Marino',
    'Lesotho',
    'Sierra Leone'
  ],
  [
    'Philippines',
    'Palestine',
    'Jordan',
    'Sudan',
    'Kuwait',
    'Vanuatu',
    'Czechia',
    'Equatorial Guinea',
    'Djibouti',
    'Western Sahara'
  ],
  [
    'Oman',
    'United Arab Emirates',
    'Madagascar',
    'Benin',
    'Guinea-Bissau'
  ],
  [ 
    'Thailand',
    'North Korea',
    'Suriname',
    'Costa Rica',
    'Estonia',
    'Botswana'
  ],
  [
    'Venezuela',
    'Ecuador',
    'Colombia',
    'Mexico',
    'Spain'
  ],
  [
    'Paraguay',
    'Netherlands',
    'France',
    'Germany',
    'Belgium',
    'Lithuania'
  ],
  [ 
    
  ],
  [
    'Romania',
    'Chad',
    'Ukraine',
    'Bulgaria',
    'Italy',
    'Luxembourg'
  ],
  [ 
    'Bolivia',
    'Hungary',
    'Mali',
    'Guinea',
    'India',
    'Ireland',
    'Ivory Coast'
  ],
  [ 
    'Lebanon',
    'Peru',
    'Austria',
    'Malta',
    'Latvia',
  ],
  [ 
    'Indonesia',
    'Singapore',
    'Monaco',
    'Poland'
  ],
  [ 
    'Turkey',
    'Pakistan',
    'Turkmenistan',
    'Maldives',
    'Tunisia',
    'Algeria',
    'Azerbaijan',
    'Uzbekistan'
  ],
  [ 
    'New Zealand',
    'Australia',
    'United Kingdom',
    'Georgia',
    'Switzerland'
  ],
  [
    'Serbia',
    'Slovenia',
    'Slovakia',
    'Russia'
  ],
  [
    'Saudi Arabia',
    'Tajikistan',
    'Iran',
    'Israel',
  ],
  [ 
    'Kyrgyzstan',
    'Kazakhstan',
    'Nepal',
    'South Korea',
    'Croatia',
    'Andorra',
    'Moldova',
    'Angola'
  ],
  [ 
    'Argentina',
    'Uruguay',
    'Malaysia',
    'United States',
    'Greece'
  ],
  [
    'Timor-Leste',
    'Guyana',
    'Saint Lucia',
    'South Sudan'
  ],
  [ 
    'Nauru',
    'Cape Verde',
    'Kiribati',
    'Grenada',
    'Antigua and Barbuda',
    'North Macedonia',
    'Belarus'
  ],
  [
    'Fiji',
    'Marshall Islands',
    'Solomon Islands',
    'Micronesia',
    'Tuvalu',
    'Honduras',
    'Bahamas',
    'Barbados',
    'Bosnia and Herzegovina',
    'Comoros'
  ],
  [
    'Mongolia',
    'Brunei',
    'Afghanistan',
    'Cambodia',
    'Canada',
    'Belize',
    'Eswatini',
    'Mozambique',
    'Kosovo',
    'Cyprus'
  ],
  [
    'Brazil',
    'Jamaica',
    'Vatican City',
    'Portugal',
    'Malawi'
  ],
  [ 
    'Samoa',
    'Tonga',
    'Chile',
    'Togo'
  ],
  [ 
    'Bangladesh',
    'Japan',
    'Laos',
    'Palau'
  ],
  [ 
    'Sri Lanka',
    'Bhutan',
    'Papua New Guinea',
    'Dominica',
    'Montenegro',
    'Albania',
    'Uganda',
    'Qatar',
    'Bahrain'
  ],
  [ 
    'Denmark',
    'Norway',
    'Finland',
    'Sweden',
    'Iceland'
  ],
  [ 
    'China',
    'Vietnam',
    'Taiwan',
    'Myanmar',
    'Somalia',
    'Morocco'
  ],
  [
    'Trinidad and Tobago',
    'DR Congo',
    'Tanzania',
    'Namibia',
    'Rwanda'
  ],
  [ 
    'Panama',
    'Cuba',
    'Saint Kitts and Nevis',
    'Sao Tome and Principe',
    'Dominican Republic',
    'Saint Vincent and the Grenadines',
    'Haiti',
    'Liechtenstein',
    'Burundi',
    'Ghana',
    'Burkina Faso',
  ]
];

// Alternative Names
const alternatives = {
  // name in API (restcountries): alternative name
  "São Tomé and Príncipe": "Sao Tome and Principe",
  "Turkey": "Türkiye",
  "Ivory Coast": "Côte d'Ivoire",
  "Åland Islands": "Aland Islands",
  "Réunion": "Reunion",
  "Myanmar": "Burma",
  "Timor-Leste": "East-Timor",
  "Eswatini": "Swaziland",
  "Taiwan": "Republic of China",
  "North Macedonia": "Republic of Macedonia",
  "DR Congo": "Democratic Republic of the Congo",
  "Czechia": "Czech Republic",
  "Western Sahara": "Sahrawi Arab Democratic Republic",
};

// for timer
const formatTime = s => {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

// shuffle data using Fisher-Yates-Durstendfeld shuffle
function shuffle(sourceArr) {
  for (let i = 0; i < sourceArr.length - 1; i++) {
    let j = i + Math.floor(Math.random() * (sourceArr.length - i)); // random index
    let temp = sourceArr[j];
    sourceArr[j] = sourceArr[i];
    sourceArr[i] = temp;
  }

  return sourceArr;
}

// Quiz timer
function startTimer() {
  $('#quizTimer').text('00:00');

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    USER_STATS.time += 1;
    $('#quizTimer').text(formatTime(USER_STATS.time));
  }, 1000);
}

// Preload images
function preloadFlags(countriesData) {
  for (let country in countriesData) {
    let image = new Image();
    image.src = `../assets/flags/${countriesData[country].code}.png`;
  }
}

// format countries data
function parseData(countriesData) {
  const parsedCountriesObj = {};
  countriesData.forEach(countryData => {
    let cKey = countryData.name.common;
    parsedCountriesObj[cKey] = {};
    parsedCountriesObj[cKey].code = countryData.cca2.toLowerCase();
    parsedCountriesObj[cKey].continent = countryData.continents[0];
  });

  return parsedCountriesObj;
};

// generate questions: Multiple Choice
function generateQuestions(questionsData) {
  const questions = [];

  questionsData.forEach(qArr => {
    for (let i = 0; i < qArr.length; i++) {
      let otherChoices = [...qArr];
      otherChoices.splice(i, 1); // remove the correct choice
      otherChoices = shuffle(otherChoices).slice(0, 3); // shuffle then only limit to 3

      questions.push({
        correctChoice: qArr[i],
        otherChoices
      });
    }
  });

  return shuffle(questions);
};

let COUNTER_TOTAL = 1;
let timerInterval;
const USER_STATS = {
  "score": 0, 
  "time":  0, // seconds
  "counter": 0,
  "accuracy": 0, // score / counter
}

// Audio
/* Audio are from https://www.zapsplat.com/ */
const correctAudio = new Audio('../assets/sfx/correct.mp3');
const wrongAudio = new Audio('../assets/sfx/wrong.mp3');
const successAudio = new Audio('../assets/sfx/success.mp3');
const failAudio = new Audio('../assets/sfx/fail.mp3');
const amazingAudio = new Audio('../assets/sfx/amazing.mp3');

// set volume
correctAudio.volume = 0.3;
wrongAudio.volume = 0.5;
successAudio.volume = 0.5;
failAudio.volume = 0.5;
amazingAudio.volume = 0.8;

// playing audio
const playAudio = audioName => {
  switch (audioName) {
    case 'correct':
      correctAudio.play();
      correctAudio.currentTime = 0;
      break;
    case 'wrong':
      wrongAudio.play();
      wrongAudio.currentTime = 0;
      break;
    case 'success':
      successAudio.play();
      successAudio.currentTime = 0;
      break;
    case 'fail':
      failAudio.play();
      failAudio.currentTime = 0;
      break;
    case 'amazing':
      amazingAudio.play();
      amazingAudio.currentTime = 0;
  }
};