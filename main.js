(function(){


  function setError (elm, errors){
    if (Array.isArray(errors))
      elm.parentElement.lastElementChild.innerText = errors.join('\n');
    else
      elm.parentElement.lastElementChild.innerText = errors;
  }

  var texts = [];
  function handleFileSelect(evt) {
    var files = evt.target.files; // FilesList object


    var namesFiles = [];
    var uploadFiles = document.getElementById("uploadFiles");
    var errors = [];
    for (var i = 0, f; f = files[i]; i++) {


      var textType = /text.*/;

      if (f.type.match(textType)) {
          var reader = new FileReader();

        namesFiles.push(f.name);

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e){
            texts.push(reader.result);
          };

        })(f);
        reader.readAsText(f);
      } else {
        var error = f.name + ' is not a text file';
        errors.push(error);
      }

      if(!namesFiles.length) {
        uploadFiles.disabled = true;
        search.parentElement.style.display = 'none';
        loader.parentElement.style.display = 'none';
      } else {
        uploadFiles.disabled = false;
        search.value = '';
        search.parentElement.style.display = 'block';
      }
      uploadFiles.value = namesFiles.join(', ');
      setError(file, errors);

    }
  };



function searchInTexts(evt){
  var searchTerm = evt.target.value.trim();
  if(!searchTerm) {
    setError(search, 'Not search term');
    return;
  }

  if(!texts.length){
    setError(file, 'Not file or file is empty');
    return;
  }

  var allWords = [];
  texts.forEach(function(text){
    var textSplited = text.split(' ');
    var words = textSplited.filter(function(n){ if(!!n) return n; });
    allWords = allWords.concat(words);
  });


  var len = allWords.length;
  var i=0;
  var found = false;
  var start = new Date().getMilliseconds();
  var num = 0;
  var end = 0;
  loader.parentElement.style.display = 'block';
  loader.style.width = 0;
  for (i; i<len; i++){
    setTimeout(function(){
      (function(num){
        for(num; num<=100; num++) {
          loader.style.width = num + '%';
        }
        return num;
      })(num);
    }, 100);


    if(searchTerm === allWords[i]) {
      found = true;
      end = new Date().getMilliseconds();
      break;
    }
  }

  var element = document.createElement('div');
  var text;
  var result = document.getElementById('result');
  if(found){
    var time = end - start;
    text = "I've found the term: " + "<b>" + searchTerm + "</b>" + ' within ' + time;
    result.innerHTML = text;
    setError(search, '');
  } else {
    text = 'Not this serach term: ' + searchTerm + "'";
    result.innerHTML = 'Not found';
    setError(search, text);
  }
}

var loader = document.getElementById('loader');

var search = document.getElementById("search");
search.addEventListener("change", searchInTexts, false);


var file = document.getElementById('file');
file.addEventListener("change", handleFileSelect, false);
})();
