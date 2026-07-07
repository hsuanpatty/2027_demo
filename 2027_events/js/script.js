// =========================
// GoTop 回到頂端按鈕
// =========================

$(function () {

  var goTopButton = $('#goTop');


  // 初始隱藏
  goTopButton.hide();


  // 點擊回頂端
  goTopButton.on('click', function () {

    $('html, body').animate({
      scrollTop: 0
    }, 800);

    return false;

  });


  // 滾動控制顯示 / 隱藏
  $(window).on('scroll resize', function () {

    var scrollTop = $(window).scrollTop();


    // 往下滑超過 50px 顯示
    if (scrollTop > 50) {

      goTopButton
        .stop(true, true)
        .fadeIn(300)
        .css('display', 'flex');

    } else {

      // 回到最上方隱藏
      goTopButton
        .stop(true, true)
        .fadeOut(300);

    }

  });


});