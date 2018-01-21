function WHCreateCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name+"="+value+expires+"; path=/";
}
function WHReadCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

window.onload = WHCheckCookies;

function WHCheckCookies() {
    if(WHReadCookie('cookies_accepted') != 'T') {
        var message_container = document.createElement('div');
        message_container.id = 'cookies-message-container';
        var html_code = '<div id="cookies-message" style="opacity: 0.9; padding: 20px 0px;min-height: 125px; font-size: 16px; line-height: 35px; border-top: 5px solid #FF8619; text-align: center; position: fixed; bottom: 0px; background-color: #36312C;color: #E5D2BC; width: 100%; z-index: 999; ">Nasza strona używa ciasteczek (cookies), dzięki którym nasz serwis może działać lepiej. <a style="text-decoration:none; color: #FF8619" href="http://wszystkoociasteczkach.pl" target="_blank">Więcej...</a><a href="javascript:WHCloseCookiesWindow();" id="accept-cookies-checkbox" name="accept-cookies" style="background-color: #36312C; padding: 5px 10px; color: #E5D2BC; border-radius: 8px; -moz-border-radius: 8px; -webkit-border-radius: 8px; display: inline-block;border: solid 2px #FF8619;   margin: 10px; text-decoration: none; cursor: pointer;">Rozumiem</a></div>';
        message_container.innerHTML = html_code;
        document.body.appendChild(message_container);
    }
}

function WHCloseCookiesWindow() {
    WHCreateCookie('cookies_accepted', 'T', 14);
    document.getElementById('cookies-message-container').removeChild(document.getElementById('cookies-message'));
}