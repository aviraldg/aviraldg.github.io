(function () {
    'use strict';

    function processInternalLinks() {
        var elements = document.querySelectorAll('[id]');
        for(var i = 0; i < elements.length; i++) {
            var elem = elements[i];
            if(!/H\d/.test(elem.nodeName))
                continue;
            var link = document.createElement("a");
            link.href = "#" + elem.id;
            elem.parentNode.replaceChild(link, elem);
            link.appendChild(elem);
        }
    }

    window.addEventListener('load', function () {
        processInternalLinks();
    });
})();


