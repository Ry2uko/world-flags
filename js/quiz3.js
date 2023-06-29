$(document).ready(function(){
  $.get("https://restcountries.com/v3.1/all", countriesData => {
    let parsedCountriesObj = parseData(countriesData);
    const questionsCount = 193; // Max: 199 Questions
    let questions = shuffle(generateQuestions(multipleChoiceQuestions)
      .map(i => i.correctChoice)).slice(0, questionsCount); 

    preloadFlags();
    quizStart(parsedCountriesObj, questions);

    // Try again
    $('#resultsResetBtn').on('click', () => {
      let questions = shuffle(generateQuestions(multipleChoiceQuestions)
      .map(i => i.correctChoice)).slice(0, questionsCount);
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
  // random flag
  let randIndex = Math.floor(Math.random() * questionsData.length)
  let randFlag = questionsData[randIndex];
  let flagData = countriesData[randFlag];

  // check if alternative name is used
  if (flagData === undefined) {
    for (let alt in alternatives) {
      if (alternatives[alt] === randFlag && countriesData[alt] !== undefined) {
        flagData = countriesData[alt];
        break;
      }
    }
  }

  // remove question from data
  questionsData.splice(randIndex, 1);

  // Load question
  $('.flag-image-container').append(`
    <img class="flag" src="./assets/flags/${flagData.code}.png" data-name="${randFlag}" />
  `);

  const ANIMATION_MS = 250;
  $('#quizBox').css('display', 'flex').animate({
    'opacity': 1
  }, ANIMATION_MS);
  $('#quizInput').focus();

  // Input submitted
  $('#quizInput').on({
    'keypress': function(e){
    if (e.key === 'Enter') {
      let userInput = $(this).val().toLowerCase(); 

      if (userInput === '') return;

      // Alternative name
      let altName = '';
      for (let alt in alternatives) {
        if (alternatives[alt] === randFlag) altName = alt;
        else if (alt === randFlag) altName = alternatives[alt];
      }

      if (randFlag.toLowerCase() === userInput || altName.toLowerCase() === userInput) {
        // Correct
        playAudio('correct2');
        USER_STATS.score += 1;
        $(this).css({ 'border': '1px solid #5cd65c' });
        setTimeout(() => {
          $(this).css({'border': '1px solid #ffffff2a' });
        }, 200)

        $('#quizInput').off('keypress');
        // New question
        setTimeout(() => {
          $('#quizBox').animate({
            'opacity': 0
          }, ANIMATION_MS, () => {
            $('#quizBox').css('display', 'none');
            $('.flag-image-container').empty();
            $(this).val('').css({ 'border': '1px solid #ffffff2a' });
            $('#correctAnswer').text('').css('opacity', 0);

            if (USER_STATS.score !== COUNTER_TOTAL) generateQuestion(countriesData, questionsData);
          });
        }, 250);
      } else {
        // Wrong
        playAudio('incorrect');
        $(this).css({ 'border': '1px solid #ff3333' });
        setTimeout(() => {
          $(this).css({'border': '1px solid #ffffff2a' });
        }, 200)
        $('#correctAnswer').text(altName ? `${randFlag} / ${altName}` : randFlag).animate({ 'opacity': 0.7 }, 100);
      }

      USER_STATS.counter += 1;
      let accuracy = Math.round((USER_STATS.score / USER_STATS.counter)*100);
      USER_STATS.accuracy = accuracy;
      $('#quizCounter').text(`${USER_STATS.score}/${COUNTER_TOTAL}`);
      $('#quizAccuracy').text(`${accuracy}%`).attr('title', `${USER_STATS.score} / ${USER_STATS.counter}`);

      if (USER_STATS.score === COUNTER_TOTAL) {
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
          $('#quizResultTime').css('color', RESULTS_COLOR);
          $('#resultsResetBtn').css({
            'backgroundColor': RESULTS_COLOR,
            'borderColor': RESULTS_COLOR
          });
  
          $('#quizResultAccuracy').text(`${USER_STATS.accuracy}%`);
          $('#quizResultTime').text(formatTime(USER_STATS.time));
  
          $('.results-box').css('display', 'flex').animate({
            'opacity': 1
          }, 500);
        }, 550);
      }
    }
  }
});
}