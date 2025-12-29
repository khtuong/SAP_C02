(function( $ ) {
  $.laq_slide = function( items, $e, pluginvar, config ) {
    var posX1 = 0,
        posX2 = 0,
        posInitial,
        posFinal,
        threshold = 100,
        slides = items.getElementsByClassName('card_parent'),
        slidesLength = slides.length,
        index = 0,
        current_slide_index = 0;
    
    if( slides.length > 0 )  
      slides[0].style.display = 'block';
    // Mouse and Touch events
    items.onmousedown = dragStart;
    
    // Touch events
    $('.ld_advance_btn_swipe_restart input[type=button]').on( 'click', function( ){
      var idx = $(this).data('idx');
      $parent_element = $(this).parent().parent().parent();

      var cards = $parent_element.find(".laq_advanced_swipe_questions_slides_backup .card_parent");
      if( cards.length > 0 ) {
        cards.each(function( index ) {
          var node_id = $(this).data('id');
          $parent_element.find(".swipe-wrap").prepend($(this));
          $parent_element.find('#laq_advanced_swipe_selection'+current_slide_index).val(0);
          $parent_element.find('#laq_advanced_swipe_attempted'+current_slide_index).val('no');
        });
        var real_cards = $parent_element.find(".swipe-wrap .card_parent");
        real_cards.css('display', 'none');
        real_cards.eq(0).css('display', 'block');
      }
    });
    
    items.addEventListener('touchstart', dragStart);
    items.addEventListener('touchend', dragEnd);
    items.addEventListener('touchmove', dragAction);
    
    // Transition events
    items.addEventListener('transitionend', checkIndex);
    
    function dragStart (e) {
      e = e || window.event;
      e.preventDefault();
      posInitial = items.offsetLeft;
      
      if (e.type == 'touchstart') {
        posX1 = e.touches[0].clientX;
      } else {
        posX1 = e.clientX;
        document.onmouseup = dragEnd;
        document.onmousemove = dragAction;
      }
    }

    function dragAction (e) {
      e = e || window.event;
      
      if (e.type == 'touchmove') {
        posX2 = posX1 - e.touches[0].clientX;
        posX1 = e.touches[0].clientX;
      } else {
        posX2 = posX1 - e.clientX;
        posX1 = e.clientX;
      }
      
      items.style.left = (items.offsetLeft - posX2) + "px";
    }
    
    function dragEnd (e) {
      posFinal = items.offsetLeft;
      if (posFinal - posInitial < -threshold) {
        shiftSlide(-1, 'drag', '');
      } else if (posFinal - posInitial > threshold) {
        shiftSlide(1, 'drag', '');
      } else {
        items.style.left = (posInitial) + "px";
      }
      if( slides.length == 0 ) {
        $(items).parent().parent().parent().find('.laq_advanced_swipe_questions_slides').css('display', 'none');
      }
      document.onmouseup = null;
      document.onmousemove = null;
    }
    
    function shiftSlide(dir, action, type) {
      
      if( slides.length > 0 ) {
        items.classList.add('shifting');
        if (!action) { posInitial = items.offsetLeft; }
        $parent_element = $(items).parent().parent().parent();

        $parent_element.find(".laq_advanced_swipe_questions_slides_backup").prepend('<div class="card_parent" data-id="'+$parent_element.find('.card_parent').eq(0).data('id')+'">' + $parent_element.find('.card_parent').eq(0).html()+'</div>');
        var current_swipe_index = $(items).data('id');
        $parent_element.find('.card_parent').eq(0).remove();
        if( dir == 1 ) {
          $parent_element.find('#laq_advanced_swipe_selection'+current_slide_index).val(1);
        } else {
          $parent_element.find('#laq_advanced_swipe_selection'+current_slide_index).val(0);
        }
        $parent_element.find('#laq_advanced_swipe_attempted'+current_slide_index).val('yes');

        var $p = $parent_element.parents('.wpProQuiz_listItem');
        $e.trigger({type: 'questionSolved', values: {item: $p, index: $p.index(), solved: true}});
        
        var new_parent = $parent_element.find('.swipe-wrap');
        var tcount = new_parent.find('.card_parent').length;
        
        if( tcount < 1 ) {
          if( config.mode!=2 ) {
            if( type=='' )
              pluginvar.nextQuestion( );
          } else {
            pluginvar.checkQuestion();
          }
        }
        
        if( slides.length > 0 )
          slides[0].style.display = 'block';
        if( slides.length == 0 ) {
          $parent_element.find('.laq_advanced_swipe_questions_slides').css('display', 'none');
        }
        
        items.style = "";
        current_slide_index++;
      }
    }
    
    function checkIndex (){
      items.classList.remove('shifting');

      if (index == -1) {

        items.style.left = -(slidesLength * slideSize) + "px";
        index = slidesLength - 1;
      }

      if (index == slidesLength) {
        //items.style.left = -(1 * slideSize) + "px";
        index = 0;
      }
      if( slides.length == 0 ) {
        $(items).parent().parent().parent().find('.laq_advanced_swipe_questions_slides').css('display', 'none');
      }
    }
    return {
      shiftSlide: function(dir, action, type) {
        shiftSlide(dir, action, type);
      },
      slides: items.getElementsByClassName('card_parent'),
      slidesLength: slides.length,
    }
  }
})( jQuery );