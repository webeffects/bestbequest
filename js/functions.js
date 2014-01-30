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
      href = getCleanHref($el.attr('href'));

    // select current item
    $('.account-item').removeClass('selected');
    $el.addClass('selected');

    switch (href) {
    case 'manage-account':
      // hide other subsections if showing
      collapseManageActivationSection();
      collapseManagePaymentsSection();
      // slide down links block
      $('.account-links').stop(true, true).slideDown();
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
      href = getCleanHref($el.attr('href'));

    // select current item
    $('.account-link-item').removeClass('selected');
    $el.addClass('selected');

    // show account panels block with selected account carousel slide
    showAccountPanelsBlock(href);
  }

  function carouselControlClick(e) {
		// to make carousel controls work properly we need to show all the slides
		$('.item.manage-account').css('display', '');
  }


  // =========================
  // SHOW & COLLAPSE FUNCTIONS
  // =========================

  // shows account panels block in Account section
  function showAccountPanelsBlock(id) {
    var $accountPanels = $('#account-panels'),
      $currentSlide,
      backgroundHeight;
    if ($accountPanels.is(':hidden')) {
      // get min-height of slide that will be shown first
      backgroundHeight = $('#' + id).css('min-height');
      // set height of account panels block (for proper slide down effect)
      $accountPanels.css('height', backgroundHeight);
      // slide down account panels block
      $accountPanels.slideDown(function () {
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
      // deselect all bubble links
      $('.account-item').removeClass('selected');
    });
  }

  // hides Manage Account subsection blocks
  function collapseManageAccountSection() {
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
      // slide up account links block
      $accountLinks.stop(true, true).slideUp(function () {
        // deselect all Manage Account subsection links
        $('.account-link-item').removeClass('selected');
      });
    }
  }

  // hides Manage Activation subsection blocks
  function collapseManageActivationSection() {

  }

  // hides Manage Payments subsection blocks
  function collapseManagePaymentsSection() {

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
    // register event handlers
    $('#account_link').on('click', accountClick);
    $('.account-item').on('click', accountItemClick);
    $('.account-link-item').on('click', accountLinkItemClick);
    $('.carousel-control').on('click', carouselControlClick);
  });

})(jQuery);