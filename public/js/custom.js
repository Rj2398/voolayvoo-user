$(function () {
    $('input[name="datefilter"]').daterangepicker({
        opens: 'left',
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Cancel'
        }
    });

    $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    });

    $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

});

$(document).ready(function () {
    $(".business-subscription-plan-box").click(function () {
        $('.business-subscription-plan-box').removeClass('active');
        $(this).toggleClass('active');
    });
});

$(document).ready(function () {
    $(".checked-list-heading").click(function () {
        $(".checked-list-names").slideToggle('fast');
        event.stopPropagation();
    });
    $(".checked-list-heading").click(function () {
        $(".checked-list-heading h1").toggleClass('active');
    });
    $(".checked-list-names").click(function () {
        event.stopPropagation();
    });
});

$(document).ready(function () {
    $(".sort-dropdown-btn").click(function () {
        $(".sort-dropdown-list").slideToggle('fast');
        event.stopPropagation();
    });
    $(document).click(function () {
        $(".sort-dropdown-list").slideUp('fast');
        event.stopPropagation();
    });
    $(".sort-dropdown-list").click(function () {
        event.stopPropagation();
    });
});

// OTP-VERIFICATION
$(".inputs").keyup(function () {
    if (this.value.length == this.maxLength) {
        $(this).next('.inputs').focus();
    }

    if (this.value.length == 0)
        $(this).prev('.inputs').focus();
});


// OTP-VERIFICATION
$(document).ready(function () {
    $('.select-categories, .btn-date-range, .btn-location').click(function () {
        $(this).toggleClass('active');
        event.stopPropagation();
    });

    $(document).click(function () {
        $('.select-categories, .btn-date-range, .btn-location').removeClass('active');
        event.stopPropagation();
    });

});

$(document).ready(function (event) {
    $('.deal-search-filter h2').click(function () {
        $(this).parent().find('.deal-search-filter-list').slideToggle('fast');
        $(this).find('i').toggleClass('down-side');
        event.stopPropagation();
    });
});

$(function () {
    $('.eye-in').click(function () {

        if ($(this).hasClass('fa-eye-slash')) {

            $(this).removeClass('fa-eye-slash');

            $(this).addClass('fa-eye');

            $(this).parent().find('.password-in').attr('type', 'text');

        } else {

            $(this).removeClass('fa-eye');
            $(this).addClass('fa-eye-slash');
            $(this).parent().find('.password-in').attr('type', 'password');
        }
    });
});

$(document).ready(function (event) {
    $('.location-drop a').click(function () {
        $('.location-drop-list').slideToggle('fast');
        event.stopPropagation();
    });
    $(document).click(function () {
        $('.location-drop-list').slideUp('fast');
    });
    $('.location-drop-list').click(function () {
        event.stopPropagation();
    });
});

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#E0E0E0', '#E60023', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}

function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#E0E0E0', '#E60023', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#E0E0E0', '#E60023', toSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromInput.value = from;
    }
}

function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#E0E0E0', '#E60023', toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
        toSlider.value = from;
    }
}

function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (Number(currentTarget.value) <= 0) {
        toSlider.style.zIndex = 2;
    } else {
        toSlider.style.zIndex = 0;
    }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const fromInput = document.querySelector('#fromInput');
const toInput = document.querySelector('#toInput');
fillSlider(fromSlider, toSlider, '#E0E0E0', '#E60023', toSlider);
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

$(function () {
    $('.eye-in').click(function () {

        if ($(this).hasClass('fa-eye-slash')) {

            $(this).removeClass('fa-eye-slash');

            $(this).addClass('fa-eye');

            $(this).parent().find('.password-in').attr('type', 'text');

        } else {

            $(this).removeClass('fa-eye');
            $(this).addClass('fa-eye-slash');
            $(this).parent().find('.password-in').attr('type', 'password');
        }
    });
});

const sliderMainImage = document.getElementById("product-main-image");
const sliderImageList = document.getElementsByClassName("image-list");
console.log(sliderImageList);

sliderImageList[0].onclick = function () {
    sliderMainImage.src = sliderImageList[0].src;
    console.log(sliderMainImage.src);
};

sliderImageList[1].onclick = function () {
    sliderMainImage.src = sliderImageList[1].src;
    console.log(sliderMainImage.src);
};

sliderImageList[2].onclick = function () {
    sliderMainImage.src = sliderImageList[2].src;
    console.log(sliderMainImage.src);
};

sliderImageList[3].onclick = function () {
    sliderMainImage.src = sliderImageList[3].src;
    console.log(sliderMainImage.src);
};
sliderImageList[4].onclick = function () {
    sliderMainImage.src = sliderImageList[4].src;
    console.log(sliderMainImage.src);
};
sliderImageList[5].onclick = function () {
    sliderMainImage.src = sliderImageList[5].src;
    console.log(sliderMainImage.src);
};
