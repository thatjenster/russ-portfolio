(function($) {
  'use strict';
  $(function() {
    /*----------- Globals -----------*/

    /* Lity setup */
    $(document).on('click', '[data-lightbox]', lity.options('template', '<div class="lity" role="dialog" aria-label="Dialog Window (Press escape to close)" tabindex="-1"><div class="lity-wrap" data-lity-close role="document"><div class="lity-loader" aria-hidden="true">Loading...</div><div class="lity-container"><div class="lity-content"></div><div class="lity-close" data-lity-close aria-label="Close (Press escape to close)"><span class="btn-line"></span></div></div></div></div>'));

    /* Custom function to remove margin bottom from items in the last row depending on the screen size / how many columns the grid has */
    function responsiveColumns(elements, options, styleClasses) {
      function sliceElements(elements, value) {
        let slicedElements = $(elements[0]).slice(-value);
        if (elements[1] === null) {
          slicedElements.addClass(styleClasses);
        } else {
          slicedElements.find(elements[1]).addClass(styleClasses);
        }
      }
      $.each(options, function(index, value) {
        let columns = value.columns;
        if (window.matchMedia(value.matchMedia).matches) {
          let remainder = $(elements[0]).length % columns;
          if (remainder === 0) {
            sliceElements(elements, columns);
          } else {
            sliceElements(elements, remainder);
          }
          return false;
        }
      });
    }

    $('.navbar .navbar-nav .nav-link[href^="#"]').each(function() {
      $(this).animatedModal({
        animatedIn: 'fadeIn',
        animatedOut: 'fadeOut',
        animationDuration: '0s',
        beforeOpen: function() {
          $('#overlay-effect').addClass('animate-up').removeClass('animate-down');
          $('#' + this.modalTarget).css({
            'animationDelay': '.5s',
            'animationFillMode': 'both'
          });
        },
        afterOpen: function() {
          $('#' + this.modalTarget).css({
            'animationFillMode': 'none'
          });
        },
        beforeClose: function() {
          $('#overlay-effect').addClass('animate-down').removeClass('animate-up');
          $('#' + this.modalTarget).css({
            'animationDelay': '.5s',
            'animationFillMode': 'both'
          });
        },
        afterClose: function() {
          $('#' + this.modalTarget).css({
            'animationFillMode': 'none'
          });
        }
      });
    });

    $('.lightbox-wrapper').each(function() {
      if (!$('.navbar .navbar-nav .nav-link[href^="#' + this.id + '"]').length) {
        $(this).hide();
      }
    });

    /* Hides the the mobile navbar dropdown when the user clicks outside of it */
    $(document).on('mouseup', function(event) {
      if ($('.navbar #navbarSupportedContent').hasClass('show')) {
        // The mobile Bootstrap navbar dropdown
        let navbarToggler = $('.navbar .navbar-menu');
        if (!navbarToggler.is(event.target) && navbarToggler.has(event.target).length === 0) {
          navbarToggler.trigger('click');
        }
      }
    });

    (function() {
      // Set animation timing
      let animationDelay = 2500,
        // Clip effect
        revealDuration = 660,
        revealAnimationDelay = 1500;

      initHeadline();

      function initHeadline() {
        // Initialise headline animation
        animateHeadline($('.cd-headline'));
      }

      function animateHeadline($headlines) {
        let duration = animationDelay;
        $headlines.each(function() {
          var headline = $(this);
          if (headline.hasClass('clip')) {
            let spanWrapper = headline.find('.cd-words-wrapper'),
              newWidth = spanWrapper.width() + 10;
            spanWrapper.css('width', newWidth);
          }

          //trigger animation
          setTimeout(function() {
            hideWord(headline.find('.is-visible').eq(0));
          }, duration);
        });
      }

      function hideWord($word) {
        let nextWord = takeNext($word);

        if ($word.parents('.cd-headline').hasClass('clip')) {
          $word.parents('.cd-words-wrapper').animate({
            width: '2px'
          }, revealDuration, function() {
            switchWord($word, nextWord);
            showWord(nextWord);
          });
        }
      }

      function showWord($word, $duration) {
        if ($word.parents('.cd-headline').hasClass('clip')) {
          $word.parents('.cd-words-wrapper').animate({
            'width': $word.width() + 10
          }, revealDuration, function() {
            setTimeout(function() {
              hideWord($word);
            }, revealAnimationDelay);
          });
        }
      }


      function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
      }

      function takePrev($word) {
        return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
      }

      function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
      }
    }())

    (function() {
      /* Setup Isotope */
      let grid = $('#portfolio .portfolio-section .portfolio-grid');
      let filters = $('#portfolio .portfolio-section .filter-control li');
      grid.imagesLoaded(function() {
        grid.isotope({
          itemSelector: '#portfolio .portfolio-section .single-item',
          masonry: {
            horizontalOrder: true
          }
        });
        filters.on('click', function() {
          filters.removeClass('tab-active');
          $(this).addClass('tab-active');
          let selector = $(this).data('filter');
          grid.isotope({
            filter: selector,
            transitionDuration: '.25s'
          });
        });
      });
    }());

    /* Removes margin bottom from items in the last row depending on the screen size / how many columns the grid has */
    responsiveColumns(
      ['#portfolio .portfolio-section .single-item .portfolio-item', '.portfolio-wrapper'],
      [{
        matchMedia: '(max-width: 991.98px)',
        columns: 2,
      }, {
        matchMedia: '(min-width: 991.98px)',
        columns: 3,
      }],
      'rc-mb-0'
    );
    $('#contact .contact-section .contact-form').on('submit', function(event) {
      let form = $(this);
      let submitBtn = form.find('#contact-submit');
      let submitBtnText = submitBtn.text();
      let feedbackEl = form.find('.contact-feedback');
      event.preventDefault();
      // Waiting for the response from the server
      submitBtn.html('Wait...').addClass('wait').prop('disabled', true);
      setTimeout(function() {
        // Posts the Form's data to the server using Ajax
        $.ajax({
            url: form.attr('action'),
            type: 'POST',
            data: form.serialize(),
          })
          // Getting a response from the server
          .done(function(response) {
            // If the PHP file succeed sending the message
            if (response == 'success') {
              // Feedback to the user
              submitBtn.removeClass('wait').html('Success').addClass('success');
              feedbackEl.addClass('success').html('Thank you for your message. It has been sent.').fadeIn(200);
              setTimeout(function() {
                submitBtn.html(submitBtnText).removeClass('success').prop('disabled', false);
                feedbackEl.fadeOut(200).removeClass('success').html('');
              }, 6000);
              // Clears the Form
              form[0].reset();
              // If something is wrong
            } else {
              // Feedback to the user
              console.log(response);
              submitBtn.removeClass('wait').html('Error').addClass('error');
              feedbackEl.addClass('error').html('Server error! Please check your browser console log for more details.').fadeIn(200);
              setTimeout(function() {
                submitBtn.html(submitBtnText).removeClass('error').prop('disabled', false);
                feedbackEl.fadeOut(200).removeClass('error').html('');
              }, 6000);
            }
          });
      }, 1000);
    });

  });
}(jQuery));