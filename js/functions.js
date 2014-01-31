(function ($) {

  // ==============
  // EVENT HANDLERS
  // ==============

  // handles clicks on account link/button
  function accountClick(e) {
    e.preventDefault();
    e.stopPropagation();

    // slide down (if hidden) or slide up (if showing) Account section
    var $accountSection = $('#account-section');
    if ($accountSection.is(':hidden')) {
      $accountSection.stop(true, true).slideDown();
    } else {
      collapseAccountSection();
    }
  }

  // handles clicks on bubble buttons in Account section
  function accountItemClick(e) {
    e.preventDefault();
    e.stopPropagation();

    var $el = $(e.currentTarget),
      href = getCleanHref($el.attr('href')),
      $accountLinks;

    // select current item
    $('.account-item').removeClass('selected');
    $el.addClass('selected');

    switch (href) {
    case 'manage-account':
      // hide other subsections if showing
      collapseManageActivationSection();
      collapseManagePaymentsSection();
      $accountLinks = $('.account-links');
      if ($accountLinks.is(':hidden')) {
        // slide down links block
        $('.account-links').stop(true, true).slideDown(function () {
          // fade in info block
          $('#manage-account-info-block').fadeIn();
        });
      }
      break;
    case 'manage-activation':
      collapseManageAccountSection();
      collapseManagePaymentsSection();
      break;
    case 'manage-payments':
      collapseManageAccountSection();
      collapseManagePaymentsSection();
      break;
    default:
    }
  }

  // handles clicks on links in Manage Account subsection
  function accountLinkItemClick(e) {
    e.preventDefault();
    e.stopPropagation();

    var $el = $(e.currentTarget),
      href = getCleanHref($el.attr('href')),
      currentId = $('.item.manage-account.active').attr('id'),
      showAccountSettingsForm;

    // select current item
    $('.account-link-item').removeClass('selected');
    $el.addClass('selected');

    showAccountSettingsForm = function () {
      // init new slide
      initAccountSlideForm(href);
      // show account panels block with selected account carousel slide
      showAccountPanelsBlock(href);
    }

    if (href !== currentId) {
      if (formChanged) {
        // if we're trying to open new form while having unsaved data in current form,
        // show cancel prompt first
        showCancelPrompt(function () {
          // if we have some slide showing, reinit it before moving to next slide
          initAccountSlideForm(currentId);
          showAccountSettingsForm();
        });
      } else {
        showAccountSettingsForm();
      }
    }
  }

  function carouselControlClick(e) {
    e.preventDefault();
    e.stopPropagation();

    var direction = $(e.currentTarget).attr('data-slide'),
      slideCarousel = function () {
        // to make carousel controls work properly we need to show all the slides
        $('.item.manage-account').css('display', '');
        $('#account-carousel').carousel(direction);
      };

    if (formChanged) {
      // if we're trying to slide to new form while having unsaved data in current form,
      // show cancel prompt first
      showCancelPrompt(function () {
        var $currentSlide = $('.item.manage-account.active');
        // if we have some slide showing, reinit it before moving to next slide
        if ($currentSlide.length) {
          initAccountSlideForm($currentSlide.attr('id'));
        }
        slideCarousel();
      });
    } else {
      slideCarousel();
    }
  }


  // =========================
  // SHOW & COLLAPSE FUNCTIONS
  // =========================

  // shows account panels block in Account section
  function showAccountPanelsBlock(id) {
    var $accountPanels = $('#account-panels'),
      $accountInfoBlock = $('#manage-account-info-block'),
      $currentSlide,
      backgroundHeight;
    if (!$accountInfoBlock.is(':hidden')) {
      // fade out info block
      $accountInfoBlock.fadeOut();
    }
    if ($accountPanels.is(':hidden')) {
      // get min-height of slide that will be shown first
      backgroundHeight = $('#' + id).css('min-height');
      // set height of account panels block (for proper slide down effect)
      $accountPanels.css('height', backgroundHeight);
      // slide down account panels block
      $accountPanels.stop(true, true).slideDown(function () {
        var $currentSlide = $('#' + id);
        // remove height of account panels block to allow its adaptive resizing
        $(this).css('height', '');
        // fade in current account carousel slide
        $currentSlide.fadeIn(function () {
          // set active account carousel slide
          $(this).addClass('active');
        });
      });
    } else {
      $currentSlide = $('.item.manage-account.active');
      // check if user wants to see the other slide
      if ($currentSlide.attr('id') !== id) {
        // fade out current account carousel slide
        $currentSlide.fadeOut(function () {
          $(this).removeClass('active');
          // fade in and set active account carousel slide
          $('#' + id).fadeIn(function () {
            $(this).addClass('active');
          });
        });
      }
    }
  }

  // hides whole Account section
  function collapseAccountSection() {
    var collapseFunction = function () {
      $('#account-section').stop(true, true).slideUp(function () {
        // unset and hide active account carousel slide
        var $currentSlide = $('.item.manage-account.active'),
          $accountPanels = $('#account-panels');
        $currentSlide.hide();
        $currentSlide.removeClass('active');
        // remove height of account panels block for future changes
        $accountPanels.css('height', '');
        // hide all internal divs
        $accountPanels.hide(); // div with forms
        $('.account-links').hide(); // div with forms selector
        // deselect all Manage Account subsection links
        $('.account-link-item').removeClass('selected');
        // hide info block
        $('#manage-account-info-block').hide();
        // deselect all bubble links
        $('.account-item').removeClass('selected');
      });
    }
    if (formChanged) {
      showCancelPrompt(collapseFunction);
    } else {
      collapseFunction();
    }
  }

  // hides Manage Account subsection blocks
  function collapseManageAccountSection() {
    var collapseFunction = function () {
      var $currentSlide = $('.item.manage-account.active'),
        $accountPanels,
        backgroundHeight;
      if ($currentSlide.length && !$currentSlide.is(':hidden')) {
        $accountPanels = $('#account-panels');
        backgroundHeight = $accountPanels.outerHeight() + 'px';
        // set strict height of account panels block (for proper slide up effect)
        $accountPanels.css('height', backgroundHeight);
        // fade out current account carousel slide
        $currentSlide.fadeOut(function () {
          // unset active account carousel slide
          $(this).removeClass('active');
          // then hide account panels block
          collapseManageAccountSectionAccountPanelsBlock();
        });
      } else {
        collapseManageAccountSectionAccountPanelsBlock();
      }
    };
    if (formChanged) {
      showCancelPrompt(collapseFunction);
    } else {
      collapseFunction();
    }
  }

  // hides account panels in Manage Account subsection
  function collapseManageAccountSectionAccountPanelsBlock() {
    var $accountPanels = $('#account-panels');
    if (!$accountPanels.is(':hidden')) {
      // slide up account panels block then hide links block
      $accountPanels.stop(true, true).slideUp(function () {
        // remove height of account panels block for future changes
        $(this).css('height', '');
        collapseManageAccountSectionLinksBlock();
      });
    } else {
      // hide just links block
      collapseManageAccountSectionLinksBlock();
    }
  }

  // hides links block in Manage Account subsection
  function collapseManageAccountSectionLinksBlock() {
    var $accountLinks = $('.account-links');
    if (!$accountLinks.is(':hidden')) {
      // fade out info block
      $('#manage-account-info-block').fadeOut();
      // slide up account links block
      $accountLinks.stop(true, true).slideUp(function () {
        // deselect all Manage Account subsection links
        $('.account-link-item').removeClass('selected');
      });
    }
  }

  // hides manage account carousel, account panels and deselects account subsection links
  function collapseManageAccountCarousel() {
    var $currentSlide = $('.item.manage-account.active'),
      $accountPanels,
      backgroundHeight;
    if ($currentSlide.length && !$currentSlide.is(':hidden')) {
      $accountPanels = $('#account-panels');
      backgroundHeight = $accountPanels.outerHeight() + 'px';
      // set strict height of account panels block (for proper slide up effect)
      $accountPanels.css('height', backgroundHeight);
      // fade out current account carousel slide
      $currentSlide.fadeOut(function () {
        // unset active account carousel slide
        $(this).removeClass('active');
        // slide up account panels block
        $accountPanels.stop(true, true).slideUp(function () {
          // remove height of account panels block for future changes
          $(this).css('height', '');
          // deselect all Manage Account subsection links
          $('.account-link-item').removeClass('selected');
        });
      });
    }
  }

  // hides Manage Activation subsection blocks
  function collapseManageActivationSection() {

  }

  // hides Manage Payments subsection blocks
  function collapseManagePaymentsSection() {

  }


  // ==========================
  // FORMS FUNCTIONS & HANDLERS
  // ==========================

  var formChanged = false;

  // handles changes in input boxes
  function inputChanged(e) {
    formChanged = true;
  }

  function initContactInformationForm() {
    // TODO: place actual init data here
    var firstName = '',
      middleName = '',
      lastName = '',
      suffix = '',
      street = '',
      city = '',
      state = '',
      zip = '',
      country = '',
      phone = '',
      email = '';

    $('#contact-setting-first-name').val(firstName);
    $('#contact-setting-middle-name').val(middleName);
    $('#contact-setting-last-name').val(lastName);
    $('#contact-setting-suffix').val(suffix);
    $('#contact-setting-street').val(street);
    $('#contact-setting-city').val(city);
    $('#contact-setting-state').val(state);
    $('#contact-setting-zip').val(zip);
    $('#contact-setting-country').val(country);
    $('#contact-setting-phone').val(phone);
    $('#contact-setting-email').val(email);
    formChanged = false;
  }

  function initChangePasswordForm() {
    $('#password-setting-current').val('');
    $('#password-setting-new1').val('');
    $('#password-setting-new2').val('');
    $('#password-setting-repeat').val('');
    formChanged = false;
  }

  function initCancelSubscriptionForm() {
    $('#cancel-subscription-confirm').prop('checked', false);
  }

  function initAccountSlideForm(id) {
    switch (id) {
    case 'manage-account-contact':
      initContactInformationForm();
      break;
    case 'manage-account-password':
      initChangePasswordForm();
      break;
    case 'manage-account-unsubscribe':
      initCancelSubscriptionForm();
      break;
    case 'manage-account-upgrade':
      break;
    default:
    }
  }

  function contactSubmitClick(e) {
    e.preventDefault();
    e.stopPropagation();

    // TODO: save contact form
  }

  function contactCancelClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (formChanged) {
      showCancelPrompt(function () {
        initContactInformationForm();
        collapseManageAccountCarousel();
      });
    } else {
      collapseManageAccountCarousel();
    }
  }

  function passwordSubmitClick(e) {
    e.preventDefault();
    e.stopPropagation();

    // TODO: save change password form
  }

  function passwordCancelClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (formChanged) {
      showCancelPrompt(function () {
        initChangePasswordForm();
        collapseManageAccountCarousel();
      });
    } else {
      collapseManageAccountCarousel();
    }
  }

  function unsubscribeClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if ($('#cancel-subscription-confirm').prop('checked')) {
      // TODO: process subscription cancel
    }
  }

  function subscribeSingleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    // TODO: process single subscription
  }

  function subscribeJointClick(e) {
    e.preventDefault();
    e.stopPropagation();

    // TODO: process joint subscription
  }


  function showCancelPrompt(callback) {
    var $cancelModal = $('#cancel-modal'),
      $confirmCancelButton = $cancelModal.find('.btn-confirm-cancel');
    // show confirm cancel modal
    $cancelModal.bootstrapModal('show');
    $confirmCancelButton.off('click');
    if (typeof callback === 'function') {
      // register callback that will be called when cancel will be confirmed
      $confirmCancelButton.one('click', function () {
        var $cancelModal = $('#cancel-modal');
        $cancelModal.one('hidden.bs.modal', function (e) {
          formChanged = false;
          callback();
        });
        $cancelModal.bootstrapModal('hide');
      });
    } else {
      // just close modal when cancel will be confirmed
      $confirmCancelButton.one('click', function () {
        $('#cancel-modal').bootstrapModal('hide');
      });
    }
  }


  // ================
  // HELPER FUNCTIONS
  // ================

  // function which gets href without #
  function getCleanHref(href) {
    var pos = href.indexOf('#');
    return href.slice(pos + 1);
  }


  $(document).ready(function () {
    // redefine Bootstrap modal plugin since in head.js there is Simple Modal jQuery plugin with the same name
    var bootstrapModal = $.fn.modal.noConflict();
    $.fn.bootstrapModal = bootstrapModal;
    // register event handlers
    $('#account_link').on('click', accountClick);
    $('.account-item').on('click', accountItemClick);
    $('.account-link-item').on('click', accountLinkItemClick);
    $('.carousel-control').on('click', carouselControlClick);
    $('.settings-form input[type="text"], .settings-form input[type="password"]').on('change', inputChanged);
    $('#contact-save').on('click', contactSubmitClick);
    $('#contact-cancel').on('click', contactCancelClick);
    $('#password-save').on('click', passwordSubmitClick);
    $('#password-cancel').on('click', passwordCancelClick);
    $('#unsubscribe').on('click', unsubscribeClick);
    $('#subscribe-single').on('click', subscribeSingleClick);
    $('#subscribe-joint').on('click', subscribeJointClick);
  });

})(jQuery);