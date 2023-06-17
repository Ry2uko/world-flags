// Questions are grouped by similarities: moon, colors, stars, animals, etc.
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

$(document).ready(function(){
  $.get("https://restcountries.com/v3.1/all", countriesData => {
    let parsedCountriesObj = parseData(countriesData);
    let questions = generateQuestions(quizOneQuestions);

    generateQuestion(parsedCountriesObj, questions);
  });

  // generate question
  function generateQuestion(countriesData, questionData) {
    $('.flag-image-container').empty();
    $('.options-container').empty();

    // random question
    let randQuestion = questionData[Math.floor(Math.random() * questionData.length)];
    let correctChoice = randQuestion.correctChoice;
    // get country data from api (parsedCountriesObj)
    let randFlag = countriesData[correctChoice];

    // Load question
    let questionChoices = shuffle([...randQuestion.otherChoices, correctChoice]); // all choices shuffled
    if (correctChoice === 'Nepal') {
      $('.flag-image-container').append(`
        <img src="https://flagcdn.com/w320/${randFlag.code}.png" class="flag" data-code="${correctChoice}">
      `);
    } else {
      $('.flag-image-container').append(`
        <img src="https://flagcdn.com/w640/${randFlag.code}.png" class="flag" data-code="${correctChoice}">
      `);
    }

    // Choices
    questionChoices.forEach((choice, i) => {
      $('.options-container').append(`
        <div class="quiz-option" id="option${i+1}" data-name="${choice}">${choice}</div>
      `);
    });

    // Click event
    $('.quiz-option').on('click', function(){
      let correctChoice = $('img.flag').attr('data-code');
      let chosenChoice = $(this).attr('data-name');
      
      if (correctChoice === chosenChoice) {
        generateQuestion(countriesData, questionData);
      }
    });
  }

  // generate questions: Multiple Choice
  function generateQuestions(questionsData) {
    const questions = [];

    questionsData.forEach(qArr => {
      for (let i = 0; i < qArr.length; i++) {
        let otherChoices = [...qArr];
        otherChoices.splice(i, 1); // remove the correct choice
        otherChoices = shuffle(otherChoices).slice(0, 3);

        questions.push({
          correctChoice: qArr[i],
          otherChoices
        });
      }
    });

    return questions;
  };

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
