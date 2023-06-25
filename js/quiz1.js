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
  // name in API: alternative name
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

const formatTime = s => {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

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
const perfectAudio = new Audio('../assets/sfx/perfect.mp3');

// set volume
correctAudio.volume = 0.3;
wrongAudio.volume = 0.5;
successAudio.volume = 0.5;
failAudio.volume = 0.5;
perfectAudio.volume = 0.8;

$(document).ready(function(){
  $.get("https://restcountries.com/v3.1/all", countriesData => {
    let parsedCountriesObj = parseData(countriesData);
    const questionsCount = 5; // Max: 199 Questions
    let questions = generateQuestions(quizOneQuestions).slice(0, questionsCount); 

    preloadFlags();
    quizStart(parsedCountriesObj, questions);

    // Try again
    $('#resultsResetBtn').on('click', () => {
      let questions = generateQuestions(quizOneQuestions).slice(0, questionsCount);
      $('.results-box').animate({
        'opacity': 0
      }, 500, function(){
        $(this).css('display', 'none');
        quizStart(parsedCountriesObj, questions);
      });
    });

    // Other modes
    $('#resultsOtherModesBtn').on('click', () => {
      window.location.replace('./quiz.html');
    });
  });

  // Start quiz
  function quizStart(countriesData, questionsData) {
    // Initialization
    USER_STATS.score = 0;
    USER_STATS.time = 0;
    USER_STATS.counter = 0;
    USER_STATS.accuracy = 0;

    COUNTER_TOTAL = questionsData.length;

    // Start quiz
    $('#quizCounter').text(`${USER_STATS.counter}/${COUNTER_TOTAL}`);
    $('#quizAccuracy').text(`${USER_STATS.accuracy}%`).attr('title', `${USER_STATS.score} / ${COUNTER_TOTAL}`);
    startTimer();
    
    // Generate first question
    generateQuestion(countriesData, questionsData);
  }

  // Preload images
  function preloadFlags(countriesData) {
    for (let country in countriesData) {
      let image = new Image();
      image.src = `../assets/flags/${countriesData[country].code}.png`;
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

    // remove question from data
    questionData.splice(randIndex, 1);

    // Load question
    let questionChoices = shuffle([...randQuestion.otherChoices, correctChoice]); // all choices shuffled
    questionChoices.forEach((choice, i) => {
      $(`#option${i+1}`).attr('data-name', choice).text(choice);
    });

    $('.flag-image-container').append(`
      <img class="flag" src="./assets/flags/${randFlag.code}.png" data-name="${correctChoice}" />
    `);

    const ANIMATION_MS = 250;
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
        correctAudio.play();
        correctAudio.currentTime = 0;
        USER_STATS.score += 1;
        $(this).css({ 'border': '1px solid #5cd65c' });
      } else {
        // Wrong
        wrongAudio.play();
        wrongAudio.currentTime = 0;
        $(this).css({ 'border': '1px solid #ff3333' });
        $(`.quiz-option[data-name="${correctChoice}"]`).css({ 'border': '1px solid #5cd65c' });
      }

      USER_STATS.counter += 1;
      let accuracy = Math.round((USER_STATS.score / USER_STATS.counter)*100);
      USER_STATS.accuracy = accuracy;
      $('#quizCounter').text(`${USER_STATS.counter}/${COUNTER_TOTAL}`);
      $('#quizAccuracy').text(`${accuracy}%`).attr('title', `${USER_STATS.score} / ${COUNTER_TOTAL}`);

      // Quiz has ended
      if (USER_STATS.counter === COUNTER_TOTAL) {
        let RESULTS_COLOR = '#fff', MODAL_TEXT = 'Well done! You got:';

        setTimeout(() => {
          if (USER_STATS.accuracy >= 95) {
            // Subarashii!!
            perfectAudio.play();
            perfectAudio.currentTime = 0;
            RESULTS_COLOR = '#3385ff';
            MODAL_TEXT = 'Amazing!! You got:';
            // add confetti here (later)
          } else if (USER_STATS.accuracy >= 50) { 
            // Well done!
            successAudio.play();
            successAudio.currentTime = 0;
            RESULTS_COLOR = '#6f3';
            MODAL_TEXT = 'Well done! You got:';
          } else {
            // You did great! But, there are still room to improve
            failAudio.play();
            failAudio.currentTime = 0;
            RESULTS_COLOR = '#f33';
            MODAL_TEXT = 'Nice try! You got:';
          }

          $('.modal-text').text(MODAL_TEXT);
          $('#quizResultAccuracy').css('color', RESULTS_COLOR);
          $('#quizResultScore').css('color', RESULTS_COLOR);
          $('#quizResultTime').css('color', RESULTS_COLOR);
          $('#resultsResetBtn').css({
            'backgroundColor': RESULTS_COLOR,
            'borderColor': RESULTS_COLOR
          });

          $('#quizResultScore').text(`${USER_STATS.score} / ${COUNTER_TOTAL}`);
          $('#quizResultAccuracy').text(`${USER_STATS.accuracy}%`);
          $('#quizResultTime').text(formatTime(USER_STATS.time));

          $('.results-box').css('display', 'flex').animate({
            'opacity': 1
          }, 500);
        }, 550);
      }

      // New question
      setTimeout(() => {
        $('#quizBox').animate({
          'opacity': 0
        }, ANIMATION_MS, () => {
          $('#quizBox').css('display', 'none');
          $('.flag-image-container').empty();
          $('.quiz-option').css({ 'border': '1px solid #ffffff16' });

          if (USER_STATS.counter !== COUNTER_TOTAL) generateQuestion(countriesData, questionData);
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

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
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
