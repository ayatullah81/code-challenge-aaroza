 // GLOABAL VARIABLES
var root = null,
useHash = false,
hash = '!#'

// getElementById wrapper
function $id(id) {
  return document.getElementById(id);
}
  // asyncrhonously fetch the html template partial from the file directory,
  // then set its contents to the html of the parent element
  // ***Load all countries data*** //
function loadHTMLWithAllCountry(url, id) {
  req = new XMLHttpRequest();
  req.open('GET', url);
  req.send();
  req.onload = () => {
    $id(id).innerHTML = req.responseText;
  };
  loadAllCountriesData();
  }
  /********Load single Country ***********/
function loadHTMLWithSingleCountry(url, id, code) {
  req = new XMLHttpRequest();
  req.open('GET', url);
  req.send();
  req.onload = () => {
    $id(id).innerHTML = req.responseText;
    singleCountryInfo = document.querySelector('#single-cntry');
    loadSingleCountryData(code);
  };
   
}
/* Register --var router-- with Navigo */
var router = new Navigo(root, useHash, hash);
// For single country
router.on({
  // 'view' is the id of the div element inside which we render the HTML
  'countries/:code': (params) => { 
    loadHTMLWithSingleCountry('./templates/singleCountries.html', 'view', params.code); }
});
// For all countries
router.on({
  // 'view' is the id of the div element inside which we render the HTML
  'countries': () => { loadHTMLWithAllCountry('./templates/countries.html', 'view'); }
});
  
// set the default route
router.on(() => { $id('view').innerHTML = '<h2>Here by default</h2> <h3>you can find all countries <a id="refLink" href="#">here</a></h3>'; });
// set the 404 route
router.notFound((query) => { $id('view').innerHTML = '<h3>Couldn\'t find the page  you\'re looking for...</h3>';});
  
router.resolve();

/*************** FETCH DATA from countries api *******************
***************and manupulate dom elements here..****************
*****************************************************************/
function loadSingleCountryData(code) {
  
  fetch('https://countriesnode.herokuapp.com/v1/countries/'+code)
  .then(res => {
    return res.json()
  })
  .then(data => {
    var output = `
        <div class="box">
          <p>Country Name: ${data.name}</p>
          <p>currency: ${data.currency}</p>
          <p>phone: ${data.phone}</p>
        </div>
      `;
    singleCountryInfo.innerHTML = output;
  })
  .catch(err => singleCountryInfo.innerHTML = '<h1>Can\'t found in this <span class = "highlight">code</span> area</h1><p class = "highlight">try another...</p>')
}
loadSingleCountryData();

function loadAllCountriesData () {
  fetch('https://countriesnode.herokuapp.com/v1/countries')
  .then(res => {
    return res.json()
  })
  .then(data => {
    let output = '';
    var countriesInf = document.querySelector('#countries-info');
    data.forEach(data => {
      var lang = data.languages;
      output += `<div class="box">
                    <p>country name : ${data.name}</p>
                    <p>Language : ${lang.join(' , ')}</p>
                    <p>Native : ${data.native}</p>
                    <p>Continent : ${data.continent}</p>
                </div>`
    })
    countriesInf.innerHTML = output;
  })
  .catch(err => console.log(err))
}
loadAllCountriesData();

/************ Direct LINK/Reference link**************/
var refLink = window.location.href;
var absRefLink = refLink.split('/');
if(absRefLink[absRefLink.length - 1] == 'index.html'){
  absRefLink.splice(absRefLink.length-1, 1);
  var abs = absRefLink.join('/');
  document.querySelector('#refLink').href = abs+'/#!countries';
}else {
  document.querySelector('#refLink').href = refLink+'#!countries';
}
