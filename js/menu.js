document.querySelectorAll('.hamburger-off').forEach(el => {
    el.addEventListener('click', function offMenu() {
      document.querySelector('.toggler').checked = false;
    })
  })
  
  
  $(function() {
    $("a[href^='#']").click(function() {
      var _href = $(this);
      $("html, body").animate({
        scrollTop: $(_href).offset().top + "px"
      });
      $('.toggler').prop("checked", false);
      return true;
    });
  });
  
  $('a[data-target^="anchor"]').on('click', function() {
    $('.hamburger-toggler').toggler('hide');
    $a = $($(this).attr('href'));
    return false;
  });