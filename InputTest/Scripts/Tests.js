"use strict";

var currentTest;
var log;

window.console = {
    log: function (str) {
        log.innerHTML += '<span class="pass">' + str + '</span><br />';
    },
    error: function (str) {
        log.innerHTML += '<span class="error">' + str + '</span><br />';
    },
    fail: function (str) {
        log.innerHTML += '<span class="fail">' + str + '</span><br />';
    }
}

function Test(name, func) {

    currentTest = { name: name, errors: [] };

    try {
        func();
    } catch (e) {
        currentTest.errors.push(e.message);
        console.error(e);
    }

    if (currentTest.errors.length === 0) {
        console.log('Test Passed: ' + name);
    } else {
        console.fail('Test Failed: ' + name);
    }

    currentTest = null;
}

function AssertEqual(actual, expected, msg) {

    if (actual !== expected) {

        msg = msg || 'Expected "' + expected + '", Actual "' + actual + '"';
        currentTest.errors.push(msg);
        console.error(msg);
    }
}

function CheckValidity(element, expectValid, reason) {

    var handler = function (e) { firedInvalid = true; };
    var firedInvalid = false;

    element.addEventListener('invalid', handler, false);
            
    AssertEqual(element.checkValidity(), expectValid);
    AssertEqual(element.validity.valid, expectValid);

    element.removeEventListener('invalid', handler, false);

    AssertEqual(firedInvalid, !expectValid, 'element should fire invalid event iff checkValidity returns false');

    if (!expectValid) {

        AssertEqual(element.validity[reason], true, 'invalid element should communicate what state it is in');
    }
}

