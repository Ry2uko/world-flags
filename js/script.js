$(document).ready(function(){
  const flagsContainer = $('.flags-container');

  // load countries data
  $.get("https://restcountries.com/v3.1/all", countriesData => {
    let parsedCountriesData = parseData(countriesData);
    let countriesDataShuffled = shuffle(parsedCountriesData);
    let flagsCount = parsedCountriesData.length;

    // Load flags
    countriesDataShuffled.forEach(countryData => {
      let countryCode = countryData.code;
      let countryName = countryData.name;
      flagsContainer.append(`
      <div class="flag-container" data-country="${countryName}">
        <div class="flag-image-container-upper">
          <div class="flag-image-container">
            <img src="https://flagcdn.com/w160/${countryCode}.png" class="flag" data-code="${countryCode}">
          </div>
        </div>
        <div class="flag-country-container">
          <span class="flag-country">${countryName}</span>
        </div>
      </div>
      `);
    });
    
    let activeFilters = [
      "Asia",
      "Africa",
      "Antarctica",
      "Oceania",
      "Europe",
      "North America",
      "South America"
    ];

    let filteredCountries = countriesDataShuffled.filter(countryData => {
      return activeFilters.includes(countryData.continent);
    });

    $('.flags-count').html(`<span class="colored"><span id="flagsCount">${flagsCount}</span> / ${flagsCount}</span> Flags Shown`);

    // Search input
    $('#searchCountry').on('keyup', debounce(function() {
      // filter flags
      let searchVal = $(this).val().toLowerCase();
      
      filteredCountries = countriesDataShuffled.filter(country => {
        return activeFilters.includes(country.continent) && country.name.match(new RegExp(`${searchVal}.*`, 'i'));
      });
      let filteredCountriesArr = filteredCountries.reduce((a, b) => {
        a.push(b.name);
        return a;
      }, []);

      $('.flag-container').attr('class', 'flag-container hidden');
      $('.flag-container').filter(function(){
        let countryName = $(this).attr('data-country');
        return filteredCountriesArr.includes(countryName);
      }).removeClass('hidden');

      setFlags();
    
    }, 50));

    // Continent filter modal
    $('#continentFilterBtn').on('click', () => {
      const ANIM_MS = 280;

      $('.parent-container').css({
        'pointerEvents': 'none',
        'userSelect': 'none'
      }).animate({
        'opacity': 0.4
      }, ANIM_MS);

      $('.continent-modal-container').css('display', 'block').animate({
        'opacity': 1
      }, ANIM_MS);
    });

    $('#closeContinentModal').on('click', () => {
      const ANIM_MS = 280;

      $('.parent-container').animate({
        'opacity': 1
      }, ANIM_MS, function(){
        $(this).css({
          'pointerEvents': 'auto',
          'userSelect': 'auto'
        });
      });
      

      $('.continent-modal-container').animate({
        'opacity': 0
      }, ANIM_MS, function(){
        $(this).css('display', 'none');
      });
    });

    $('.continent-filter').on('click', function(){
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        activeFilters.splice(activeFilters.indexOf($(this).find('.continent-text').text()), 1);
      } else {
        $(this).addClass('active');
        activeFilters.push($(this).find('.continent-text').text())
      }
      
      let searchVal = $('#searchCountry').val().toLowerCase();
      
      filteredCountries = countriesDataShuffled.filter(country => {
        return activeFilters.includes(country.continent) && country.name.match(new RegExp(`${searchVal}.*`, 'i'));
      });

      let filteredCountriesArr = filteredCountries.reduce((a, b) => {
        a.push(b.name);
        return a;
      }, []);

      $('.flag-container').attr('class', 'flag-container hidden');
      $('.flag-container').filter(function(){
        return filteredCountriesArr.includes($(this).attr('data-country'));
      }).removeClass('hidden');


      setFlags();
    });

    // set flags count
    const setFlags = () => {
      let totalFlags = parsedCountriesData.length;
      // set flag count
      let currFlagsCount = filteredCountries.length;
      $('#flagsCount').text(currFlagsCount);

      currFlagsCount === 0 ? $('#flagsCount').css('color', '#e61e10')
      : currFlagsCount < totalFlags ? $('#flagsCount').css('color', '#cee40d')
      : $('#flagsCount').css('color', '#0de454');
    };
  }); 

  // create a more cleaner object from countries data
  function parseData(countriesData) {
    const parsedCountriesData = [];
    countriesData.forEach(countryData => {
      let parsedCountryObj = {};
      parsedCountryObj.name = countryData.name.common;
      parsedCountryObj.code = countryData.cca2.toLowerCase();
      parsedCountryObj.continent = countryData.continents[0];
      parsedCountriesData.push(parsedCountryObj);
    });

    return parsedCountriesData;
  };

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
