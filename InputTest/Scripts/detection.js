function TestCapabilities() {
    if (!Modernizr.inputtypes.date) {
        document.getElementById('dateinput').innerHTML += '<span class="fail">The date input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.time) {
        document.getElementById('timeinput').innerHTML += '<span class="fail">The time input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.month) {
        document.getElementById('monthinput').innerHTML += '<span class="fail">The month input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.week) {
        document.getElementById('weekinput').innerHTML += '<span class="fail">The week input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.datetime) {
        document.getElementById('datetimeinput').innerHTML += '<span class="fail">The datetime input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes['datetime-local']) {
        document.getElementById('datetimelocalinput').innerHTML += '<span class="fail">The datetime-local input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.email) {
        document.getElementById('emailinput').innerHTML += '<span class="fail">The email input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.number) {
        document.getElementById('numberinput').innerHTML += '<span class="fail">The number input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.tel) {
        document.getElementById('telinput').innerHTML += '<span class="fail">The tel input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.url) {
        document.getElementById('urlinput').innerHTML += '<span class="fail">The url input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.search) {
        document.getElementById('searchinput').innerHTML += '<span class="fail">The search input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.color) {
        document.getElementById('colorinput').innerHTML += '<span class="fail">The color input type is not supported by your browser.</span>'
    }

    if (!Modernizr.inputtypes.range) {
        document.getElementById('rangeinput').innerHTML += '<span class="fail">The range input type is not supported by your browser.</span>'
    }
}

document.addEventListener('DOMContentLoaded', function (e) {

    TestCapabilities();

}, false);
