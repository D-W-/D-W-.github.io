window.onload = init();
function init(){
  var scrollTop = 0;
  window.onscroll = function(){
    var itNav = $('.header-right');
    var itMain = document.getElementById('content');
    //var itList = document.getElementById('list');
    var headerHeight = $('header').outerHeight()-$('.header-right').outerHeight();//包括padding和border
    scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if(scrollTop < headerHeight){
      //itNav.style.position = 'fixed';
      //itNav.className = '';
      itNav.removeClass('fixed-nav');
      itMain.className = '';
      //itList.className = '';
    }
    else{//当header滑到可视区域外，将导航栏固定在页面上
      //itNav.className = 'fixed-nav';
      itNav.addClass('fixed-nav');
      //document.getElementById("main").style.marginTop="64px";
      itMain.className = 'fixed-nav-main';
      //itList.className = 'fixed-nav-list';
    };
  };
}
var onList = 0;
function turnList(){//释放list
  var itList = document.getElementById('list');
  var itBtn = document.getElementById('btn-list');
  var w=window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
  var h=window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
  var maxH = h;
  var list_top = 0;
  $('#list').css({'height': h-100+'px',
                  'width': h/2});
  // if(itList != null){//设置list最大高度
  //   if(itList.className == ''){
  //     list_top = $('header').outerHeight();
  //   }else{
  //     list_top = $('.fixed-nav').outerHeight();
  //   }
  //   maxH = h-list_top;
  //   itList.style.maxHeight = maxH+'px';
  //   // $('#list.fixed-nav-list').css('top',$('.fixed-nav').outerHeight());
  //   // $('#list').css('top',$('header').outerHeight());
  //   itList.style.top = list_top+'px';
  // }     
  if(onList == 0){//将list设为可见，并转转转（tosel）
    itBtn.className = 'tosel';
    itList.className = 'on';
    // itList.style.opacity = 1;
    // itList.style.visibility = 'visible';
    onList = 1;
  }else{
    itBtn.className = '';
    itList.className = 'off';
    // itList.style.opacity = 0;
    // itList.style.visibility = 'hidden';
    onList = 0;
  };
  // $('#btn-list.tosel').css({
  //     'transform': 'translateY('+h/2+'px) rotate(450deg)',
  //     '-ms-transform': 'translateY('+h/2+'px) rotate(450deg)',
  //     '-moz-transform': 'translateY('+h/2+'px) rotate(450deg)', /* Firefox 4 */
  //     '-webkit-transform': 'translateY('+h/2+'px) rotate(450deg)', /* Safari and Chrome */
  //     '-o-transform': 'translateY('+h/2+'px) rotate(450deg)'/* Opera */
  // });
}
$(function () {
  $('html').niceScroll({cursorcolor: '#a11',
            cursorborder: 'none',
            scrollspeed: 60,
            zindex: 1000});
  var niceList = $('#list').niceScroll({cursorcolor: '#068',
            cursorborder: 'none',
            scrollspeed: 60,
            zindex: 1000});
  niceList.hide();
})
// $(function () {//转转转变色
//   $('#btn-list').mouseenter(function(){
//     $('#btn-img').attr('src','/images/list_red.png');
//   }).mouseleave(function(){
//     $('#btn-img').attr('src','/images/list_white.png');
//   });
//   //$('#list').css('top',$('header').outerHeight());
// });