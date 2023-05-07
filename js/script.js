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

  countriesData.forEach(countryData => {
    flagsContainer.append(`
    <div class="flag-container" data-country="${countryData.country}">
      <div class="flag-image-container-upper">
        <div class="flag-image-container">
          <img src="./assets/flags/${countryData.code}.png" class="flag" data-code="${countryData.code}">
        </div>
      </div>
      <span class="flag-country">${countryData.country}</span>
    </div>
    `)
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
});