function counter() {
    $('.count').each(function () {
        if ($(this).hasClass('start')) {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                if (($(this).text()) % 1 === 0) {
                    var decimalpoint = 0;
                } else {
                    var decimalpoint = ($(this).text()).toString().split(".")[1].length;
                }
                $(this).removeClass('start');
                $(this).animate({
                    Counter: $(this).text()
                }, {
                    duration: 4000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(now.toFixed(decimalpoint).toLocaleString('en'));
                    }
                });
            }
        }
    });
}

$(document).on('ready', counter);
$(window).on('scroll', counter);