function TestDates() {

    log.innerHTML += '<h3>Date Test Results</h3>';

    Test('input type="date" with invalid min', function () {

        var date = document.getElementById('date_invalid_min');
        AssertEqual(date.min, 'invalid');
        AssertEqual(date.value, '0001-01-01', 'no minimum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="date" with incomplete min', function () {

        var date = document.getElementById('date_incomplete_min');
        AssertEqual(date.min, '2014-07');
        AssertEqual(date.value, '0001-01-01', 'no minimum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="date" with valid min', function () {

        var date = document.getElementById('date_valid_min');
        AssertEqual(date.min, '2014-07-01');
        AssertEqual(date.value, '2014-06-30', 'minimum is enforced');
        CheckValidity(date, false, 'rangeUnderflow');
    });

    Test('input type="date" with invalid max', function () {

        var date = document.getElementById('date_invalid_max');
        AssertEqual(date.max, 'invalid');
        AssertEqual(date.value, '9999-09-13', 'no maximum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="date" with incomplete max', function () {

        var date = document.getElementById('date_incomplete_max');
        AssertEqual(date.max, '2014-08');
        AssertEqual(date.value, '9999-09-13', 'no maximum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="date" with valid max', function () {

        var date = document.getElementById('date_valid_max');
        AssertEqual(date.max, '2014-07-08');
        AssertEqual(date.value, '2014-07-09', 'maximum is enforced');
        CheckValidity(date, false, 'rangeOverflow');
    });

    Test('input type="date" with min greater than max', function () {

        var date = document.getElementById('date_min_greater_max');
        AssertEqual(date.min, '2014-09-01');
        AssertEqual(date.max, '2014-07-01');

        date.value = '2014-08-31';
        CheckValidity(date, false, 'rangeUnderflow');

        date.value = '2014-09-02';
        CheckValidity(date, false, 'rangeOverflow');
    });

    Test('input type="date" with invalid value', function () {

        var date = document.getElementById('date_invalid_value');
        AssertEqual(date.value, '', 'value should be sanitized');
        CheckValidity(date, true);
    });

    Test('input type="date" with incomplete value', function () {

        var date = document.getElementById('date_incomplete_value');
        AssertEqual(date.value, '');
        CheckValidity(date, true);
    });

    Test('input type="date" with valid value and range', function () {

        var date = document.getElementById('date_value_range');
        AssertEqual(date.value, '2014-08-01');
        CheckValidity(date, true);
    });

    Test('input type="date" with valid value', function () {

        var date = document.getElementById('date_valid_value');
        AssertEqual(date.type, 'date');
        AssertEqual(date.value, '2014-07-08');
        AssertEqual(date.valueAsNumber, 1404777600000, 'valuesAsNumber should be midnight UTC on the given date');
        AssertEqual(date.valueAsDate.valueOf(), new Date(1404777600000).valueOf());
        CheckValidity(date, true);
    });

    Test('input type="date" with invalid step', function () {

        var date = document.getElementById('date_invalid_step');
        AssertEqual(date.step, 'invalid');

        date.stepUp();
        AssertEqual(date.value, '2014-07-09', 'element should use default step size of 1');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-07-08', 'element should use default step size of 1');
        CheckValidity(date, true);
    });

    Test('input type="date" with negative step', function () {

        var date = document.getElementById('date_negative_step');
        AssertEqual(date.step, '-7');

        date.stepUp();
        AssertEqual(date.value, '2014-07-09', 'element should use default step size of 1');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-07-08', 'element should use default step size of 1');
        CheckValidity(date, true);
    });

    Test('input type="date" with any step', function () {

        var date = document.getElementById('date_any_step');
        AssertEqual(date.step, 'any');

        var threw = 0;

        try {
            date.stepUp();
        } catch (e) {
            AssertEqual(e.name, 'InvalidStateError');
            threw++;
        }

        try {
            date.stepDown();
        } catch (e) {
            AssertEqual(e.name, 'InvalidStateError');
            threw++;
        }

        AssertEqual(threw, 2, 'stepUp() and stepDown() may not be called when there is no allowed step.');
    });

    Test('input type="date" with valid numeric step', function () {

        var date = document.getElementById('date_valid_step');
        AssertEqual(date.step, '7');

        date.stepUp();
        AssertEqual(date.value, '2014-07-15', 'element should use step size of 7');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-07-08', 'element should use step size of 7');
        CheckValidity(date, true);

        date.stepUp(3);
        AssertEqual(date.value, '2014-07-29');
        CheckValidity(date, true);

        date.stepDown(3);
        AssertEqual(date.value, '2014-07-08');
        CheckValidity(date, true);
    });

    Test('input type="date" with valid floating point step', function () {

        var date = document.getElementById('date_floating_step');
        AssertEqual(date.step, '7.6');

        date.stepUp();
        AssertEqual(date.value, '2014-07-16', 'element should use step size of 7');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-07-08', 'element should use step size of 7');
        CheckValidity(date, true);
    });

    Test('input type="date" with step mismatch', function () {

        var date = document.getElementById('date_step_mismatch');
        AssertEqual(date.step, '7');
        AssertEqual(date.min, '2014-07-08');
        AssertEqual(date.value, '2014-07-10');
        CheckValidity(date, false, 'stepMismatch');
    });

    Test('input type="date" with valid value and step base defined', function () {

        var date = document.getElementById('date_step_base');
        AssertEqual(date.step, '7');
        AssertEqual(date.min, '2014-07-08');
        AssertEqual(date.value, '2014-07-15');
        CheckValidity(date, true);
    });

    Test('input type="date" with dynamic values', function () {

        var date = document.getElementById('date_dynamic');

        date.value = '2014-07-08';
        AssertEqual(date.value, '2014-07-08');
        CheckValidity(date, true);

        date.valueAsNumber = 1404889200000;
        AssertEqual(date.valueAsNumber, 1404864000000, 'value should be set to midnight UTC on the date corresponding to the given timestamp');
        AssertEqual(date.value, '2014-07-09', 'element should accept numbers as input to valueAsNumber');
        CheckValidity(date, true);

        date.valueAsDate = new Date(1404950400000);
        AssertEqual(date.valueAsDate.valueOf(), new Date(1404950400000).valueOf());
        AssertEqual(date.value, '2014-07-10', 'element should accept Date objects as input to valueAsDate');
        CheckValidity(date, true);
    });

    Test('input type="date" date segments', function () {

        var cases = [
            { val: '0000-01-01', description: 'year too low' },
            { val: '275761-01-01', description: 'year too high' },
            { val: '2014-00-01', description: 'month too low' },
            { val: '2014-13-01', description: 'month too high' },
            { val: '2014-01-00', description: 'day too low' },
            { val: '2014-01-32', description: 'day too high in 31-day month' },
            { val: '2014-01-31', valid: true, description: '31-day month' },
            { val: '2014-09-31', description: 'day too high in 30-day month' },
            { val: '2014-09-30', valid: true, description: '30-day month' },
            { val: '2014-02-29', description: 'day too high in February for a non-leap year' },
            { val: '2014-02-28', valid: true, description: 'February for a non-leap year' },
            { val: '2012-02-30', description: 'day too high in February for a leap year' },
            { val: '2012-02-29', valid: true, description: 'February for a leap year' },
            { val: '1700-02-29', description: 'every year divisible by 4 is a leap year except for years divisible by 100' },
            { val: '2000-02-29', valid: true, description: 'years divisible by 100 and 400 are leap years' },
        ];

        var date = document.getElementById('date_dynamic');

        cases.forEach(function (ca) {

            date.value = ca.val;

            if (ca.valid) {
                AssertEqual(date.value, ca.val, ca.description);
            } else {
                AssertEqual(date.value, '', ca.description);
            }
        });
    });
}

function TestMonths() {

    log.innerHTML += '<h3>Month Test Results</h3>';

    Test('input type="month" with invalid min', function () {

        var date = document.getElementById('month_invalid_min');
        AssertEqual(date.min, 'invalid');
        AssertEqual(date.value, '0001-01', 'no minimum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="month" with incomplete min', function () {

        var date = document.getElementById('month_incomplete_min');
        AssertEqual(date.min, '2014');
        AssertEqual(date.value, '0001-01', 'no minimum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="month" with valid min', function () {

        var date = document.getElementById('month_valid_min');
        AssertEqual(date.min, '2014-07');
        AssertEqual(date.value, '2014-06', 'minimum is enforced');
        CheckValidity(date, false, 'rangeUnderflow');
    });

    Test('input type="month" with invalid max', function () {

        var date = document.getElementById('month_invalid_max');
        AssertEqual(date.max, 'invalid');
        AssertEqual(date.value, '9999-09', 'no maximum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="month" with incomplete max', function () {

        var date = document.getElementById('month_incomplete_max');
        AssertEqual(date.max, '2014');
        AssertEqual(date.value, '9999-09', 'no maximum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="month" with valid max', function () {

        var date = document.getElementById('month_valid_max');
        AssertEqual(date.max, '2014-07');
        AssertEqual(date.value, '2014-08', 'maximum is enforced');
        CheckValidity(date, false, 'rangeOverflow');
    });

    Test('input type="month" with min greater than max', function () {

        var date = document.getElementById('month_min_greater_max');
        AssertEqual(date.min, '2014-10');
        AssertEqual(date.max, '2014-07');

        date.value = '2014-09';
        CheckValidity(date, false, 'rangeUnderflow');

        date.value = '2014-08';
        CheckValidity(date, false, 'rangeOverflow');
    });

    Test('input type="month" with invalid value', function () {

        var date = document.getElementById('month_invalid_value');
        AssertEqual(date.value, '', 'value should be sanitized');
        CheckValidity(date, true);
    });

    Test('input type="month" with incomplete value', function () {

        var date = document.getElementById('month_incomplete_value');
        AssertEqual(date.value, '');
        CheckValidity(date, true);
    });

    Test('input type="month" with valid value and range', function () {

        var date = document.getElementById('month_value_range');
        AssertEqual(date.value, '2014-08');
        CheckValidity(date, true);
    });

    Test('input type="month" with valid value', function () {

        var date = document.getElementById('month_valid_value');
        AssertEqual(date.type, 'month');
        AssertEqual(date.value, '2014-07');
        AssertEqual(date.valueAsNumber, 534, 'valuesAsNumber should be number of months between given month and January 1970');
        AssertEqual(date.valueAsDate.valueOf(), new Date(1404172800000).valueOf());
        CheckValidity(date, true);
    });

    Test('input type="month" with invalid step', function () {

        var date = document.getElementById('month_invalid_step');
        AssertEqual(date.step, 'invalid');

        date.stepUp();
        AssertEqual(date.value, '2014-08', 'element should use default step size of 1');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-07', 'element should use default step size of 1');
        CheckValidity(date, true);
    });

    Test('input type="month" with negative step', function () {

        var date = document.getElementById('month_negative_step');
        AssertEqual(date.step, '-2');

        date.stepUp();
        AssertEqual(date.value, '2014-08', 'element should use default step size of 1');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-07', 'element should use default step size of 1');
        CheckValidity(date, true);
    });

    Test('input type="month" with any step', function () {

        var date = document.getElementById('month_any_step');
        AssertEqual(date.step, 'any');

        var threw = 0;

        try {
            date.stepUp();
        } catch (e) {
            AssertEqual(e.name, 'InvalidStateError');
            threw++;
        }

        try {
            date.stepDown();
        } catch (e) {
            AssertEqual(e.name, 'InvalidStateError');
            threw++;
        }

        AssertEqual(threw, 2, 'stepUp() and stepDown() may not be called when there is no allowed step.');
    });

    Test('input type="month" with valid numeric step', function () {

        var date = document.getElementById('month_valid_step');
        AssertEqual(date.step, '2');

        date.stepUp();
        AssertEqual(date.value, '2014-09', 'element should use step size of 2');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-07', 'element should use step size of 2');
        CheckValidity(date, true);

        date.stepUp(3);
        AssertEqual(date.value, '2015-01');
        CheckValidity(date, true);

        date.stepDown(3);
        AssertEqual(date.value, '2014-07');
        CheckValidity(date, true);
    });

    Test('input type="month" with valid floating point step', function () {

        var date = document.getElementById('month_floating_step');
        AssertEqual(date.step, '1.6');

        date.stepUp();
        AssertEqual(date.value, '2014-09', 'element should use step size of 2');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-07', 'element should use step size of 2');
        CheckValidity(date, true);
    });

    Test('input type="month" with step mismatch', function () {

        var date = document.getElementById('month_step_mismatch');
        AssertEqual(date.step, '2');
        AssertEqual(date.min, '2014-07');
        AssertEqual(date.value, '2014-08');
        CheckValidity(date, false, 'stepMismatch');
    });

    Test('input type="month" with valid value and step base defined', function () {

        var date = document.getElementById('month_step_base');
        AssertEqual(date.step, '2');
        AssertEqual(date.min, '2014-07');
        AssertEqual(date.value, '2014-09');
        CheckValidity(date, true);
    });

    Test('input type="month" with dynamic values', function () {

        var date = document.getElementById('month_dynamic');

        date.value = '2014-07';
        AssertEqual(date.value, '2014-07');
        CheckValidity(date, true);

        date.valueAsNumber = 535;
        AssertEqual(date.valueAsNumber, 535);
        AssertEqual(date.value, '2014-08', 'element should accept numbers as input to valueAsNumber');
        CheckValidity(date, true);

        date.valueAsDate = new Date(1409529600000);
        AssertEqual(date.valueAsDate.valueOf(), new Date(1409529600000).valueOf());
        AssertEqual(date.value, '2014-09', 'element should accept Date objects as input to valueAsDate');
        CheckValidity(date, true);
    });

    Test('input type="month" date segments', function () {

        var cases = [
            { val: '0000-01', description: 'year too low' },
            { val: '275761-01', description: 'year too high' },
            { val: '2014-00', description: 'month too low' },
            { val: '2014-01', valid: true, description: 'January' },
            { val: '2014-12', valid: true, description: 'December' },
            { val: '2014-13', description: 'month too high' }
        ];

        var date = document.getElementById('month_dynamic');

        cases.forEach(function (ca) {

            date.value = ca.val;

            if (ca.valid) {
                AssertEqual(date.value, ca.val, ca.description);
            } else {
                AssertEqual(date.value, '', ca.description);
            }
        });
    });
}

function TestWeeks() {

    log.innerHTML += '<h3>Week Test Results</h3>';

    Test('input type="week" with invalid min', function () {

        var date = document.getElementById('week_invalid_min');
        AssertEqual(date.min, 'invalid');
        AssertEqual(date.value, '0001-W01', 'no minimum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="week" with incomplete min', function () {

        var date = document.getElementById('week_incomplete_min');
        AssertEqual(date.min, '2014-W');
        AssertEqual(date.value, '0001-W01', 'no minimum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="week" with valid min', function () {

        var date = document.getElementById('week_valid_min');
        AssertEqual(date.min, '2014-W28');
        AssertEqual(date.value, '2014-W27', 'minimum is enforced');
        CheckValidity(date, false, 'rangeUnderflow');
    });

    Test('input type="week" with invalid max', function () {

        var date = document.getElementById('week_invalid_max');
        AssertEqual(date.max, 'invalid');
        AssertEqual(date.value, '9999-W37', 'no maximum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="week" with incomplete max', function () {

        var date = document.getElementById('week_incomplete_max');
        AssertEqual(date.max, '2014-W');
        AssertEqual(date.value, '9999-W37', 'no maximum is enforced');
        CheckValidity(date, true);
    });

    Test('input type="week" with valid max', function () {

        var date = document.getElementById('week_valid_max');
        AssertEqual(date.max, '2014-W28');
        AssertEqual(date.value, '2014-W29', 'maximum is enforced');
        CheckValidity(date, false, 'rangeOverflow');
    });

    Test('input type="week" with min greater than max', function () {

        var date = document.getElementById('week_min_greater_max');
        AssertEqual(date.min, '2014-W31');
        AssertEqual(date.max, '2014-W28');

        date.value = '2014-W30';
        CheckValidity(date, false, 'rangeUnderflow');

        date.value = '2014-W29';
        CheckValidity(date, false, 'rangeOverflow');
    });

    Test('input type="week" with invalid value', function () {

        var date = document.getElementById('week_invalid_value');
        AssertEqual(date.value, '', 'value should be sanitized');
        CheckValidity(date, true);
    });

    Test('input type="week" with incomplete value', function () {

        var date = document.getElementById('week_incomplete_value');
        AssertEqual(date.value, '');
        CheckValidity(date, true);
    });

    Test('input type="week" with valid value and range', function () {

        var date = document.getElementById('week_value_range');
        AssertEqual(date.value, '2014-W29');
        CheckValidity(date, true);
    });

    Test('input type="week" with valid value', function () {

        var date = document.getElementById('week_valid_value');
        AssertEqual(date.type, 'week');
        AssertEqual(date.value, '2014-W28');
        AssertEqual(date.valueAsNumber, 1404691200000, 'valuesAsNumber should be the elapsed millisecond between Jan 1 1970 and midnight Monday of the given week');
        AssertEqual(date.valueAsDate.valueOf(), new Date(1404691200000).valueOf());
        CheckValidity(date, true);
    });

    Test('input type="week" with invalid step', function () {

        var date = document.getElementById('week_invalid_step');
        AssertEqual(date.step, 'invalid');

        date.stepUp();
        AssertEqual(date.value, '2014-W29', 'element should use default step size of 1');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-W28', 'element should use default step size of 1');
        CheckValidity(date, true);
    });

    Test('input type="week" with negative step', function () {

        var date = document.getElementById('week_negative_step');
        AssertEqual(date.step, '-2');

        date.stepUp();
        AssertEqual(date.value, '2014-W29', 'element should use default step size of 1');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-W28', 'element should use default step size of 1');
        CheckValidity(date, true);
    });

    Test('input type="week" with any step', function () {

        var date = document.getElementById('week_any_step');
        AssertEqual(date.step, 'any');

        var threw = 0;

        try {
            date.stepUp();
        } catch (e) {
            AssertEqual(e.name, 'InvalidStateError');
            threw++;
        }

        try {
            date.stepDown();
        } catch (e) {
            AssertEqual(e.name, 'InvalidStateError');
            threw++;
        }

        AssertEqual(threw, 2, 'stepUp() and stepDown() may not be called when there is no allowed step.');
    });

    Test('input type="week" with valid numeric step', function () {

        var date = document.getElementById('week_valid_step');
        AssertEqual(date.step, '2');

        date.stepUp();
        AssertEqual(date.value, '2014-W30', 'element should use step size of 2');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-W28', 'element should use step size of 2');
        CheckValidity(date, true);

        date.stepUp(3);
        AssertEqual(date.value, '2014-W34');
        CheckValidity(date, true);

        date.stepDown(3);
        AssertEqual(date.value, '2014-W28');
        CheckValidity(date, true);
    });

    Test('input type="week" with valid floating point step', function () {

        var date = document.getElementById('week_floating_step');
        AssertEqual(date.step, '1.6');

        date.stepUp();
        AssertEqual(date.value, '2014-W30', 'element should use step size of 2');
        CheckValidity(date, true);

        date.stepDown();
        AssertEqual(date.value, '2014-W28', 'element should use step size of 2');
        CheckValidity(date, true);
    });

    Test('input type="week" with step mismatch', function () {

        var date = document.getElementById('week_step_mismatch');
        AssertEqual(date.step, '2');
        AssertEqual(date.min, '2014-W28');
        AssertEqual(date.value, '2014-W29');
        CheckValidity(date, false, 'stepMismatch');
    });

    Test('input type="week" with valid value and step base defined', function () {

        var date = document.getElementById('week_step_base');
        AssertEqual(date.step, '2');
        AssertEqual(date.min, '2014-W28');
        AssertEqual(date.value, '2014-W30');
        CheckValidity(date, true);
    });

    Test('input type="week" with dynamic values', function () {

        var date = document.getElementById('week_dynamic');

        date.value = '2014-W28';
        AssertEqual(date.value, '2014-W28');
        CheckValidity(date, true);

        date.valueAsNumber = 1405468800000;
        AssertEqual(date.valueAsNumber, 1405296000000, 'valueAsNumber should be adjusted to midnight Monday of the given week');
        AssertEqual(date.value, '2014-W29', 'element should accept numbers as input to valueAsNumber');
        CheckValidity(date, true);

        date.valueAsDate = new Date(1405900800000);
        AssertEqual(date.valueAsDate.valueOf(), new Date(1405900800000).valueOf());
        AssertEqual(date.value, '2014-W30', 'element should accept Date objects as input to valueAsDate');
        CheckValidity(date, true);
    });

    Test('input type="week" date segments', function () {

        var cases = [
            { val: '0000-W01', description: 'year too low' },
            { val: '275761-W01', description: 'year too high' },
            { val: '2014-W00', description: 'week too low' },
            { val: '2014-W01', valid: true, description: 'first week' },
            { val: '2014-W52', valid: true, description: 'last week' },
            { val: '2014-W53', description: 'week too high' }
        ];

        var date = document.getElementById('week_dynamic');

        cases.forEach(function (ca) {

            date.value = ca.val;

            if (ca.valid) {
                AssertEqual(date.value, ca.val, ca.description);
            } else {
                AssertEqual(date.value, '', ca.description);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function (e) {

    log = document.getElementById('log');

    TestDates();
    TestMonths();
    TestWeeks();

}, false);

