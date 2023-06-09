$(document).ready(function(){
  $.get("https://restcountries.com/v3.1/all", countriesData => {
    let parsedCountriesObj = parseData(countriesData);
    const questionsCount = 100; // Max: 199 Questions
    let questions = generateQuestions(multipleChoiceQuestions).slice(0, questionsCount); 

    preloadFlags();
    quizStart(parsedCountriesObj, questions);

    // Try again
    $('#resultsResetBtn').on('click', () => {
      let questions = generateQuestions(multipleChoiceQuestions).slice(0, questionsCount);
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
});

// Generate question
function generateQuestion(countriesData, questionsData) {
  // random question
  let randIndex = Math.floor(Math.random() * questionsData.length);
  let randQuestion = questionsData[randIndex];
  let correctChoice = randQuestion.correctChoice;

  let correctFlag = countriesData[correctChoice];

  // check if alternative name is used
  if (correctFlag === undefined)  {
    for (let alt in alternatives) {
      if (alternatives[alt] === correctChoice && countriesData[alt] !== undefined) {
        correctFlag = countriesData[alt];
        break;
      }
    }
  }

  // remove question from data
  questionsData.splice(randIndex, 1);

  // Load question
  let questionChoices = shuffle([...randQuestion.otherChoices, correctChoice]); // all choices shuffled
  questionChoices.forEach((choice, i) => {
    $(`#option${i+1}`).attr('data-name', choice).text(choice);
  });
  $('.flag-image-container').append(`
    <img class="flag" src="./assets/flags/${correctFlag.code}.png" data-name="${correctChoice}" />
  `);

  const ANIMATION_MS = 250;
  $('#quizBox').css('display', 'flex').animate({
    'opacity': 1
  }, ANIMATION_MS);

  // Click event
  $('.quiz-option').on('click', function(){
    let chosenChoice = $(this).attr('data-name');
    $('.quiz-option').off('click');

    if (correctChoice === chosenChoice) {
      // Correct choice
      playAudio('correct');
      USER_STATS.score += 1;
      $(this).css({ 'border': '1px solid #5cd65c' });
    } else {
      // Wrong
      playAudio('wrong');
      $(this).css({ 'border': '1px solid #ff3333' });
      $(`.quiz-option[data-name="${correctChoice}"]`).css({ 'border': '1px solid #5cd65c' });
    }

    // Update stats
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
          playAudio('amazing');
          RESULTS_COLOR = '#3385ff';
          MODAL_TEXT = 'Amazing!! You got:';
          // add confetti here (later)
        } else if (USER_STATS.accuracy >= 50) { 
          // Well done!
          playAudio('success');
          RESULTS_COLOR = '#6f3';
          MODAL_TEXT = 'Well done! You got:';
        } else {
          // You did great! But, there are still room to improve
          playAudio('fail');
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

        if (USER_STATS.counter !== COUNTER_TOTAL) generateQuestion(countriesData, questionsData);
      });
    }, 250);
  });
}