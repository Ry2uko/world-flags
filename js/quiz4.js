let userAttempts = 3, randFlag, randIndex, flashBool = false;

$(document).ready(function(){
  $.get("https://restcountries.com/v3.1/all", countriesData => {
    let parsedCountriesObj = parseData(countriesData);
    const questionsCount = 50; // Max: 199 Questions
    let questions = shuffle(generateQuestions(multipleChoiceQuestions)
      .map(i => i.correctChoice)).slice(0, questionsCount); 

    preloadFlags();
    generateQuizFlags(parsedCountriesObj, questions);

    // get flags generated and variables
    let availableQuestions = shuffle($('.quiz-flag-container').toArray()).map(i => $(i).attr('data-name'));
    quizStart(availableQuestions);

    // Try again
    $('#resultsResetBtn').on('click', () => {
      let questions = shuffle(generateQuestions(multipleChoiceQuestions)
      .map(i => i.correctChoice)).slice(0, questionsCount); 
      generateQuizFlags(parsedCountriesObj, questions);
      
      let availableQuestions = $('.quiz-flag-container').toArray().map(i => $(i).attr('data-name'));

      $('.results-box').animate({
        'opacity': 0
      }, 500, function(){
        $(this).css('display', 'none');
        quizStart(availableQuestions);
      });
    });

    // Other modes
    $('#resultsOtherModesBtn').on('click', () => {
      window.location.replace('./quiz.html');
    });

    // Mouse tooltip
    $('#quizBox').on({
      'mousemove':  e => {
      let x = e.clientX,
      y = e.clientY;

      $('#quizTooltip').css('top', `${y + 24}px`);
      $('#quizTooltip').css('left', `${x + 20}px`);
      },
      'mouseenter': () => {
        $('#quizTooltip').animate({ 'opacity': 0.8 }, 500);
      },
      'mouseleave': () => {
        $('#quizTooltip').animate({ 'opacity': 0 }, 500);
      }
    });
  });
});

function quizStart(questionsData) {
  // Initialization
  USER_STATS.score = 0;
  USER_STATS.time = 0;
  USER_STATS.counter = 0; // or attempts
  USER_STATS.accuracy = 0;

  COUNTER_TOTAL = questionsData.length;

  // Start quiz
  $('#quizCounter').text(`${USER_STATS.counter}/${COUNTER_TOTAL}`);
  $('#quizAccuracy').text(`${USER_STATS.accuracy}%`).attr('title', `${USER_STATS.score} / ${USER_STATS.counter}`);
  startTimer();

  // Generate first question
  generateQuestion(questionsData);

  $('.gfc-container').on('click', function(){
    let pinnedFlag = $(this).parents('.quiz-flag-container').attr('data-name');
    let flagNameEl = $(this).parents('.quiz-flag-container').find('.flag-name');

    if (flagNameEl.css('opacity') > 0) return; // finish animation first (when text is invisible)

    if (pinnedFlag === randFlag) {
      // Correct
      playAudio('correct2');
      USER_STATS.score += 1;

      $(this).parents('.generic-flag-container').css('backgroundColor', '#0C1017');

      $(this).parents('.quiz-flag-container').css({
        'pointer-events': 'none',
        'opacity': 0.15
      });

      flagNameEl.text(pinnedFlag).css({
        'opacity': 1,
        'color': '#6f3'
      });
      setTimeout(() => {
        flagNameEl.css('color', '#fff');
      }, 300);

      // remove item from questions
      questionsData.splice(randIndex, 1);
      $(this).off('click');

      if (USER_STATS.score !== COUNTER_TOTAL) generateQuestion(questionsData);
    } else {
      // Incorrect
      playAudio('incorrect');

      // if user's attempts run out, flash flag
      if (userAttempts === 1 && !flashBool) {
        flashBool = true;
        flashFlag(randFlag) 
      } else {
        userAttempts--
      }

      flagNameEl.text(pinnedFlag).css({
        'opacity': 1,
        'color': '#ff3333'
      });
      
      setTimeout(() => {
        flagNameEl.animate({ 'opacity': 0 }, 200, function(){
          $(this).text(pinnedFlag);
        });
      }, 300);
    }

    USER_STATS.counter += 1;
    let accuracy = Math.round((USER_STATS.score / USER_STATS.counter)*100);
    USER_STATS.accuracy = accuracy;
    $('#quizCounter').text(`${USER_STATS.score}/${COUNTER_TOTAL}`);
    $('#quizAccuracy').text(`${accuracy}%`).attr('title', `${USER_STATS.score} / ${USER_STATS.counter}`);

    // Quiz has ended
    if (USER_STATS.score === COUNTER_TOTAL) {
      setTimeout(() => {
        $('#quizBox').animate({
          'opacity': 0
        }, 250, () => {
          $('#quizBox').css('display', 'none');
          
          let RESULTS_COLOR = '#fff', MODAL_TEXT = 'Well done! You got:';
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
        });
      }, 360);
    }
  });
}

// Generate flags
function generateQuizFlags(countriesData, questionsData) {
  $('.quiz-flags-container').empty();

  for (let i = 0; i < questionsData.length; i++) {
    let currFlag = questionsData[i];
    let flagData = countriesData[currFlag];

    if (flagData === undefined) {
      for (let alt in alternatives) {
        if (alternatives[alt] === currFlag && countriesData[alt] !== undefined) {
          flagData = countriesData[alt];
          break;
        }
      }
    }
    /* gfc-container will receive the event instead */
    $('.quiz-flags-container').append(`
      <div class="quiz-flag-container" data-name="${currFlag}">
        <div class="generic-flag-container">
          <div class="gfc-container">
            <img src="./assets/flags/${flagData.code}.png" class="quiz-flag" />
          </div>
        </div>
        <span class="flag-name"></span>
      </div>
    `);
  }
}

// Pin a certain flag
function generateQuestion(questionsData) {
  userAttempts = 3;
  flashBool = false;
  randIndex = Math.floor(Math.random() * questionsData.length);
  randFlag = questionsData[randIndex];

  $('.highlight').text(randFlag);
  $('#quizTooltip').text(randFlag);

  const ANIMATION_MS = 250;

  setTimeout(() => { // Let image load first
    $('#quizBox').css('display', 'flex').animate({
      'opacity': 1
    }, ANIMATION_MS);
  }, ANIMATION_MS);
}

// flash answer when attempts run out
function flashFlag(flagName) {
  if (!flashBool) return;
  let flagEl = $(`.quiz-flag-container[data-name="${flagName}"] .generic-flag-container`);

  setTimeout(() => {
    if (!flashBool) return;
    flagEl.css('backgroundColor', 'rgba(255, 51, 51, 0.9)');
    setTimeout(() => {
      flagEl.css('backgroundColor', '#0C1017'); 
      if (flashBool) flashFlag(flagName);
    }, 600);
  }, 600);
  
}
