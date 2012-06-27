$.fn.makeWindowed = function ()
{
    var html =
    "<iframe style=\"position: absolute; display: block; " +
    "z-index: -1; width: 100%; height: 100%; top: 0; left: 0;" +
    "filter: mask(); background-color: #ffffff; \"></iframe>";
    if (this) $(this)[0].innerHTML += html;
    // force refresh of div
    var olddisplay = $(this)[0].style.display;
    $(this)[0].style.display = 'none';
    $(this)[0].style.display = olddisplay;
}

$(document).ready(function() {
    /* IE6 */
    if ($.browser.msie && $.browser.version.substr(0,1) < 7) {
        setInterval(function() {
            if($('#ui-datepicker-div > div:first').is('div') && !$('#ui-datepicker-div > iframe:first').is('iframe')) {
                $('#ui-datepicker-div').makeWindowed();
            }
        }, 300);
    }
    
    /* POPUP */
    $('#mask').height($(document).height());
    $('#popup a.close, #popup a.cancel').click(function(e) {
        e.preventDefault();
        $('#popup').fadeOut(function() {
            $('#mask').hide();
        });
    });
    
    $('ul.downloads li a').click(function(e) {
        e.preventDefault();
        $('#mask').show();
        $('#popup').fadeIn();
        $('#popup a.submit').attr('href', $(this).attr('href'));
    });

    /* FORM */
    $('dl.form > dt:not(.free) + dd > input[class^="text"], dl.form > dt:not(.free) + dd > textarea').blur(function(e) {
        if($(this).val() == '' || ($(this).attr('id').match(/^.?email$/) && !$(this).val().match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i))) {
            $(this).parent().addClass('invalid' + ($(this).is('textarea') ? '-textarea' : ($(this).parent().hasClass('below') ? '-below' : '' )));
        } else {
            $(this).parent().removeClass('invalid').removeClass('invalid-textarea').removeClass('invalid-below');
        }
    });
    
    $('form').submit(function(e) {
        var valid = true;
        $(this).find('dl.form > dt:not(.free) + dd > input[class^="text"], dl.form > dt:not(.free) + dd > textarea').each(function(i) {
            if($(this).val() == '' || ($(this).attr('id').match(/^.?email$/) && !$(this).val().match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i))) {
                valid = false;
            $(this).parent().addClass('invalid' + ($(this).is('textarea') ? '-textarea' : ($(this).parent().hasClass('below') ? '-below' : '' )));
            } else {
                $(this).parent().removeClass('invalid').removeClass('invalid-textarea').removeClass('invalid-below');
            }
        });
        if(!valid) {
            e.preventDefault();
        }
    });
    
    $('dl.form > dd > input.short, #birthday, #birthday').attr('readonly', 'readonly');
    
    if($.datepicker) {
        $.datepicker.setDefaults($.datepicker.regional['pl']);
    
        $('#birthday, #from-from, #from-to, #period-from, #period-to').datepicker({
            dateFormat: 'yy-mm-dd',
            maxDate: (new Date().getYear() + 1900).toString() + '-12-31',
            changeMonth: true,
            changeYear: true,
            onSelect: function(e) {
                if($(this).parent().children('input[value=""]').length == 0) $(this).parent().removeClass('invalid');
            }
        });
        $('#birthday + a.calendar, #from-from + span + #from-to + a.calendar, #period-from + span + #period-to + a.calendar').click(function(e) {
            if($(this).parent().children('input[value=]').is('input')) {
                $(this).parent().children('input[value=]:first').focus();
            } else {
                $(this).parent().children('input:first').focus();
            }
        });
    }
    
    /* SELECT */
    $('div.select > select').change(function() {
        var option = $(this).children('option[value="' + $(this).val() + '"]');
        $(this).parent().children('span').html(option.text().replace(new RegExp('(' + option.attr('title') + ')'), "<cite>$1</cite>"));
    }).mouseover(function(e) {
        $(this).parent().addClass('select-hover');
    }).mouseout(function(e) {
        $(this).parent().removeClass('select-hover');
    });
    $('div.select > select').change();

    
    /* FIELD AUTOCOMPLETE */
    $('input.autocomplete, textarea.autocomplete').addClass('default-value').each(function() {
        $(this).data('defaultValue', $(this).val())
    }).focus(function(e) {
        $(this).removeClass('default-value');
        if($(this).val() == $(this).data('defaultValue')) {
            $(this).val('');
        }
    }).blur(function(e) {
        if($(this).val() == '') {
            $(this).addClass('default-value');
            $(this).val($(this).data('defaultValue'));
        }
    });
    
    /* CALENDARS */
    rebindSliderEvents = function(calendars, pixels, onecal) {
        calendars.find('div > ul > li.prev > a').unbind('click').click(function(e) {
            e.preventDefault();
            if($(this).parents('div.c-left').prev().is('div')) {
                var cal_link = $(this).parents('div.c-left').prev().children('a.cal-more').attr('href');
            } else {
                var cal_link = '';
            }
            $(this).parents('div.calendars').animate({left: '+=' + pixels.toString()}, 500, 'linear', function(e) {
                if(!onecal) $('div.calendars > div > ul > li.prev:last').attr('class', 'next');
                rebindSliderEvents(calendars, pixels, onecal);
                $('#cal-link').attr('href', cal_link);
            });
        })
    
        calendars.find('div > ul > li.next > a').unbind('click').click(function(e) {
            e.preventDefault();
            if($(this).parents('div.c-left').next().is('div')) {
                var cal_link = $(this).parents('div.c-left').next().children('a.cal-more').attr('href');
            } else {
                var cal_link = '';
            }
            $(this).parents('div.calendars').animate({left: '-=' + pixels.toString()}, 500, 'linear', function(e) {
                if(!onecal) $('div.calendars > div > ul > li.next:first').attr('class', 'prev');
                rebindSliderEvents(calendars, pixels, onecal);
                $('#cal-link').attr('href', cal_link);
            });
        })
    }

    rebindSliderEvents($('div.column-right div.calendars'), 306, true);
    rebindSliderEvents($('div.column-left div.calendars'), 306, true);
}); 