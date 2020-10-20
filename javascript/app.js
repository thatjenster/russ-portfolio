let $window = $(window);
let $root = $('html, body');

$(document).ready(function () {
    smoothScroll();
});

function smoothScroll(){
    $('.links a').on('click', function(event) {
        let $anchor = $(this);
        $root.stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 60
        }, 1500, 'easeInOutQuart');
        event.preventDefault();
    });
}