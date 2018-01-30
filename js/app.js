// loader

$('.signUp').on('click', function () {
    var $this = $(this);
    $this.button('loading');
});

// smooth scroll

$(".links").click(function () {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 125
    }, 800)
});

