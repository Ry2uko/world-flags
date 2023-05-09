// Flag Ratio - Sizing & Exceptions
// Generating Flags & Loading
// JS Flag Objects
// Filtering / Search (Regex)
// Home Page Retouching
// Responsive Design
// Features such as filter by contintent, sort by name & reverse
// Quiz button (redirect only)
// Opening modal info (no info yet)

$(document).ready(function(){
  const flagsContainer = $('.flags-container');

  // load country data
  $.get("https://flagcdn.com/en/codes.json", countriesData => {
    let countryCodesShuffled = shuffle(Object.keys(countriesData));
    countryCodesShuffled.forEach(countryCode => {
      flagsContainer.append(`
      <div class="flag-container" data-country="${countriesData[countryCode]}">
        <div class="flag-image-container-upper">
          <div class="flag-image-container">
            <img src="https://flagcdn.com/w160/${countryCode}.png" class="flag" data-code="${countryCode}">
          </div>
        </div>
        <div class="flag-country-container">
          <span class="flag-country">${countriesData[countryCode]}</span>
        </div>
      </div>
      `)
    });
  }); 

  $('#searchCountry').on('keyup', debounce(function() {
    let searchVal = $(this).val().toLowerCase();
    $('.flag-container').attr('class', 'flag-container hidden');
    $('.flag-container').filter(function(){
      return $(this).attr('data-country').match(new RegExp(`^${searchVal}.*$`, 'i'));
    }).removeClass('hidden');
  }, 50));

  // delay execution of the filtering function until the user has finished typing
  function debounce(fn, wait) {
    let timeout;

    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        fn.apply(context, args);
      }, wait);
    }
  }

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