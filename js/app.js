// loader

$('.signUp').on('click', function () {
    event.preventDefault();
    if ($('#singUpEmail').val().indexOf('@') > -1) {
        var $this = $(this);
        $this.button('loading');
        WHCreateCookie('jediGame', 'avaliable', 183);
        $('#singUpForm').submit();
    } else {
        alert("Musisz podać adres email");
    }
    $('#singUpEmail').val('');
});

// smooth scroll

$(".links").click(function () {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 125
    }, 800)
});

function myFunction(x) {
    x.classList.toggle("change");
};
