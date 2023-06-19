// questions are grouped by similarities: moon, colors, stars, animals, etc.
const quizOneQuestions = [
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
  "São Tomé and Príncipe": "Sao Tome and Principe",
  "Türkiye": "Turkey",
  "Côte d'Ivoire": "Ivory Coast",
  "Åland Islands": "Aland Islands",
  "Réunion": "Reunion",
  "Burma": "Myanmar",
  "East-Timor": "Timor-Leste",
  "Swaziland": "Eswatini",
  "Republic of China": "Taiwan",
  "Republic of Macedonia": "North Macedonia",
  "Democratic Republic of the Congo": "DR Congo",
  "Czech Republic": "Czechia",
  "Sahrawi Republic": "Western Sahara",
  "Sahrawi Arab Democratic Republic": "Western Sahara"
};

let COUNTER_TOTAL = 1;
const USER_STATS = {
  "score": 0, 
  "time":  0, // seconds
  "counter": 0,
  "accuracy": 0, // score / counter
}

$(document).ready(function(){
  $.get("https://restcountries.com/v3.1/all", countriesData => {
    let parsedCountriesObj = parseData(countriesData);
    let questions = generateQuestions(quizOneQuestions).slice(0, 50);

    preloadFlags();
    quizStart(parsedCountriesObj, questions);
  });

  // Start quiz
  function quizStart(countriesData, questionsData) {
    // Initialization
    USER_STATS.score = 0;
    USER_STATS.time = 0;
    USER_STATS.counter = 0;
    USER_STATS.accuracy = 0;

    COUNTER_TOTAL = questionsData.length;

    $('#quizCounter').text(`${USER_STATS.counter}/${COUNTER_TOTAL}`);
    $('#quizAccuracy').text(`${USER_STATS.accuracy}%`);
    startTimer();
    
    // Generate first question
    generateQuestion(countriesData, questionsData);
  }

  // Pre-load images
  function preloadFlags(countriesData) {
    for (let country in countriesData) {
      let image = new Image();
      let imageSize = (country === 'Nepal') ? 'w320' : 'w640';

      image.src = `https://flagcdn.com/${imageSize}/${countriesData[country].code}.png`;
    }
  }

  // generate question
  function generateQuestion(countriesData, questionData) {
    // random question
    let randIndex = Math.floor(Math.random() * questionData.length);
    let randQuestion = questionData[randIndex];
    let correctChoice = randQuestion.correctChoice;

    let randFlag = countriesData[correctChoice];
    if (randFlag === undefined)  {
      for (let alt in alternatives) {
        if (alternatives[alt] === correctChoice && countriesData[alt] !== undefined) {
          randFlag = countriesData[alt];
          break;
        }
      }
    }

    console.log(randFlag);

    // remove question from data
    questionData.splice(randIndex, 1);

    // Load question
    let questionChoices = shuffle([...randQuestion.otherChoices, correctChoice]); // all choices shuffled
    questionChoices.forEach((choice, i) => {
      $(`#option${i+1}`).attr('data-name', choice).text(choice);
    });

    let imageSize = (correctChoice === 'Nepal') ? 'w320' : 'w640';
    $('.flag-image-container').append(`
      <img class="flag" src="https://flagcdn.com/${imageSize}/${randFlag.code}.png" data-name="${correctChoice}" />
    `);

    const ANIMATION_MS = 300;
    $('#quizBox').css('display', 'flex').animate({
      'opacity': 1
    }, ANIMATION_MS);

    // Click event
    $('.quiz-option').on('click', function(){
      let correctChoice = $('img.flag').attr('data-name');
      let chosenChoice = $(this).attr('data-name');
      $('.quiz-option').off('click');
      if (correctChoice === chosenChoice) {
        // Correct choice
        USER_STATS.score += 1;
        $(this).css({ 'border': '1px solid #5cd65c' });
      } else {
        // Wrong
        $(this).css({ 'border': '1px solid #ff3333' });
        $(`.quiz-option[data-name="${correctChoice}"]`).css({ 'border': '1px solid #5cd65c' });
      }

      USER_STATS.counter += 1;
      let accuracy = Math.floor((USER_STATS.score / USER_STATS.counter)*100);
      $('#quizCounter').text(`${USER_STATS.counter}/${COUNTER_TOTAL}`);
      $('#quizAccuracy').text(`${accuracy}%`);

      setTimeout(() => {
        $('#quizBox').animate({
          'opacity': 0
        }, ANIMATION_MS, () => {
          $('#quizBox').css('display', 'none');
          $('.flag-image-container').empty();
          $('.quiz-option').css({ 'border': '1px solid #ffffff16' });

          generateQuestion(countriesData, questionData);
        });
      }, 250);
    });
  }

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

  // Quiz timer
  function startTimer() {
    $('#quizTimer').text('00:00');

    const formatTime = s => {
      const minutes = Math.floor(s / 60);
      const seconds = s % 60;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      return `${formattedMinutes}:${formattedSeconds}`;
    }

    setInterval(() => {
      USER_STATS.time += 1;
      $('#quizTimer').text(formatTime(USER_STATS.time));
    }, 1000);
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
});
