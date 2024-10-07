// Our-Booths-Section
$(document).ready(function () {
    $("#bestseller-slider-1, #bestseller-slider-2, #bestseller-slider-3, #bestseller-slider-4").owlCarousel({
        items: 2,
        loop: true,
        center: true,
        autoplay: true,
        mouseDrag: false,
        margin: 20,
        dots: false,
        nav: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 2,
            }
        }
    });
    $(".bestseller-content .owl-prev").html('<i class="far fa-angle-left"></i>');
    $(".bestseller-content .owl-next").html('<i class="far fa-angle-right"></i>');
});


// TABS
// TABS


// Our-Booths-Section

// Reviews-Slider

$(document).ready(function () {
    $("#reviews-slider").owlCarousel({
        items: 2,
        loop: true,
        center: false,
        autoplay: false,
        margin: 20,
        dots: true,
        nav: false,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 3,
            }
        }
    });
});


// Reviews-Slider

// Reviews-Slider

$(document).ready(function () {
    $("#same-organizer").owlCarousel({
        items: 2,
        loop: true,
        center: false,
        autoplay: false,
        margin: 20,
        dots: true,
        nav: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 4,
            }
        }
    });
    $("#same-organizer .owl-prev").html('<i class="far fa-angle-left"></i>');
    $("#same-organizer .owl-next").html('<i class="far fa-angle-right"></i>');
});

$(document).ready(function () {
    $("#same-organizer2").owlCarousel({
        items: 2,
        loop: true,
        center: false,
        autoplay: false,
        margin: 20,
        dots: true,
        nav: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 4,
            }
        }
    });
    $("#same-organizer2 .owl-prev").html('<i class="far fa-angle-left"></i>');
    $("#same-organizer2 .owl-next").html('<i class="far fa-angle-right"></i>');
});

$(document).ready(function () {
    $("#same-organizer3").owlCarousel({
        items: 2,
        loop: true,
        center: false,
        autoplay: false,
        margin: 20,
        dots: true,
        nav: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 4,
            }
        }
    });
    $("#same-organizer3 .owl-prev").html('<i class="far fa-angle-left"></i>');
    $("#same-organizer3 .owl-next").html('<i class="far fa-angle-right"></i>');
});




$(document).ready(function () {
    $("#pro-slider").owlCarousel({
        items: 5,
        loop: false,
        autoplay: false,
        margin: 0,
        dots: false,
        mouseDrag: false,
        nav: true,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        autoplayTimeout: 3000,
        autoplaySpeed: 1,
        responsive: {
            0: {
                items: 3,
                margin: 10,
            },
            600: {
                items: 3,
                margin: 10,
            },
            1000: {
                items: 5,
                margin: 10,
            }
        }
    });
});

// Reviews-Slider





// Suggested-Products-Slider

$(document).ready(function () {
    $("#suggested-slider, #suggested-slider-2, #suggested-slider-3").owlCarousel({
        items: 4,
        loop: true,
        center: false,
        autoplay: true,
        margin: 20,
        dots: false,
        nav: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 4,
            }
        }
    });
    $(".services-page .owl-prev, .about-wrap .owl-prev").html('<i class="far fa-angle-left"></i>');
    $(".services-page .owl-next, .about-wrap .owl-next").html('<i class="far fa-angle-right"></i>');
});


// Suggested-Products-Slider


// Booth-Detail-Slider

$(document).ready(function () {
    $("#booth-detail-slider").owlCarousel({
        items: 1,
        loop: true,
        center: false,
        autoplay: true,
        margin: 20,
        dots: false,
        nav: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 1,
            }
        }
    });
    $("#booth-detail-slider .owl-prev").html('<i class="far fa-angle-left"></i>');
    $("#booth-detail-slider .owl-next").html('<i class="far fa-angle-right"></i>');
});


// Booth-Detail-Slider



// Experience-Center-Slider

$(document).ready(function () {
    $("#experience-center-slider").owlCarousel({
        items: 1,
        loop: true,
        center: false,
        autoplay: true,
        margin: 10,
        dots: false,
        nav: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 1,
            },
            1000: {
                items: 1,
            }
        }
    });
    $("#experience-center-slider .owl-prev").html('<i class="far fa-angle-left"></i>');
    $("#experience-center-slider .owl-next").html('<i class="far fa-angle-right"></i>');
});


// Experience-Center-Slider




// Insta-Slider

$(document).ready(function () {
    $("#insta-slider").owlCarousel({
        items: 6,
        loop: true,
        center: false,
        autoplay: true,
        margin: 4,
        dots: false,
        nav: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 2,
                margin: 10,
            },
            600: {
                items: 4,
            },
            1000: {
                items: 7,
            }
        }
    });
    $("#insta-slider .owl-prev").html('<i class="far fa-angle-left"></i>');
    $("#insta-slider .owl-next").html('<i class="far fa-angle-right"></i>');
});


// Insta-Slider


// business-streming-Slider

$(document).ready(function () {
    $("#bussiness-slider").owlCarousel({
        items: 6,
        loop: true,
        center: false,
        autoplay: true,
        margin: 20,
        dots: false,
        nav: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 2,
                margin: 10,
            },
            600: {
                items: 4,
            },
            1000: {
                items: 6,
            }
        }
    });
    $("#bussiness-slider .owl-prev").html('<i class="far fa-angle-left"></i>');
    $("#bussiness-slider .owl-next").html('<i class="far fa-angle-right"></i>');
});


// business-streming-Slider