// loader

$('.signUp').on('click', function () {
    var $this = $(this);
    $this.button('loading');
});

// smooth scroll

$(".links").click(function() {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 125
    }, 800)
});

// about authors animations

var firtScrollToFlipCard = 1;

$('.card').hover(function () {
    $(this).css('transform', 'rotateY(180deg)');
}, function () {
    $(this).css('transform', 'rotateY(0deg)');
});

// Check if element is visible on viewport

window.onscroll = function scrollFunction() {
    if (firtScrollToFlipCard) {
        if (document.body.scrollTop >= $("#team").offset().top - 500) {
            $('.card').css('transform', 'rotateY(180deg)');
            firstAutorsFlip();
        }
    }
    if (document.body.scrollTop > 200){
        $('#homeLink').show();
    }else{
        $('#homeLink').hide();
    }
};

// rotation autors name as they apper first time on the screen

function firstAutorsFlip() {
    var cardId;
    var i = 1;
    var temeTimeout = setTimeout(function () {
    var timeInterval = setInterval(function () {
        cardId = '#authorName' + i;
        $(cardId).css('transform', 'rotateY(0deg)');
        i++;
        if (i === 5) {
            clearTimeout(temeTimeout);
            clearTimeout(timeInterval);
            firtScrollToFlipCard = 0;
        }
    }, 300);
    },400)
}

