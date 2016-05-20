(function() {

    function setError(elm, errors) {
        if (Array.isArray(errors))
            elm.parentElement.lastElementChild.innerText = errors.join('\n');
        else
            elm.parentElement.lastElementChild.innerText = errors;
    }


    function setCommunicate(elm, array, text, status) {

        function removeOld(myNode) {
            var fc = myNode.querySelectorAll('div')[0];

            while (fc) {
                myNode.removeChild(fc);
                fc = myNode.querySelectorAll('div')[0];
            }
        }

        removeOld(elm.parentElement.lastElementChild);
        removeOld(elm.parentElement.lastElementChild.previousElementSibling);

        var element;
        var div = document.createElement('div');
        if (status === 'error')
            element = elm.parentElement.lastElementChild;
        else
            element = elm.parentElement.lastElementChild.previousElementSibling;

        div.innerHTML = '<b>' + text + '</b>';
        element.appendChild(div);
        var result = document.createElement('div');

        if (Array.isArray(array))
            result.innerText = array.join('\n');
        else
            result.innerText = array;

        element.appendChild(result);

    }


    var texts = [];

    function handleFileSelect(evt) {
        var files = evt.target.files;
        var namesFiles = [];
        var uploadFiles = document.getElementById("uploadFiles");
        var errors = [];
        var success = [];
        for (var i = 0, f; f = files[i]; i++) {
            var textType = /text.*/;

            if (f.type.match(textType)) {
                var reader = new FileReader();
                namesFiles.push(f.name);
                reader.onload = (function(theFile) {
                    return function(e) {
                        texts.push(reader.result);
                    };
                })(f);
                reader.readAsText(f);
                success.push(f.name);

            } else {
                var error = f.name + ' is not a text file';
                errors.push(error);
            }

            if (!namesFiles.length) {
                search.parentElement.style.display = 'none';
                loader.parentElement.style.display = 'none';
            } else {
                search.value = '';
                result.innerHTML = '';
                loader.parentElement.style.display = 'none';
                search.parentElement.style.display = 'block';
                search.parentElement.querySelectorAll('div.error')[0].innerHTML = '';

            }
            uploadFiles.value = namesFiles.join(', ');
            setCommunicate(file, errors, 'Those files aren\'t text format', 'error');
            setCommunicate(file, success, 'We found text files format:');
        }
    }

    function searchInTexts(evt) {
        var searchTerm = evt.target.value.trim();
        if (!searchTerm) {
            setCommunicate(search, '', 'Not search term', 'error');
            return;
        }


        var allWords = [];
        texts.forEach(function(text) {
            var textSplited = text.split(' ');
            var words = textSplited.filter(function(n) {
                if (!!n) return n; });
            allWords = allWords.concat(words);
        });

        var len = allWords.length;
        var i = 0;
        var found = false;
        var start = new Date().getMilliseconds();
        var num = 0;
        var end = 0;
        loader.parentElement.style.display = 'block';
        loader.style.width = 0;
        for (i; i < len; i++) {
            setTimeout(function() {
                (function(num) {
                    for (num; num <= 100; num++) {
                        loader.style.width = num + '%';
                    }
                    return num;
                })(num);
            }, 10);


            if (searchTerm === allWords[i]) {
                found = true;
                end = new Date().getMilliseconds();
                break;
            }
        }

        var text;
        var result = document.getElementById('result');
        if (found) {
            var time = end - start;
            var seconds = (time / 1000) % 60;
            text = "I've found the term: " + "<b>" + searchTerm + "</b>" + ' within ' + seconds + 's';
            result.innerHTML = text;
        } else {
            result.innerHTML = 'Not found this expression';
        }
        setCommunicate(search, '', '', 'error');
    }
    var loader = document.getElementById('loader');
    var search = document.getElementById("search");
    search.addEventListener("change", searchInTexts, false);

    var file = document.getElementById('file');
    file.addEventListener("change", handleFileSelect, false);
})();
