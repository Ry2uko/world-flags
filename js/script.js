// Alternative Names
const alternatives = {
  "Sao Tome and Principe": "São Tomé and Príncipe",
  "Türkiye": "Turkey",
  "Côte d'Ivoire": "Ivory Coast",
  "Aland Islands": "Åland Islands",
  "Reunion": "Réunion",
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


$(document).ready(function(){
  const flagsContainer = $('.flags-container');

  // load countries data
  $.get("https://restcountries.com/v3.1/all", countriesData => {
    let parsedCountriesData = parseData(countriesData);
    let countriesDataShuffled = shuffle(parsedCountriesData);
    let flagsCount = parsedCountriesData.length;

    preloadFlags(parsedCountriesData); // preload all images

    // Load flags
    countriesDataShuffled.forEach(countryData => {
      let countryCode = countryData.code;
      let countryName = countryData.name;
      flagsContainer.append(`
      <div class="flag-container" data-country="${countryName}">
        <div class="flag-image-container-upper">
          <div class="flag-image-container">
            <img src="./assets/flags/${countryCode}.png" class="flag" data-code="${countryCode}">
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
        let altName = country.name;

        // for alternative names
        if (Object.values(alternatives).includes(country.name)) {
          for (let alt in alternatives) {
             if (alternatives[alt] === country.name) {
              altName = alt;
              break;
             }
          }
        }

        return activeFilters.includes(country.continent) && (
          country.name.match(new RegExp(`${searchVal}.*`, 'i')) ||
          altName.match(new RegExp(`${searchVal}.*`, 'i'))
          );
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
    
    // Focus-view flag
    $('.flag').on('click', function() {
      const ANIM_MS = 280;
      let countryCode = $(this).attr('data-code');

      // Preload flag
      let image = new Image();

      image.src = `../assets/flags/${countryCode}.png`;
      $('.flag-focus-image').attr({
        'src': `../assets/flags/${countryCode}.png`,
        'data-code': countryCode
      });

      // transition
      $('.parent-container').css({
        'pointerEvents': 'none',
        'userSelect': 'none'
      }).animate({
        'opacity': 0.2
      }, ANIM_MS);

      $('.flag-focus-parent-wrapper').css('display', 'flex').animate({
        'opacity': 1
      }, ANIM_MS);

      // focus-out
      $('.flag-focus-parent-wrapper').on('click', function(){
        $('.parent-container').animate({
          'opacity': 1
        }, ANIM_MS, function(){
          $(this).css({
            'pointerEvents': 'auto',
            'userSelect': 'auto'
          });
        });

        $('.flag-focus-parent-wrapper').animate({
          'opacity': 0
        }, ANIM_MS, function() {
          $(this).css('display', 'none');
          $('.flag-focus-image').attr({
            'src': '',
            'data-code': ''
          });
        });

        $('.flag-focus-parent-wrapper').off('click');
      });

      return; 
    });

    // set flags count
    function setFlags() {
      let totalFlags = parsedCountriesData.length;
      // set flag count
      let currFlagsCount = filteredCountries.length;
      $('#flagsCount').text(currFlagsCount);

      currFlagsCount === 0 ? $('#flagsCount').css('color', '#e61e10')
      : currFlagsCount < totalFlags ? $('#flagsCount').css('color', '#cee40d')
      : $('#flagsCount').css('color', '#0de454');
    };
  }); 

  // Preload Flags
  function preloadFlags(countriesData) {
    let continents = [
      'asia_satellite',
      'europe_satellite',
      'north_america_satellite',
      'south_america_satellite',
      'africa_satellite',
      'oceania_satellite',
      'antarctica_satellite'
    ];

    continents.forEach(continent => {
      let image = new Image();
      image.src = `../assets/img/${continent}.jpg`
    });

    countriesData.forEach(countryObj => {
      let image = new Image();
      image.src = `../assets/flags/${countryObj.code}.png`
    });
  }

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
