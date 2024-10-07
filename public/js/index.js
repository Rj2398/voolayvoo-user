
new WOW().init();

$("#client").owlCarousel({
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    responsiveClass: true,
    dots: false,
    nav: false,
    responsive: {
        0: {
            items: 1,
            nav: false,
        },
        600: {
            items: 3,
            nav: false,
        },
        1000: {
            items: 6,
            nav: true,
            loop: true
        }
    }
})

$("#voopons-slider").owlCarousel({
    loop: true,
    margin: 20,
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    responsiveClass: true,
    dots: false,
    navigation: false,
    responsive: {
        0: {
            items: 1,
            nav: false,
        },
        600: {
            items: 3,
            nav: false,
        },
        1000: {
            items: 4,
            nav: true,
            loop: true
        }
    }
})

$("#voopons-love-slider").owlCarousel({
    loop: true,
    margin: 20,
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    responsiveClass: true,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 1,
            nav: false,
        },
        600: {
            items: 2,
            nav: false,
        },
        1000: {
            items: 3,
            nav: false,
            loop: true
        }
    }
})

$("#brand-slider").owlCarousel({
    loop: true,
    margin: 20,
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    responsiveClass: true,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 1,
            nav: false,
        },
        600: {
            items: 3,
            nav: false,
        },
        1000: {
            items: 4,
            nav: false,
            loop: true
        }
    }
})

$("#eventnear-slider").owlCarousel({
    loop: true,
    margin: 20,
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    responsiveClass: true,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 1,
            nav: false,
        },
        600: {
            items: 3,
            nav: false,
        },
        1000: {
            items: 4,
            nav: false,
            loop: true
        }
    }
})

$(document).ready(function () {
    $(".notifications").click(function (event) {
        $(".notifi-box").toggle();
        event.stopPropagation();
    });

    $(document).click(function () {
        $(".notifi-box").hide();
    });

    $(".notifi-box").click(function (event) {
        event.stopPropagation();
        return false;
    });
});
