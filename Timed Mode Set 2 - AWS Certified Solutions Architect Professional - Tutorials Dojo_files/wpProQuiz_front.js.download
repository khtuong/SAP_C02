(function ($) {
  /**
   * @memberOf $
   */
  $.wpProQuizFront = function (element, options) {
    var $e = $(element);
    var config = options;
    var result_settings = {};
    var plugin = this;
    var results = new Object();
    var catResults = new Object();
    var startTime = 0;
    var currentQuestion = null;
    var quizSolved = [];
    //var is_quiz_resume_in_process = "no";
    //var question_resumed = [];
    //var is_resume_save_event_attached = false;
    var lastButtonValue = "";
    var inViewQuestions = false;
    var currentPage = 1;
    var timespent = 0;
    var sending_timer = null;

    var cookie_name = "";
	var cookie_value = "";
	
	/**
	 * Save & Resume Integration
	 * - Check if element is done initializing 
	 */
	var initStatus = true;

    var bitOptions = {
      randomAnswer: 0,
      randomQuestion: 0,
      disabledAnswerMark: 0,
      checkBeforeStart: 0,
      preview: 0,
      cors: 0,
      isAddAutomatic: 0,
      quizSummeryHide: 0,
      skipButton: 0,
      reviewQustion: 0,
      autoStart: 0,
      forcingQuestionSolve: 0,
      hideQuestionPositionOverview: 0,
      formActivated: 0,
      maxShowQuestion: 0,
      sortCategories: 0
    };

    var quizStatus = {
      isQuizStart: 0,
      isLocked: 0,
      loadLock: 0,
      isPrerequisite: 0,
      isUserStartLocked: 0
    };

    /*
			var QuizRepeats = {
				quizRepeats: 0,
				userAttemptsTaken: 0,
				userAttemptsLeft: 0,
			};
		*/
    var globalNames = {
      check: 'input[name="check"]',
      next: 'input[name="next"]',
      questionList: ".wpProQuiz_questionList",
      skip: 'input[name="skip"]',
      singlePageLeft: 'input[name="wpProQuiz_pageLeft"]',
      singlePageRight: 'input[name="wpProQuiz_pageRight"]',
      //save: 'input[name="save"]', //Added by webxity
      //resume: 'input[name="resume"]' //Added by webxity
    };

    var globalElements = {
      back: $e.find('input[name="back"]'),
      next: $e.find(globalNames.next),
      quiz: $e.find(".wpProQuiz_quiz"),
      questionList: $e.find(".wpProQuiz_list"),
      results: $e.find(".wpProQuiz_results"),
      sending: $e.find(".wpProQuiz_sending"),
      quizStartPage: $e.find(".wpProQuiz_text"),
      timelimit: $e.find(".wpProQuiz_time_limit"),
      toplistShowInButton: $e.find(".wpProQuiz_toplistShowInButton"),
      listItems: $(),
      //save: $(".ld_advance_quiz_save"), //Added by webxity
      //resume: $(".ld_advance_quiz_resume"), //Added by webxity
      //save_as_next: $("#ld_advanced_save_as_next").val() //Added by webxity
    };

    var toplistData = {
      token: "",
      isUser: 0
    };

    var formPosConst = {
      START: 0,
      END: 1
    };

    // var viewedQuestions = [];
    // var checkedQuestions = [];
    // var resumedQuestions = [];

    //Added by Webxity - Start
    //var quiz_question_timer_enabled = LDAdvancedQuizVars.quiz_disable_question_time_limit === "0";
    //Added by Webxity - End

    /**
     * @memberOf timelimit
     */
    var timelimit = (function () {
      var _counter = config.timelimit;
      var _intervalId = 0;
      var instance = {};

      // set cookie for different users and different quizzes
      var timer_cookie =
        "ldadv-time-limit-" + config.user_id + "-" + config.quizId;

      instance.stop = function () {
        if (_counter) {
          $.removeCookie(timer_cookie);
          window.clearInterval(_intervalId);
          globalElements.timelimit.hide();
          _intervalId = 0;
        }
      };
    //   instance.getInterval = function () {
    //     return _intervalId;
    //   };
    //   //section by webxity
    //   instance.pause = function () {
    //     if (_counter) {
    //       //$.removeCookie(timer_cookie);
    //       window.clearInterval(_intervalId);
    //       globalElements.timelimit.hide();
    //       _intervalId = 0;
    //     }
    //   };
    //   //End section by webxity;
       instance.start = function () {

        //section by webxity
        //var differnt_limit = $("#ld_advanced_question_time_limit").val();

        // if(differnt_limit == 'yes' && quiz_question_timer_enabled) {
        //     _counter = config.timelimit;
        // }

        // if(_counter == 0) {
        //   _counter.NaN;
        // }
        //End section by webxity;

        if (!_counter) return;

        $.cookie.raw = true;

        var full = _counter * 1000;
        var tick = $.cookie(timer_cookie);
        var limit = tick ? tick : _counter;
        var x = limit * 1000;

        var $timeText = globalElements.timelimit
          .find("span")
          .text(plugin.methode.parseTime(limit));
        var $timeDiv = globalElements.timelimit.find(".wpProQuiz_progress");

        globalElements.timelimit.show();

        var beforeTime = +new Date();

        _intervalId = window.setInterval(function () {
          var diff = +new Date() - beforeTime;
          var remainingTime = x - diff;

          if (diff >= 500) {
            tick = remainingTime / 1000;
            $timeText.text(plugin.methode.parseTime(Math.ceil(tick)));
            $.cookie(timer_cookie, tick);
          }

          $timeDiv.css("width", (remainingTime / full) * 100 + "%");
			
			//TD-342 Start: Paused Practice Test is Auto-Submitting After the Test Expiry
			
		  var srfl_pause = document.getElementsByName('srfl_puase')[0];
			
		  // bugfix/TD-803: Automatic submission of quizzes within the time limit is not working in Final Test Mode
		  if (!window.location.pathname.includes("/lessons/final-test") && (!/\/lessons\/.*-final-test/.test(window.location.pathname))) { 
			  srfl_pause.addEventListener("click", pause);
		  }
// 		  var srfl_resume=document.getElementsByName('srfl_unpuase')[0];
// 		  srfl_resume.addEventListener("click", resume);
			
// 		  function resume(){
// 		 	if(window.location.href.includes('practice-exams-timed-mode')) {
// 				resume = location.reload();
// 				console.log("Reloading... TD-342");
// 		  	}
// 		  }
			
		  function pause(){
			clearInterval(_intervalId);
			_intervalId = null;
		  }
			
		  //TD-342 End

          if (remainingTime <= 0) {
            instance.stop();

            //Section by webxity
            // var differnt_limit = $("#ld_advanced_question_time_limit").val();
            // if (differnt_limit == "yes" && quiz_question_timer_enabled) plugin.methode.nextQuestion();
            // else {
              plugin.methode.finishQuiz(true);
            //}

            // $(".wp_pro_quiz_message")
            //   .html("")
            //   .css("display", "none");
            //End Section by webxity
          }
        }, 16);
      };

      return instance;
    })();

    var current_index = 0;
    //var mySwipe = null;
    var mySwipe = [];
    var not_started_yet = true;
    function myswipefunction() {
      mySwipe = [];
      var swipe_elements = document.getElementsByClassName(
        "laq_advanced_swipe_questions_slides"
      );
      for (var i = 0; i < swipe_elements.length; i++) {
        var swipe_element = swipe_elements[i];
        var currid = mySwipe.length;
        mySwipe[currid] = $.laq_slide(
          swipe_element,
          $e,
          plugin.methode,
          config
        );
      }
    }

    /**
     * @memberOf reviewBox
     */
    var reviewBox = new (function () {
      var $contain = [],
        $cursor = [],
        $list = [],
        $items = [];
      var x = 0,
        offset = 0,
        diff = 0,
        top = 0,
        max = 0;
	  var itemsStatus = [];
	  /**
	   * Save & Resume integration
	   * Set revied items window object with current item status.
	   */
	  window.srflReviewedItems = itemsStatus;

      this.init = function () {
        $contain = $e.find(".wpProQuiz_reviewQuestion");
        $cursor = $contain.find("div");
        $list = $contain.find("ol");
        $items = $list.children();

        $cursor.mousedown(function (e) {
          e.preventDefault();
          e.stopPropagation();

          offset = e.pageY - $cursor.offset().top + top;

          $(document).bind("mouseup.scrollEvent", endScroll);
          $(document).bind("mousemove.scrollEvent", moveScroll);
        });

        $items.click(function (e) {
          plugin.methode.showQuestion($(this).index());
        });

        $e.bind("questionSolved", function (e) {
          //console.log('questionSolved: e.values.index[%o]', e.values.index);
          //if (config.ld_script_debug == true) {
          //	console.log('reviewBox: e.values[%o]', e.values);
          //}
          if (itemsStatus[e.values.index]) {
			itemsStatus[e.values.index].solved = e.values.solved;
			/**
			 * Save & Resume Integration
			 * Added by Wayne - Add questionSolved argument to setColor()
			 * */ 
			//setColor(e.values.index);
            setColor(e.values.index, "questionSolved");
		  }		  
        });

        $e.bind("changeQuestion", function (e) {
          // On Matrix sort questions we need to set the sort capture UL to full height.
          if (e.values.item[0] != "undefined") {
            var questionItem = e.values.item[0];
            plugin.methode.setupMatrixSortHeights();
          }

          $items.removeClass("wpProQuiz_reviewQuestionTarget");
          //$items.removeClass('wpProQuiz_reviewQuestionSolved');
          //$items.removeClass('wpProQuiz_reviewQuestionReview');

          $items.eq(e.values.index).addClass("wpProQuiz_reviewQuestionTarget");

          scroll(e.values.index);

        //   e.values.item.each(function () {
        //     var $this = $(this);

        //     var question_index = $this.index();
        //     var $questionList = $this.find(globalNames.questionList);
        //     var question_id = $questionList.data("question_id");
        //     var data = config.json[$questionList.data("question_id")];
        //     if (data) {
        //       var name = data.type;
        //       if (data.type == "single" || data.type == "multiple") {
        //         name = "singleMulti";
        //       }

        //       viewedQuestions.push(question_id);

        //       //if (config.ld_script_debug == true) {
        //       //	console.log('CookieProcessQuestionResponse: calling readResponses');
        //       //}
        //       //var question_response = readResponses(name, data, $this, $questionList, false);

        //       //if (config.ld_script_debug == true) {
        //       //	console.log('CookieProcessQuestionResponse: calling CookieSaveResponse');
        //       //	console.log('question_id[%o], question_index[%o], data.type[%o], question_response[%o]', question_id, question_index, data.type, question_response);
        //       //}

        //       //plugin.methode.CookieSaveResponse(question_id, question_index, data.type, question_response);
        //     }
        //   });
        });

        $e.bind('reviewQuestion', function(e) {
			
			//console.log('reviewQuestion: e.values.index[%o]', e.values.index);
			//console.log(currentQuestion.index());
			itemsStatus[e.values.index].review = !itemsStatus[e.values.index].review;
			/**
			 * Save & Resume Integration
			 * Added by Wayne - Add reviewQuestion argument to setColor() 
			 */ 
			//setColor(e.values.index);
			setColor(e.values.index, "reviewQuestion");

			// 	jon-start - Fix for Review button - toggle
			// if(itemsStatus[e.values.index].review){
			// 	$items.eq(e.values.index).addClass( 'wpProQuiz_reviewQuestionReview' );
			// } else {
			// 	$items.eq(e.values.index).removeClass( 'wpProQuiz_reviewQuestionReview' );
			// }

        });

        /*
				$contain.bind('mousewheel DOMMouseScroll', function(e) {
					e.preventDefault();

					var ev = e.originalEvent;
					var w = ev.wheelDelta ? -ev.wheelDelta / 120 : ev.detail / 3;
					var plus = 20 * w;

					var x = top - $list.offset().top  + plus;

					if(x > max)
						x = max;

					if(x < 0)
						x = 0;

					var o = x / diff;

					$list.attr('style', 'margin-top: ' + (-x) + 'px !important');
					$cursor.css({top: o});

					return false;
				});
				*/
      };

      this.show = function (save) {
        if (bitOptions.reviewQustion) $contain.parent().show();

        $e.find(".wpProQuiz_reviewDiv .wpProQuiz_button2").show();

        if (save) return;

        $list.attr("style", "margin-top: 0px !important");
        $cursor.css({ top: 0 });

        var h = $list.outerHeight();
        var c = $contain.height();
        x = c - $cursor.height();
        offset = 0;
        max = h - c;
        diff = max / x;

		this.reset();

		/**
		 * Save & Resume integration
		 * Load saved and reviewed questions if save and resume is active.
		 */
		
		if ( 'undefined' != typeof WpProQuizGlobal.srfl_quiz_progress && 'undefined' != typeof WpProQuizGlobal.srfl_quiz_progress.reviewed ) {

			var customItemsStatus = [];
			
			if ( '' != WpProQuizGlobal.srfl_quiz_progress.reviewed ) {
				customItemsStatus = JSON.parse(WpProQuizGlobal.srfl_quiz_progress.reviewed);
				jQuery.each( customItemsStatus, function( index, question ) {
					itemsStatus[index] = {};
					if ( 'undefined' != typeof question.review && "true" === question.review ) {
						itemsStatus[index].review = true;
						setColor(index, 'reviewQuestion');
					} else {
						itemsStatus[index].review = false;
					}
					if ( 'undefined' != typeof question.solved && "true" === question.solved ) {
						itemsStatus[index].solved = true;
					} else {
						itemsStatus[index].solved = false;
					}
				} );
	
			}

		}

        if (h > 100) {
          $cursor.show();
        }

        top = $cursor.offset().top;
      };

      this.hide = function () {
        $contain.parent().hide();
      };

      this.toggle = function () {
        if (bitOptions.reviewQustion) {
          $contain.parent().toggle();
          $items.removeClass("wpProQuiz_reviewQuestionTarget");
          $e.find(".wpProQuiz_reviewDiv .wpProQuiz_button2").hide();

          $list.attr("style", "margin-top: 0px !important");
          $cursor.css({ top: 0 });

          var h = $list.outerHeight();
          var c = $contain.height();
          x = c - $cursor.height();
          offset = 0;
          max = h - c;
          diff = max / x;

          if (h > 100) {
            $cursor.show();
          }

          top = $cursor.offset().top;
        }
      };

      this.reset = function () {
        for (var i = 0, c = $items.length; i < c; i++) {
          itemsStatus[i] = {};
        }

        //$items.removeClass('wpProQuiz_reviewQuestionTarget').css('background-color', '');
        $items.removeClass("wpProQuiz_reviewQuestionTarget");
        $items.removeClass("wpProQuiz_reviewQuestionSolved");
        $items.removeClass("wpProQuiz_reviewQuestionReview");
      };

      function scroll(index) {
        /*
				var $item = $items.eq(index);
				var iTop = $item.offset().top;
				var cTop = $contain.offset().top;
				var calc = iTop - cTop;


				if((calc - 4) < 0 || (calc + 32) > 100) {
					var x = cTop - $items.eq(0).offset().top - (cTop - $list.offset().top)  + $item.position().top;

					if(x > max)
						x = max;

					var o = x / diff;

					$list.attr('style', 'margin-top: ' + (-x) + 'px !important');
					$cursor.css({top: o});
				}
				*/
      }

      function setColor(index, trigger) {
        var css_class = "";
		var itemStatus = itemsStatus[index];

		/**
		 * Save & Resume Integration
		 * Removed by Wayne - Recreate this logic on line 463
		 * */ 		
		// if(itemStatus.solved) {
		// 	css_class = "wpProQuiz_reviewQuestionSolved";
		// } else if (itemStatus.review) {
		// 	css_class = "wpProQuiz_reviewQuestionReview";
		// }

		//Added by Wayne - custom logic to review and question solved display
		if (trigger === "reviewQuestion" && itemStatus.solved && itemStatus.review) {
			css_class = "wpProQuiz_reviewQuestionReview";
		} else if (trigger === "questionSolved" && itemStatus.solved && itemStatus.review) {
			
			css_class = "wpProQuiz_reviewQuestionSolved";
			// Set review to false if item is solved and review and initStatus = false
			itemStatus.review =false;

			//Do this if initStatus = true
			if( initStatus === true ) {
				itemStatus.review = true;			
				css_class = "wpProQuiz_reviewQuestionReview";
			}
			
		} else if (itemStatus.solved && !itemStatus.review) {
			css_class = "wpProQuiz_reviewQuestionSolved";
		} else if (!itemStatus.solved && itemStatus.review) {
			css_class = "wpProQuiz_reviewQuestionReview";

			
		} else if (!itemStatus.solved && !itemStatus.review){
			css_class = "";
		}

        $items.eq(index).removeClass("wpProQuiz_reviewQuestionSolved");
        $items.eq(index).removeClass("wpProQuiz_reviewQuestionReview");

        if (css_class != "") {
          $items.eq(index).addClass(css_class);
        }
      }

      function moveScroll(e) {
        e.preventDefault();

        var o = e.pageY - offset;

        if (o < 0) o = 0;

        if (o > x) o = x;

        var v = diff * o;

        $list.attr("style", "margin-top: " + -v + "px !important");

        $cursor.css({ top: o });
      }

      function endScroll(e) {
        e.preventDefault();

        $(document).unbind(".scrollEvent");
      }
    })();

    function QuestionTimer() {
      var questionStartTime = 0;
      var currentQuestionId = -1;

      var quizStartTimer = 0;
      var isQuizStart = false;

      this.questionStart = function (questionId) {
        if (currentQuestionId != -1) this.questionStop();
        // //Section by webxity
        // $e.find(".wpProQuiz_questionList").each(function () {
        //   var $this = $(this);
        //   var question_Id = $this.data("question_id");
        //   if (question_Id == questionId) {
        //     var tmLimit = $(this)
        //       .parent(".wpProQuiz_question")
        //       .siblings(".ld_advanced_time_limit")
        //       .val();
        //     config.timelimit = parseInt(tmLimit);
        //   }
        // });

        // var differnt_limit = $("#ld_advanced_question_time_limit").val();
        // if (differnt_limit == "yes" && quiz_question_timer_enabled) {
        //   timelimit.start();
        // }
        // //End Section by webxity

        currentQuestionId = questionId;
        questionStartTime = +new Date();
      };

      this.questionStop = function () {
        if (currentQuestionId == -1) return;

        //Section by webxity
        // var differnt_limit = $("#ld_advanced_question_time_limit").val();
        // if (differnt_limit == "yes" && quiz_question_timer_enabled) timelimit.stop();
        //End Section by webxity

        results[currentQuestionId].time += Math.round(
          (new Date() - questionStartTime) / 1000
        );

        currentQuestionId = -1;
      };

      this.startQuiz = function () {
        if (isQuizStart) this.stopQuiz();

        quizStartTimer = +new Date();
        isQuizStart = true;
      };

      this.stopQuiz = function () {
        if (!isQuizStart) return;

        quizEndTimer = +new Date();
        results["comp"].quizTime += Math.round(
          (quizEndTimer - quizStartTimer) / 1000
        );
        //timelimit.stop();
        results["comp"].quizEndTimestamp = quizEndTimer;
        results["comp"].quizStartTimestamp = quizStartTimer;

        isQuizStart = false;
      };

      this.init = function () { };
    }

	var questionTimer = new QuestionTimer();


	/**
	 * Feature - Pause on Review Mode
	 * Lock the response of a question on first load.
	 * @param {HTMLElement} $questionList 
	 * @param {string} type 
	 */
	
	var lockResponse = function($questionList, type) {
    console.log(type);
		var func = {
			singleMulti: function () {
				$questionList
				  .find(".wpProQuiz_questionInput")
				  .attr("disabled", "disabled");
			},
	
			sort_answer: function () {
				$questionList.sortable("destroy");
			},
	
			matrix_sort_answer: function () {
				$questionList
				  .find(
					".wpProQuiz_sortStringList, .wpProQuiz_maxtrixSortCriterion"
				  )
				  .sortable("destroy");
			},
			free_answer: function () {
			  var $li = $questionList.children();
				$li.find(".wpProQuiz_questionInput").attr("disabled", "disabled");
			},
	
			cloze_answer: function () {
			  response = {};
			  $questionList.find(".wpProQuiz_cloze").each(function (i, v) {
				  input.attr("disabled", "disabled");
			  });
			},
			assessment_answer: function () {
				$questionList
				  .find(".wpProQuiz_questionInput")
				  .attr("disabled", "disabled");
			},
			essay: function () {
				$questionList
				  .find(".wpProQuiz_questionEssay")
				  .attr("disabled", "disabled");
			},
			laq_jumbled_sentence: function () {
				$questionList
					.find(".laq_jumbled_sentence_dropdown")
					.attr("disabled", "disabled");
			},
			laq_hotspot_question: function() {
				$questionList.find(".laq_hotspot_input").attr("disabled", "disabled");
			}
		  };
		  func[type]();
	}

    var readResponses = function (
      name,
      data,
      $question,
      $questionList,
      lockResponse
    ) {
      //if (config.ld_script_debug == true) {
      //	console.log('readResponses: name[%o], data[%o], $question[%o], $questionList[%o], lockResponse[%o]', name, data, $question, $questionList, lockResponse);
      //}

      if (lockResponse == undefined) lockResponse = true;
      var response = {};
      var func = {
        singleMulti: function () {
          var input = $questionList.find(".wpProQuiz_questionInput");
          if (lockResponse == true) {
            $questionList
              .find(".wpProQuiz_questionInput")
              .attr("disabled", "disabled");
          }
          //$questionList.children().each(function(i) {
          // Changed in v2.3 from the above. children() was pickup up some other random HTML elements within the UL like <p></p>.
          // Now we are targetting specifically the .wpProQuiz_questionListItem HTML elements.
          jQuery(".wpProQuiz_questionListItem", $questionList).each(function (
            i
          ) {
            var $item = $(this);
            var index = $item.attr("data-pos");
            if (typeof index !== "undefined") {
              response[index] = input.eq(i).is(":checked");
            }
          });
        },

        sort_answer: function () {
          var $items = $questionList.children();

          $items.each(function (i, v) {
            var $this = $(this);
            response[i] = $this.attr("data-pos");
          });
          if (lockResponse == true) {
            $questionList.sortable("destroy");
          }
        },

        matrix_sort_answer: function () {
          var $items = $questionList.children();
          var matrix = new Array();
          statistcAnswerData = { 0: -1 };

          $items.each(function () {
            var $this = $(this);
            var id = $this.attr("data-pos");
            var $stringUl = $this.find(".wpProQuiz_maxtrixSortCriterion");
            var $stringItem = $stringUl.children();

            if ($stringItem.length)
              statistcAnswerData[$stringItem.attr("data-pos")] = id;

            response = statistcAnswerData;
          });
          if (lockResponse == true) {
            $question
              .find(
                ".wpProQuiz_sortStringList, .wpProQuiz_maxtrixSortCriterion"
              )
              .sortable("destroy");
          }
        },

        free_answer: function () {
          var $li = $questionList.children();
          var value = $li.find(".wpProQuiz_questionInput").val();
          if (lockResponse == true) {
            $li.find(".wpProQuiz_questionInput").attr("disabled", "disabled");
          }
          response = value;
        },

        cloze_answer: function () {
          response = {};
          $questionList.find(".wpProQuiz_cloze").each(function (i, v) {
            var $this = $(this);
            var cloze = $this.children();
            var input = cloze.eq(0);
            var span = cloze.eq(1);
            var inputText = plugin.methode.cleanupCurlyQuotes(input.val());
            response[i] = inputText;
            if (lockResponse == true) {
              input.attr("disabled", "disabled");
            }
          });
        },

        assessment_answer: function () {
          correct = true;
          var $input = $questionList.find(".wpProQuiz_questionInput");
          if (lockResponse == true) {
            $questionList
              .find(".wpProQuiz_questionInput")
              .attr("disabled", "disabled");
          }
          var val = 0;

          $input.filter(":checked").each(function () {
            val += parseInt($(this).val());
          });

          response = val;
        },

        essay: function () {
          var question_id = $question
            .find("ul.wpProQuiz_questionList")
            .data("question_id");
          if (lockResponse == true) {
            $questionList
              .find(".wpProQuiz_questionEssay")
              .attr("disabled", "disabled");
          }

          var essayText = $questionList.find(".wpProQuiz_questionEssay").val();
          var essayFiles = $questionList
            .find("#uploadEssayFile_" + question_id)
            .val();

          if (typeof essayText != "undefined") {
            response = essayText;
          }

          if (typeof essayFiles != "undefined") {
            response = essayFiles;
          }
        },
        laq_jumbled_sentence: function () {
          var question_id = $question
            .find("ul.wpProQuiz_questionList")
            .data("question_id");
          var jumbled = [];
          var is_added_already = [];

          $question.find(".question_options").each(function (i) {
            var $item = $(this);
            var data_id = $item.attr('id');

            if ($item.data('pts_for_each_usage') == 'no') {
              jumbled[jumbled.length] = {
                id: $item.attr("id"),
                name: $item.attr("name"),
                pts_each_usage: $item.data('pts_for_each_usage'),
                option: $item.val(),
                correct: $question
                  .find(".correct_options")
                  .eq(i)
                  .val(),
                pts: $question
                  .find(".correct_points")
                  .eq(i)
                  .val()
              };
            } else {
              if (!in_array(is_added_already, $item.attr('id'))) {
                is_added_already[data_id] = $item.attr('id');
                jumbled[jumbled.length] = {
                  id: $item.attr("id"),
                  name: $item.attr("name"),
                  pts_each_usage: $item.data('pts_for_each_usage'),
                  option: $item.val(),
                  correct: $question
                    .find(".correct_options")
                    .eq(i)
                    .val(),
                  pts: $question
                    .find(".correct_points")
                    .eq(i)
                    .val()
                };
              }
            }
          });
		  response = jumbled;

            if (lockResponse == true) {
                $questionList
                    .find(".laq_jumbled_sentence_dropdown")
                    .attr("disabled", "disabled");
            }
        },
        laq_swipe_questions: function () {
          var question_id = $question
            .find("ul.wpProQuiz_questionList")
            .data("question_id");
          var swipes = [];
          $question.find(".laq_advanced_swipe_selection").each(function (i) {
            var $item = $(this);
            swipes[swipes.length] = {
              selection: $item.val(),
              attempted: $question
                .find(".laq_advanced_swipe_attempted")
                .eq(i)
                .val(),
              correct: $question
                .find(".laq_advanced_swipe_correct")
                .eq(i)
                .val(),
              pts: $question
                .find(".laq_advanced_swipe_points")
                .eq(i)
                .val()
            };
          });
          response = swipes;
        },
        laq_calculated_formula: function () {
          var question_id = $question
            .find("ul.wpProQuiz_questionList")
            .data("question_id");

          var calculations = [];
          $question
            .find(".laq_advanced_calculated_selection")
            .each(function (i) {
              var $item = $(this);
              calculations[calculations.length] = {
                selection: $item.val(),
                correct: $question
                  .find(".laq_advanced_calculated_correct")
                  .eq(i)
                  .val(),
                pts: $question
                  .find(".laq_advanced_calculated_points")
                  .eq(i)
                  .val()
              };
            });

            //TODO: Uncomment this after fixing calculated formula resume functionality
            /*if (lockResponse == true) {
                $questionList
                    .find(".laq_advanced_calculated_selection")
                    .attr("disabled", "disabled");
            }*/
          response = calculations;
    },
		/**
		 * Hotspot Question
		 * Read responses and save to Learndash cookie format
		 */
		laq_hotspot_question: function() {
			var question_id = $question.find("ul.wpProQuiz_questionList").data("question_id");
			var hotspot= [];

			$question.find('.hotspot_question_row').each(function(){
				var $item = $(this);
				var $shortcode = $item.attr('id');
				
				var $input = $(this).find('.laq_hotspot_input:checked').val();

				if ($input == null) {
					$input = '';
				}

				hotspot[hotspot.length] = {
					id: $shortcode,
					name: 'option_' + $shortcode,
					pts_each_usage: $item.data('pts_for_each_usage'),
					option: $input,
					correct: $item.find(".correct_options").val(),
					pts: $item.find(".correct_points").val()
				};
				
				response = hotspot;

			});

			if (lockResponse == true) {
                $questionList.find(".laq_hotspot_input").attr("disabled", "disabled");
            }
		}
      };
	  func[name]();
	  
	  //Mark a question as Checked
	  //response.checked = $questionList.find('.wpProQuiz_response:visible') ? 'true' : '';

      return { response: response };
    };

    function in_array(arr, obj) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == obj) return true;
      }
    }

    // Called from the Cookie handler logic. If the Quiz is loaded and a cookie is present the values of the cookie are used
    // to set the Quiz elements here. Once the value is set we call the trigger 'questionSolved' to update the question overview panel.
    function setResponse(
      question_data,
      question_value,
      question,
      $questionList
    ) {
      if (question_data.type == "single" || question_data.type == "multiple") {
        $questionList.children().each(function (i) {
          var $item = $(this);
          var index = $item.attr("data-pos");

          if (question_value[index] != undefined) {
            var index_value = question_value[index];
            if (index_value == true) {
              $(".wpProQuiz_questionInput", $item).prop("checked", "checked");

              $e.trigger({
                type: "questionSolved",
                values: {
                  item: question,
                  index: question.index(),
                  solved: true
                }
              });
            }
          }
        });
      } else if (question_data.type == "free_answer") {
        $questionList.children().each(function (i) {
          var $item = $(this);
          $(".wpProQuiz_questionInput", this).val(question_value);
        });
        $e.trigger({
          type: "questionSolved",
          values: { item: question, index: question.index(), solved: true }
        });
      } else if (question_data.type == "sort_answer") {
        jQuery.each(question_value, function (pos, key) {
          var this_li = $(
            'li.wpProQuiz_questionListItem[data-pos="' + key + '"]',
            $questionList
          );
          var this_li_inner = $("div.wpProQuiz_sortable", this_li);
          var this_li_inner_value = $(this_li_inner).text();

          jQuery($questionList).append(this_li);
        });
        $e.trigger({
          type: "questionSolved",
          values: { item: question, index: question.index(), solved: true }
        });
      } else if (question_data.type == "matrix_sort_answer") {
        jQuery.each(question_value, function (pos, key) {
          var question_response_item = $(
            '.wpProQuiz_matrixSortString .wpProQuiz_sortStringList li[data-pos="' +
            pos +
            '"]',
            question
          );
          var question_destination_outer_li = $(
            'li.wpProQuiz_questionListItem[data-pos="' +
            key +
            '"] ul.wpProQuiz_maxtrixSortCriterion',
            $questionList
          );

          jQuery(question_response_item).appendTo(
            question_destination_outer_li
          );
        });
        $e.trigger({
          type: "questionSolved",
          values: { item: question, index: question.index(), solved: true }
        });
      } else if (question_data.type == "cloze_answer") {
        // Get the input fields within the questionList parent
        jQuery('span.wpProQuiz_cloze input[type="text"]', $questionList).each(
          function (index) {
            if (typeof question_value[index] !== "undefined") {
              $(this).val(question_value[index]);
            }
          }
        );
        $e.trigger({
          type: "questionSolved",
          values: { item: question, index: question.index(), solved: true }
        });
      } else if (question_data.type == "assessment_answer") {
        $(
          'input.wpProQuiz_questionInput[value="' + question_value + '"]',
          $questionList
        ).attr("checked", "checked");
        $e.trigger({
          type: "questionSolved",
          values: { item: question, index: question.index(), solved: true }
        });
      } else if (question_data.type == "essay") {
        // The 'essay' value is generic. We need to figure out if this is an upload or inline essay.
        if ($questionList.find("#uploadEssayFile_" + question_data.id).length) {
          var question_input = $questionList.find(
            "#uploadEssayFile_" + question_data.id
          );
          $(question_input).val(question_value);
          $("<p>" + basename(question_value) + "</p>").insertAfter(
            question_input
          );
          $e.trigger({
            type: "questionSolved",
            values: { item: question, index: question.index(), solved: true }
          });
        } else if ($questionList.find(".wpProQuiz_questionEssay").length) {
          $questionList.find(".wpProQuiz_questionEssay").html(question_value);
          $e.trigger({
            type: "questionSolved",
            values: { item: question, index: question.index(), solved: true }
          });
        }
        //Added by Webxity
      } else if (question_data.type == "laq_jumbled_sentence") {
        /**
         * Save & Resume Integration
         * - Restore jumbled question answer if initiated by Cookie
         */
        $.each(question_value, function(index, val){
            if(typeof val.option == "undefined" || val.option == null || val.option == '') {
                $e.find(`select[name="${val.id}"] option[value=""]`).attr('selected', 'selected');
            } else {
                $e.find(`select[name="${val.id}"] option[value="${val.option}"]`).attr('selected', 'selected');
            }

        });
        $e.trigger({
          type: "questionSolved",
          values: { item: question, index: question.index(), solved: true }
        });
      } else if (question_data.type == "laq_swipe_questions") {
        $e.trigger({
          type: "questionSolved",
          values: { item: question, index: question.index(), solved: true }
        });
      } else if (question_data.type == "laq_calculated_formula") {
        $e.trigger({
          type: "questionSolved",
          values: { item: question, index: question.index(), solved: true }
        });
        //End Added by Webxity
	  } else if (question_data.type == 'laq_hotspot_question') {
		
        //Check if hotspot does not have a value
        var hotspotHasValue = false; 

        $.each(question_value, function(index, val) {

            //Change condition to detect empty hotspot questions
			//if(typeof val.option !== "undefined" || val.option !== null || val.option !== "" || val.option.length !== 0 ) {
            if( val.option.length !== 0 ) {

				$e.find(`input[name="${val.name}"][value="${val.option}"]`).iCheck("check");

                if(hotspotHasValue == false) {
                    hotspotHasValue = true;
                }
	
			}	

		});

        //Check if hotspot does not have a value before marking as solved
        if( hotspotHasValue ) {
            
            $e.trigger({
                type: "questionSolved",
                values: {
                    item: question,
                    index: question.index(),
                    solved: true}
            });

        }
		
	  } else {
        //console.log('unsupported type[%o]', question_data.type);
        //console.log('setResponse: question_data[%o] question_value[%o] question[%o], $questionList[%o]', question_data, question_value, question, $questionList);
      }
    }

    function basename(path) {
      if (path != undefined) {
        return path.split("/").reverse()[0];
      }
      return "";
    }
    /**
     *  @memberOf formClass
     */
    var formClass = new (function () {
      var funcs = {
        isEmpty: function (str) {
          str = $.trim(str);
          return !str || 0 === str.length;
        }

        //					testValidate: function(str, type) {
        //						switch (type) {
        //						case 0: //None
        //							return true;
        //						case 1: //Text
        //							return !funcs.isEmpty(str);
        //						case 2: //Number
        //							return !isNaN(str);
        //						case 3: //E-Mail
        //							return new RegExp(/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/)
        //                                          .test($.trim(str));
        //						}
        //					}
      };

      var typeConst = {
        TEXT: 0,
        TEXTAREA: 1,
        NUMBER: 2,
        CHECKBOX: 3,
        EMAIL: 4,
        YES_NO: 5,
        DATE: 6,
        SELECT: 7,
        RADIO: 8
      };

      this.checkForm = function () {
        var check = true;

        $e.find(
          ".wpProQuiz_forms input, .wpProQuiz_forms textarea, .wpProQuiz_forms .wpProQuiz_formFields, .wpProQuiz_forms select"
        ).each(function () {
          var $this = $(this);
          var isRequired = $this.data("required") == 1;
          var type = $this.data("type");
          var test = true;
          var value = $.trim($this.val());

          switch (type) {
            case typeConst.TEXT:
            case typeConst.TEXTAREA:
            case typeConst.SELECT:
              if (isRequired) test = !funcs.isEmpty(value);

              break;
            case typeConst.NUMBER:
              if (isRequired || !funcs.isEmpty(value))
                test = !funcs.isEmpty(value) && !isNaN(value);

              break;
            case typeConst.EMAIL:
              if (isRequired || !funcs.isEmpty(value)) {
                //test = !funcs.isEmpty(value) && new RegExp(/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/)
                //		.test(value);

                // Use the same RegEx as the HTML5 email field. Per https://emailregex.com
                test =
                  !funcs.isEmpty(value) &&
                  new RegExp(
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                  ).test(value);
              }

              break;
            case typeConst.CHECKBOX:
              if (isRequired) test = $this.is(":checked");

              break;
            case typeConst.YES_NO:
            case typeConst.RADIO:
              if (isRequired)
                test =
                  $this.find('input[type="radio"]:checked').val() !== undefined;
              break;
            case typeConst.DATE:
              var num = 0,
                co = 0;

              $this.find("select").each(function () {
                num++;
                co += funcs.isEmpty($(this).val()) ? 0 : 1;
              });

              if (isRequired || co > 0) test = num == co;

              break;
          }

          if (test) {
            $this.siblings(".wpProQuiz_invalidate").hide();
          } else {
            check = false;
            $this.siblings(".wpProQuiz_invalidate").show();
          }
        });

        //				$('.wpProQuiz_forms input, .wpProQuiz_forms textarea').each(function() {
        //					var $this = $(this);
        //					var isRequired = $this.data('required') == 1;
        //					var validate = $this.data('validate') & 0xFF;
        //					var test = false;
        //					var $infos = $this.parents('div:eq(0)').find('.wpProQuiz_invalidate');
        //
        //					if(isRequired) {
        //						if($this.attr('type') == 'checkbox') {
        //							if($this.is(':checked'))
        //								test = true;
        //
        //						} else {
        //							if(!funcs.isEmpty($this.val()))
        //								test = true;
        //						}
        //
        //						if(!test) {
        //							check = false;
        //							$infos.eq(0).show();
        //						} else {
        //							$infos.eq(0).hide();
        //						}
        //					}
        //
        //					if(!funcs.testValidate($this.val(), validate)) {
        //						check = false;
        //						$infos.eq(1).show();
        //					} else {
        //						$infos.eq(1).hide();
        //					}
        //
        //				});

        //				if(!check)
        //					alert(WpProQuizGlobal.fieldsNotFilled);
        //
        return check;
      };

      this.getFormData = function () {
        var data = {};

        $e.find(
          ".wpProQuiz_forms input, .wpProQuiz_forms textarea, .wpProQuiz_forms .wpProQuiz_formFields, .wpProQuiz_forms select"
        ).each(function () {
          var $this = $(this);
          var id = $this.data("form_id");
          var type = $this.data("type");

          switch (type) {
            case typeConst.TEXT:
            case typeConst.TEXTAREA:
            case typeConst.SELECT:
            case typeConst.NUMBER:
            case typeConst.EMAIL:
              data[id] = $this.val();
              break;
            case typeConst.CHECKBOX:
              data[id] = $this.is(":checked") ? 1 : 0;
              break;
            case typeConst.YES_NO:
            case typeConst.RADIO:
              data[id] = $this.find('input[type="radio"]:checked').val();
              break;
            case typeConst.DATE:
              data[id] = {
                day: $this
                  .find('select[name="wpProQuiz_field_' + id + '_day"]')
                  .val(),
                month: $this
                  .find('select[name="wpProQuiz_field_' + id + '_month"]')
                  .val(),
                year: $this
                  .find('select[name="wpProQuiz_field_' + id + '_year"]')
                  .val()
              };
              break;
          }
        });

        return data;
      };
    })();

    var fetchAllAnswerData = function (resultData) {
      $e.find(".wpProQuiz_questionList").each(function ( index ) {
        var $this = $(this);
        var questionId = $this.data("question_id");
        var type = $this.data("type");
        var data = [];

        if (type == "single" || type == "multiple") {
          $this.find(".wpProQuiz_questionListItem").each(function () {
            data[$(this).attr("data-pos")] = +$(this)
              .find(".wpProQuiz_questionInput")
              .is(":checked");
          });
        } else if (type == "free_answer") {
          data[0] = $this.find(".wpProQuiz_questionInput").val();
        } else if (type == "sort_answer") {
          return true;
          //					$this.find('.wpProQuiz_questionListItem').each(function() {
          //						data[$(this).index()] = $(this).attr('data-pos');
          //					});
        } else if (type == "matrix_sort_answer") {
			
			/**
			 * TD-R2-09 - Fix AZ courses not showing statitstics
			 * Add review flag for drag and drop questions
			 */
			$reviewFlag = 0;
			if ( window.srflReviewedItems[index].review === true ) {
				$reviewFlag = 1;
			}

			resultData[questionId]["reviewFlag"] = $reviewFlag;
			
          return true;
          //					$this.find('.wpProQuiz_questionListItem').each(function() {
          //						data[$(this).attr('data-pos')] = $(this).find('.wpProQuiz_answerCorrect').length;
          //					});
        } else if (type == "cloze_answer") {
          var i = 0;
          $this.find(".wpProQuiz_cloze input").each(function () {
            data[i++] = $(this).val();
          });
        } else if (type == "assessment_answer") {
          data[0] = "";

          $this.find(".wpProQuiz_questionInput:checked").each(function () {
            data[$(this).data("index")] = $(this).val();
          });
        } else if (type == "essay") {
          return;
        } else if (type == "laq_jumbled_sentence") {
          var i = 0;
          $(this).find('.laq_jumbled_sentence_dropdown').each(function() {

            var option_index = $(this).data('id');

            var ld_adv_q_temp_data = {};

            ld_adv_q_temp_data.id = $(this).attr('id');
            ld_adv_q_temp_data.name = $(this).attr('name');
            ld_adv_q_temp_data.pts_each_usage = $(this).data('pts_for_each_usage');
            ld_adv_q_temp_data.option = $(this).val();
            ld_adv_q_temp_data.correct = $(this).siblings('#correct_options' + option_index).val();
            ld_adv_q_temp_data.pts = $(this).siblings('#correct_options' + option_index).next('#correct_points').val();

            data[i++] = ld_adv_q_temp_data;
          });
        } else if (type == "laq_swipe_questions") {

          var parent_ele = $(this);

          parent_ele.find('.laq_advanced_swipe_questions_main > input.laq_advanced_swipe_selection').each(function(index) {
              data[index] = {};
              data[index].selection = $(this).val();
              data[index].attempted = parent_ele.find('.laq_advanced_swipe_questions_main > input.laq_advanced_swipe_attempted:eq("'+ index +'")').val();
              data[index].correct = parent_ele.find('.laq_advanced_swipe_questions_main > input.laq_advanced_swipe_correct:eq("'+ index +'")').val();
              data[index].pts = parent_ele.find('.laq_advanced_swipe_questions_main > input.laq_advanced_swipe_points:eq("'+ index +'")').val();
          });
        } else if (type == "laq_calculated_formula") {

          var parent_ele = $(this);

          data[0] = {};
          data[0].selection = parent_ele.find('#laq_advanced_calculated_questions_main input.laq_advanced_calculated_selection').val();
          data[0].correct = parent_ele.find('#laq_advanced_calculated_questions_main input.laq_advanced_calculated_correct').val();
          data[0].pts = parent_ele.find('#laq_advanced_calculated_questions_main input.laq_advanced_calculated_points').val();
        } else if (type == "laq_hotspot_question") {
			
			let i = 0;

			$(this).find('.hotspot_question_row').each(function(){
				
				lq_hotspot_temp_data = {};
				
				$answer = $(this).find('.laq_hotspot_input:checked').val();

				if( typeof $answer == 'undefined') {
					$answer = '';
				}

				lq_hotspot_temp_data.id = $(this).attr('id');
				lq_hotspot_temp_data.name = "option_" + $(this).attr('id');
				lq_hotspot_temp_data.pts_each_usage = $(this).data('pts_for_each_usage');
				lq_hotspot_temp_data.option = $answer;			
				lq_hotspot_temp_data.correct = $(this).find(`#correct_option_${$(this).attr('id')}`).val();
				lq_hotspot_temp_data.pts = $(this).find(`#correct_points_${$(this).attr('id')}`).val();

				data[i++] = lq_hotspot_temp_data;

			});
			

		}

        resultData[questionId]["data"] = data;

        /**
         * Quiz Statistics - Marked for Review Filter
         * - Added by Wayne
         * Add logic to add reviewFlag to sendCompletedQuiz AJAX request
         * Use window.srflReviewedItems from Learndash Save & Resume plugin
         */

		$reviewFlag = 0;
		if ( window.srflReviewedItems[index].review === true ) {

			$reviewFlag = 1;
			
		}

		resultData[questionId]["reviewFlag"] = $reviewFlag;
                 
      });
    };

    plugin.methode = {
      /**
       * @memberOf plugin.methode
       */

      parseBitOptions: function () {
        if (config.bo) {
          bitOptions.randomAnswer = config.bo & (1 << 0);
          bitOptions.randomQuestion = config.bo & (1 << 1);
          bitOptions.disabledAnswerMark = config.bo & (1 << 2);
          bitOptions.checkBeforeStart = config.bo & (1 << 3);
          bitOptions.preview = config.bo & (1 << 4);
          bitOptions.isAddAutomatic = config.bo & (1 << 6);
          bitOptions.reviewQustion = config.bo & (1 << 7);
          bitOptions.quizSummeryHide = config.bo & (1 << 8);
          bitOptions.skipButton = config.bo & (1 << 9);
          bitOptions.autoStart = config.bo & (1 << 10);
          bitOptions.forcingQuestionSolve = config.bo & (1 << 11);
          bitOptions.hideQuestionPositionOverview = config.bo & (1 << 12);
          bitOptions.formActivated = config.bo & (1 << 13);
          bitOptions.maxShowQuestion = config.bo & (1 << 14);
          bitOptions.sortCategories = config.bo & (1 << 15);

          var cors = config.bo & (1 << 5);

          if (
            cors &&
            jQuery.support != undefined &&
            jQuery.support.cors != undefined &&
            jQuery.support.cors == false
          ) {
            bitOptions.cors = cors;
          }
        }
      },

      setClozeStyle: function () {
        $e.find(".wpProQuiz_cloze input").each(function () {
          var $this = $(this);
          var word = "";
          var wordLen = $this.data("wordlen");

          for (var i = 0; i < wordLen; i++) word += "w";

          var clone = $(document.createElement("span"))
            .css("visibility", "hidden")
            .text(word)
            .appendTo($("body"));

          var width = clone.width();

          clone.remove();

          $this.width(width + 5);
        });
      },

      parseTime: function (sec) {
        var seconds = parseInt(sec % 60);
        var minutes = parseInt((sec / 60) % 60);
        var hours = parseInt((sec / 3600) % 24);

        seconds = (seconds > 9 ? "" : "0") + seconds;
        minutes = (minutes > 9 ? "" : "0") + minutes;
        hours = (hours > 9 ? "" : "0") + hours;

        return hours + ":" + minutes + ":" + seconds;
      },

      cleanupCurlyQuotes: function (str) {
        str = str.replace(/\u2018/, "'");
        str = str.replace(/\u2019/, "'");

        str = str.replace(/\u201C/, '"');
        str = str.replace(/\u201D/, '"');

        //return $.trim(str).toLowerCase();

        // Changes in v2.5 to NOT set cloze answers to lowercase
        return $.trim(str);
      },

      resetMatrix: function (selector) {
        selector.each(function () {
          var $this = $(this);
          var $list = $this.find(".wpProQuiz_sortStringList");

          $this.find(".wpProQuiz_sortStringItem").each(function () {
            $list.append($(this));
          });
        });
      },

      marker: function (e, correct) {
        if (!bitOptions.disabledAnswerMark) {
          if (correct === true) {
            e.addClass("wpProQuiz_answerCorrect");
          } else if (correct === false) {
            e.addClass("wpProQuiz_answerIncorrect");
          } else {
            e.addClass(correct);
          }
        }
      },

      startQuiz: function (loadData) {
        //if (config.ld_script_debug == true) {
        //	console.log('in startQuiz');
        //}

        if (quizStatus.loadLock) {
          quizStatus.isQuizStart = 1;
          return;
        }

        quizStatus.isQuizStart = 0;

        if (quizStatus.isLocked) {
          globalElements.quizStartPage.hide();
          $e.find(".wpProQuiz_lock").show();

          return;
        }

        if (quizStatus.isPrerequisite) {
          globalElements.quizStartPage.hide();
          $e.find(".wpProQuiz_prerequisite").show();

          return;
        }

        if (quizStatus.isUserStartLocked) {
          globalElements.quizStartPage.hide();
          $e.find(".wpProQuiz_startOnlyRegisteredUser").show();

          return;
        }
        if (bitOptions.maxShowQuestion && !loadData) {
          if (config.formPos == formPosConst.START) {
            if (!formClass.checkForm()) return;
          }

          globalElements.quizStartPage.hide();
          $e.find(".wpProQuiz_loadQuiz").show();

          plugin.methode.loadQuizDataAjax(true);

          return;
        }

        if (bitOptions.formActivated && config.formPos == formPosConst.START) {
          if (!formClass.checkForm()) return;
        }

        plugin.methode.loadQuizData();

        if (bitOptions.randomQuestion) {
          plugin.methode.random(globalElements.questionList);
        }

        if (bitOptions.randomAnswer) {
          plugin.methode.random($e.find(globalNames.questionList));
        }

        if (bitOptions.sortCategories) {
          plugin.methode.sortCategories();
        }

        // randomize the matrix sort question items
        plugin.methode.random($e.find(".wpProQuiz_sortStringList"));

        // randomize the sort question answers
        plugin.methode.random(
          $e.find('.wpProQuiz_questionList[data-type="sort_answer"]')
        );

        $e.find(".wpProQuiz_listItem").each(function (i, v) {
          var $this = $(this);
          $this.find(".wpProQuiz_question_page span:eq(0)").text(i + 1);
          $this.find("> h5 span").text(i + 1);

          $this.find(".wpProQuiz_questionListItem").each(function (i, v) {
            $(this)
              .find("> span:not(.wpProQuiz_cloze)")
              .text(i + 1 + ". ");
          });
        });

        globalElements.next = $e.find(globalNames.next);

        switch (config.mode) {
          case 3:
            $e.find('input[name="checkSingle"]').show();
            break;
          case 2:
            $e.find(globalNames.check).show();

            if (!bitOptions.skipButton && bitOptions.reviewQustion)
              $e.find(globalNames.skip).show();

            break;
          case 1:
            $e.find('input[name="back"]')
              .slice(1)
              .show();
          case 0:
            globalElements.next.show();
            break;
        }

        if (bitOptions.hideQuestionPositionOverview || config.mode == 3)
          $e.find(".wpProQuiz_question_page").hide();

        //Change last name
        var $lastButton = globalElements.next.last();
        lastButtonValue = $lastButton.val();
        $lastButton.val(config.lbn);

        var $listItem = globalElements.questionList.children();

        globalElements.listItems = $e.find(".wpProQuiz_list > li");

        if (config.mode == 3) {
          plugin.methode.showSinglePage(0);
          //					if(config.qpp) {
          //						$listItem.slice(0, config.qpp).show();
          //						$e.find(globalNames.singlePageRight).show();
          //						$e.find('input[name="checkSingle"]').hide();
          //					} else {
          //						$listItem.show();
          //					}
        } else {
          currentQuestion = $listItem.eq(0).show();

          var questionId = currentQuestion
            .find(globalNames.questionList)
            .data("question_id");
          questionTimer.questionStart(questionId);
        }

        questionTimer.startQuiz();

        $e.find(".wpProQuiz_sortable")
          .parents("ul")
          .sortable({
            update: function (event, ui) {
              var $p = $(this).parents(".wpProQuiz_listItem");
              $e.trigger({
                type: "questionSolved",
                values: { item: $p, index: $p.index(), solved: true }
              });
            }
          })
          .disableSelection();

        $e.find(".wpProQuiz_sortStringList, .wpProQuiz_maxtrixSortCriterion")
          .sortable({
            connectWith:
              ".wpProQuiz_maxtrixSortCriterion:not(:has(li)), .wpProQuiz_sortStringList",
            placeholder: "wpProQuiz_placehold",
            update: function (event, ui) {
              var $p = $(this).parents(".wpProQuiz_listItem");

              $e.trigger({
                type: "questionSolved",
                values: { item: $p, index: $p.index(), solved: true }
              });
            }
          })
          .disableSelection();

        quizSolved = [];

        //section by webxity;
        //var differnt_limit = $("#ld_advanced_question_time_limit").val();

        //if (differnt_limit != "yes")  {
          timelimit.start();
        //} else if (!quiz_question_timer_enabled) {
          //timelimit.start();
        //}
        //End section by webxity;

        startTime = +new Date();

        results = { comp: { points: 0, correctQuestions: 0, quizTime: 0 } };

        $e.find(".wpProQuiz_questionList").each(function () { 
          var questionId = $(this).data("question_id");

          results[questionId] = { time: 0 };
        });

        catResults = {};

        $.each(options.catPoints, function (i, v) {
          catResults[i] = 0;
        });

        globalElements.quizStartPage.hide();
        $e.find(".wpProQuiz_loadQuiz").hide();

        // Init our Cookie
		plugin.methode.CookieInit();


		/**
		 * Add 3 second delay for review mode questions to load explanations.
		 */
		if (config.mode !== 2) {

			globalElements.quiz.show();
			reviewBox.show();

			plugin.methode.CookieSetResponses();
			/**
			 * Save & Resume Integration
			 * Return everything to normal for reviewQuestion Triggers
			 */
			initStatus = false;

			//$('li.wpProQuiz_listItem', globalElements.questionList).each( function (idx, questionItem) {
			plugin.methode.setupMatrixSortHeights();
			//});

			if (config.mode != 3) {
			$e.trigger({
				type: "changeQuestion",
				values: { item: currentQuestion, index: currentQuestion.index() }
			});
			}

			//plugin.methode.load_save_resume();
			$(".laq_advanced_swipe_attempted").val("no");
			myswipefunction();

		} else {

			plugin.methode.showSpinner();
			
			var showExplanations = setTimeout(function(){

				globalElements.quiz.show();
				reviewBox.show();

				plugin.methode.CookieSetResponses();

				/**
				 * Save & Resume Integration
				 * Return everything to normal for reviewQuestion Triggers
				 */
				initStatus = false;

				//$('li.wpProQuiz_listItem', globalElements.questionList).each( function (idx, questionItem) {
				plugin.methode.setupMatrixSortHeights();
				//});

				if (config.mode != 3) {
				$e.trigger({
					type: "changeQuestion",
					values: { item: currentQuestion, index: currentQuestion.index() }
				});
				}

				//plugin.methode.load_save_resume();
				$(".laq_advanced_swipe_attempted").val("no");
				myswipefunction();

			}, 1500);

		}

      },

      viewUserQuizStatistics: function (button) {
        //console.log('in viewUserQuizStatistics');

        var refId = jQuery(button).data("ref_id");
        //console.log('refId[%o]', refId);
        var quizId = jQuery(button).data("quiz_id");
        //console.log('quizId[%o]', quizId);

        var post_data = {
          action: "wp_pro_quiz_admin_ajax",
          func: "statisticLoadUser",
          data: {
            quizId: quizId,
            userId: 0,
            refId: refId,
            avg: 0
          }
        };

        jQuery("#wpProQuiz_user_overlay, #wpProQuiz_loadUserData").show();
        var content = jQuery("#wpProQuiz_user_content").hide();

        jQuery.ajax({
          type: "POST",
          url: WpProQuizGlobal.ajaxurl,
          dataType: "json",
          cache: false,
          data: post_data,
          error: function (jqXHR, textStatus, errorThrown) { },
          success: function (reply_data) {
            if (typeof reply_data.html !== "undefined") {
              content.html(reply_data.html);
              jQuery("#wpProQuiz_user_content").show();

              jQuery("#wpProQuiz_loadUserData").hide();

              content.find(".statistic_data").click(function () {
                jQuery(this)
                  .parents("tr")
                  .next()
                  .toggle("fast");

                return false;
              });
            }
          }
        });

        jQuery("#wpProQuiz_overlay_close").click(function () {
          jQuery("#wpProQuiz_user_overlay").hide();
        });
      },

      showSingleQuestion: function (question) {
        var page = question ? Math.ceil(question / config.qpp) : 1;

        this.showSinglePage(page);

        //				plugin.methode.scrollTo($element, 1);
      },

      showSinglePage: function (page) {
        $listItem = globalElements.questionList.children().hide();

        if (!config.qpp) {
          $listItem.show();

          return;
        }

        page = page ? +page : 1;

        var maxPage = Math.ceil(
          $e.find(".wpProQuiz_list > li").length / config.qpp
        );

        if (page > maxPage) return;

        var pl = $e.find(globalNames.singlePageLeft).hide();
        var pr = $e.find(globalNames.singlePageRight).hide();
        var cs = $e.find('input[name="checkSingle"]').hide();

        if (page > 1) {
          pl.val(pl.data("text").replace(/%d/, page - 1)).show();
        }

        if (page == maxPage) {
          cs.show();
        } else {
          pr.val(pr.data("text").replace(/%d/, page + 1)).show();
        }

        currentPage = page;

        var start = config.qpp * (page - 1);

        $listItem.slice(start, start + config.qpp).show();
        plugin.methode.scrollTo(globalElements.quiz);
      },

      nextQuestion: function () {
        plugin.methode.CookieProcessQuestionResponse(currentQuestion);
        jQuery(".mejs-pause").trigger("click");
        if (currentQuestion) this.showQuestionObject(currentQuestion.next());
		/**
		 * Save & Resume integration
		 * Remove save and resume execution here
		 */
        //plugin.methode.load_save_resume();

        // if (globalElements.save_as_next == "yes") {
        //   plugin.methode.saveQuestionClicked();
        // }
      },

      prevQuestion: function () {
        this.showQuestionObject(currentQuestion.prev());
		//myswipefunction( );
		/**
		 * Save & Resume integration
		 * Remove save and resume execution here
		*/
        //plugin.methode.load_save_resume();
      },

      showQuestion: function (index) {
        var $element = globalElements.listItems.eq(index);

        if (config.mode == 3 || inViewQuestions) {
          if (config.qpp) {
            plugin.methode.showSingleQuestion(index + 1);
			//questionTimer.startQuiz();
			//return;
          }
          //					plugin.methode.scrollTo($e.find('.wpProQuiz_list > li').eq(index), 1);
          plugin.methode.scrollTo($element, 1);
          questionTimer.startQuiz();
          return;
        }

        //				currentQuestion.hide();
        //
        //				currentQuestion = $element.show();
        //
        //				plugin.methode.scrollTo(globalElements.quiz);
        //
        //				$e.trigger({type: 'changeQuestion', values: {item: currentQuestion, index: currentQuestion.index()}});
        //
        //				if(!currentQuestion.length)
        //					plugin.methode.showQuizSummary();

        this.showQuestionObject($element);
      },

      showQuestionObject: function (obj) {
        if (
          !obj.length &&
          bitOptions.forcingQuestionSolve &&
          bitOptions.quizSummeryHide &&
          bitOptions.reviewQustion
        ) {
          // First get all the questions...
          list = globalElements.questionList.children();
          if (list != null) {
            list.each(function () {
              var $this = $(this);
              var $questionList = $this.find(globalNames.questionList);
              var question_id = $questionList.data("question_id");
              var data = config.json[$questionList.data("question_id")];

              // Within the following logic. If the question type is 'sort_answer' there is a chance
              // the sortable answers will be displayed in the correct order. In that case the user will click
              // the next button.
              // The trigger to set the question was answered is normally a function of the sort/drag action
              // by the user. So we need to set the question answered flag in the case the Quiz summary is enabled.
              if (data.type == "sort_answer") {
                $e.trigger({
                  type: "questionSolved",
                  values: { item: $this, index: $this.index(), solved: true }
                });
              }
            });
          }

          for (
            var i = 0, c = $e.find(".wpProQuiz_listItem").length;
            i < c;
            i++
          ) {
            if (!quizSolved[i]) {
              alert(WpProQuizGlobal.questionsNotSolved);
              return false;
            }
          }
        }

        currentQuestion.hide();

        currentQuestion = obj.show();

        plugin.methode.scrollTo(globalElements.quiz);

        $e.trigger({
          type: "changeQuestion",
          values: { item: currentQuestion, index: currentQuestion.index() }
        });

        if (!currentQuestion.length) {
          plugin.methode.showQuizSummary();
        } else {
          var questionId = currentQuestion
            .find(globalNames.questionList)
            .data("question_id");
          questionTimer.questionStart(questionId);
        }

        // if( not_started_yet )
        // 	myswipefunction();
      },

      skipQuestion: function () {
        $e.trigger({
          type: "skipQuestion",
          values: { item: currentQuestion, index: currentQuestion.index() }
        });

        plugin.methode.nextQuestion();
      },
      reviewQuestion: function () {
        $e.trigger({
          type: "reviewQuestion",
          values: { item: currentQuestion, index: currentQuestion.index() }
        });
      },

      uploadFile: function (event) {
        var question_id = event.currentTarget.id.replace(
          "uploadEssaySubmit_",
          ""
        );
        var file = $("#uploadEssay_" + question_id)[0].files[0];

        if (typeof file !== "undefined") {
          var nonce = $("#_uploadEssay_nonce_" + question_id).val();
          var uploadEssaySubmit = $("#uploadEssaySubmit_" + question_id);
          uploadEssaySubmit.val(config.essayUploading);

          var data = new FormData();
          data.append("action", "learndash_upload_essay");
          data.append("nonce", nonce);
          data.append("question_id", question_id);
          data.append("course_id", config.course_id);
          data.append("essayUpload", file);

          $.ajax({
            method: "POST",
            type: "POST",
            url: WpProQuizGlobal.ajaxurl,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
              if (
                response.success == true &&
                typeof response.data.filelink != "undefined"
              ) {
                $("#uploadEssayFile_" + question_id).val(
                  response.data.filelink
                );
                uploadEssaySubmit.attr("disabled", "disabled");
                setTimeout(function () {
                  uploadEssaySubmit.val(config.essaySuccess);
                }, 1500);

                var $item = $("#uploadEssayFile_" + question_id).parents(
                  ".wpProQuiz_listItem"
                );
                $e.trigger({
                  type: "questionSolved",
                  values: { item: $item, index: $item.index(), solved: true }
                });
              } else {
                uploadEssaySubmit.removeAttr("disabled");
                uploadEssaySubmit.val("Failed. Try again.");
              }
            }
          });
        }
        event.preventDefault();
      },

      showQuizSummary: function () {

        questionTimer.questionStop();
        questionTimer.stopQuiz();

        if (bitOptions.quizSummeryHide || !bitOptions.reviewQustion) {
          if (bitOptions.formActivated && config.formPos == formPosConst.END) {
            reviewBox.hide();
            globalElements.quiz.hide();
            plugin.methode.scrollTo($e.find(".wpProQuiz_infopage").show());
          } else {
            plugin.methode.finishQuiz();
          }

          return;
        }

        var quizSummary = $e.find(".wpProQuiz_checkPage");

        quizSummary
          .find("ol:eq(0)")
          .empty()
          .append(
            $e
              .find(".wpProQuiz_reviewQuestion ol li")
              .clone()
              .removeClass("wpProQuiz_reviewQuestionTarget")
          )
          .children()
          .click(function (e) {
            //RESPONSIBLE FOR GOING BACK TO THE QUESTIONS
            quizSummary.hide();
            globalElements.quiz.show();
            reviewBox.show(true);

            plugin.methode.showQuestion($(this).index());
          });

        var cSolved = 0;

        for (var i = 0, c = quizSolved.length; i < c; i++) {
          if (quizSolved[i]) {
            cSolved++;
          }
        }

        quizSummary.find("span:eq(0)").text(cSolved);

        reviewBox.hide();
        globalElements.quiz.hide();

        quizSummary.show();

        plugin.methode.scrollTo(quizSummary);

      },

      finishQuiz: function (timeover) {
        questionTimer.questionStop();
        questionTimer.stopQuiz(); 
        timelimit.stop();

        var time = (+new Date() - startTime) / 1000;
        time =
          config.timelimit && time > config.timelimit ? config.timelimit : time;
        timespent = time;
        $e.find(".wpProQuiz_quiz_time span").text(
          plugin.methode.parseTime(time)
        );

        if (timeover) {
          globalElements.results.find(".wpProQuiz_time_limit_expired").show();
        }

        plugin.methode.checkQuestion(
          globalElements.questionList.children(),
          true
        );
      },
      finishQuizEnd: function () {
		
		/**
		 * HOTSPOT QUESTION
		 * Remove this wooninja logic
		 */

		// if (config.mode == "2") {
        //   results.comp.points = 0;
        //   results.comp.correctQuestions = 0;
        //   config.globalPoints = 0;
        //   $.each(results, function (question_id, result) {
        //     if (question_id != "comp") {
        //       results.comp.points =
        //         results.comp.points + parseInt(result.points);
        //       if (result.correct == 1 || result.correct == "1") {
        //         results.comp.correctQuestions += 1;
        //       }

        //       config.globalPoints =
        //         config.globalPoints + parseInt(result.possiblePoints);
        //     }
        //   });
        // }

        $e.find(".wpProQuiz_correct_answer").text(
          results.comp.correctQuestions
        );

        results.comp.result =
          Math.round((results.comp.points / config.globalPoints) * 100 * 100) /
          100;

        var hasNotGradedQuestion = false;
        $.each(results, function () {
          if (
            typeof this.graded_status !== "undefined" &&
            this.graded_status == "not_graded"
          ) {
            hasNotGradedQuestion = true;
          }
        });

        if (
          typeof certificate_details !== "undefined" &&
          certificate_details.certificateLink != undefined &&
          certificate_details.certificateLink != "" &&
          results.comp.result >= certificate_details.certificate_threshold * 100
        ) {
          var certificateContainer = $e.find(".wpProQuiz_certificate");
          if (
            true == hasNotGradedQuestion &&
            typeof certificate_pending !== "undefined"
          ) {
            certificateContainer.html(certificate_pending);
          }
          certificateContainer.show();
        }

        var quiz_continue_link = $e.find(".quiz_continue_link");

        var show_quiz_continue_buttom_on_fail = false;
        if (
          jQuery(quiz_continue_link).hasClass(
            "show_quiz_continue_buttom_on_fail"
          )
        ) {
          show_quiz_continue_buttom_on_fail = true;
        }                                                                                                                                                                                                       

        if (
          typeof options.passingpercentage !== "undefined" &&
          parseFloat(options.passingpercentage) >= 0.0
        ) {                                                                                                                                                                                                                                                                                                                                                                 
          if (
            results.comp.result >= options.passingpercentage ||
            show_quiz_continue_buttom_on_fail
          ) {
            //For now, Just append the HTML to the page
            if (typeof continue_details !== "undefined") {
              $e.find(".quiz_continue_link").html(continue_details);
              $e.find(".quiz_continue_link").show();
            }
          } else {
            /*
            * Added by Wayne
            * bbupdatev2 new LD core update.                                                                                                                                                                                                                                                                                                                                                    
            */
            $e.removeClass( 'ld-quiz-result-passed' );
            $e.addClass( 'ld-quiz-result-failed' );

            $e.trigger( { type: 'learndash-quiz-finished', values: { status: 'failed', item: $e, results: results } } );
            $e.trigger( { type: 'learndash-quiz-finished-failed', values: { status: 'failed', item: $e, results: results } } );

            $e.find(".quiz_continue_link").hide();
          }
        } else {
          if (typeof continue_details !== "undefined") {
            $e.find(".quiz_continue_link").html(continue_details);
            $e.find(".quiz_continue_link").show();
          }
        }

        $pointFields = $e.find(".wpProQuiz_points span");
        $gradedPointsFields = $e.find(".wpProQuiz_graded_points span");

        $pointFields.eq(0).text(results.comp.points);
        $pointFields.eq(1).text(config.globalPoints);
        $pointFields.eq(2).text(results.comp.result + "%");

        $gradedQuestionCount = 0;
        $gradedQuestionPoints = 0;

        $.each(results, function (question_id, result) {
          if ($.isNumeric(question_id) && result.graded_id) {
            var possible = result.possiblePoints - result.points;
            if (possible > 0) {
              $gradedQuestionPoints += possible;
              $gradedQuestionCount++;
            }
          }
        });

        if ($gradedQuestionCount > 0) {
          $(".wpProQuiz_points").hide();
          $(".wpProQuiz_graded_points").show();
          $gradedPointsFields.eq(0).text(results.comp.points);
          $gradedPointsFields.eq(1).text(config.globalPoints);
          $gradedPointsFields.eq(2).text(results.comp.result + "%");
          $gradedPointsFields.eq(3).text($gradedQuestionCount);
          $gradedPointsFields.eq(4).text($gradedQuestionPoints);
        }

        $e.find(".wpProQuiz_resultsList > li")
          .eq(plugin.methode.findResultIndex(results.comp.result))
          .show();

        plugin.methode.setAverageResult(results.comp.result, false);

        this.setCategoryOverview();

        plugin.methode.sendCompletedQuiz();

        if (bitOptions.isAddAutomatic && toplistData.isUser) {
          plugin.methode.addToplist();
        }

        reviewBox.hide();

        $e.find(".wpProQuiz_checkPage, .wpProQuiz_infopage").hide();
        globalElements.quiz.hide();
      },
      sending: function (start, end, step_size) {
        globalElements.sending.show();
        var sending_progress_bar = globalElements.sending.find(
          ".sending_progress_bar"
        );
        var i;
        if (typeof start == undefined || start == null) {
          i =
            parseInt(
              (sending_progress_bar.width() * 100) /
              sending_progress_bar.offsetParent().width()
            ) + 156;
        } else i = start;

        if (end == undefined) var end = 80;

        if (step_size == undefined) step_size = 1;

        if (sending_timer != null && typeof sending_timer != undefined) {
          clearInterval(sending_timer);
        }
        sending_timer = setInterval(function () {
          var currentWidth = parseInt(
            (sending_progress_bar.width() * 100) /
            sending_progress_bar.offsetParent().width()
          );
          if (currentWidth >= end) {
            clearInterval(sending_timer);
            if (currentWidth >= 100) {
              setTimeout(plugin.methode.showResults(), 2000);
            }
          }
          sending_progress_bar.css("width", i + "%");
          i = i + step_size;
        }, 300);
      },
      showResults: function () {
        globalElements.sending.hide();
        globalElements.results.show();

        /* TD UPDATE - SHOW RESULTS AFTER QUIZ SUMBMISSION*/
        
        plugin.methode.showQustionList();
        
        /* ---------------------------------------------- */

        plugin.methode.scrollTo(globalElements.results);
      },
      setCategoryOverview: function () {
        results.comp.cats = {};

        $e.find(".wpProQuiz_catOverview li").each(function () {
          var $this = $(this);
          var catId = $this.data("category_id");

          if (config.catPoints[catId] === undefined) {
            $this.hide();
            return true;
          }

          var r =
            Math.round(
              (catResults[catId] / config.catPoints[catId]) * 100 * 100
            ) / 100;

          results.comp.cats[catId] = r;

          $this.find(".wpProQuiz_catPercent").text(r + "%");

          $this.show();
        });
      },

      questionSolved: function (e) {
        //if (config.ld_script_debug == true) {
        //	console.log('questionSolved: e.values[%o]', e.values);
        //}

        quizSolved[e.values.index] = e.values.solved;
      },

      sendCompletedQuiz: function () {
        if (bitOptions.preview) return;

		//console.log('sendCompletedQuiz: results[%o]', results);

		//DATA IS NOT IN CORRECT FORMAT BEFORE SEND
		
		//console.log(results);

		fetchAllAnswerData(results);

		//console.log(results);

    var formData = formClass.getFormData();

        jQuery
          .post(WpProQuizGlobal.ajaxurl, {
            action: "wp_pro_quiz_completed_quiz",
            course_id: config.course_id,
            lesson_id: config.lesson_id,
            topic_id: config.topic_id,
            quiz: config.quiz,
            quizId: config.quizId,
            results: JSON.stringify(results),
            timespent: timespent,
            forms: formData,
            quiz_nonce: config.quiz_nonce
          })
          .success(function (json) {
            plugin.methode.sending(null, 100, 15); //Complete the remaining progress bar faster and show results

            //code by webxity
            // console.log('hello');console.log(json);
            if (
              typeof json.total_quiz_correct !== "undefined" &&
              typeof json.total_quiz_questions !== "undefined"
            ) {
              $e.find(".wpProQuiz_correct_answer").text(
                json.total_quiz_correct
              );
              $e.find(".wpProQuiz_correct_answer")
                .next("span")
                .text(json.total_quiz_questions);

              $pointFields = $e.find(".wpProQuiz_points span");

              $pointFields.eq(0).text(json.points);
              $pointFields.eq(1).text(json.globalPoints);
              $pointFields.eq(2).text(json.result + "%");
            }
            //code by webxity end
            
            /** 
			 * TD-988: Ensure that the user has finished the quiz before deleting their progress
			 * This request will be sent when the user completes a quiz.
			 * The function that is being called handles the deletion of quiz progress for a user.
			 * The ld_delete_quiz_progress() function is implemented to sfwd-lms/includes/quiz/ld-quiz-pro.php
			 * **/
			jQuery
			  .post(WpProQuizGlobal.ajaxurl, {
				action: "wp_pro_quiz_completed_quiz",
				func: "ld_delete_quiz_progress",
				course_id: config.course_id,
				lesson_id: config.lesson_id,
				topic_id: config.topic_id,
				quiz: config.quiz,
				quizId: config.quizId,
				forms: formData,
				quiz_nonce: config.quiz_nonce
			  })

            // Clear Cookie on restart
            plugin.methode.CookieDelete();
          });
      },

      afterSendUpdateIU: function (quiz_result_settings) {
        if (typeof quiz_result_settings["showAverageResult"] !== "undefined") {
          if (!quiz_result_settings["showAverageResult"]) {
            $e.find(".wpProQuiz_resultTable").remove();
          }
        }

        if (typeof quiz_result_settings["showCategoryScore"] !== "undefined") {
          if (!quiz_result_settings["showCategoryScore"]) {
            $e.find(".wpProQuiz_catOverview").remove();
          }
        }

        if (
          typeof quiz_result_settings["showRestartQuizButton"] !== "undefined"
        ) {
          if (!quiz_result_settings["showRestartQuizButton"]) {
            $e.find('input[name="restartQuiz"]').remove();
          }
        }

        if (typeof quiz_result_settings["showResultPoints"] !== "undefined") {
          if (!quiz_result_settings["showResultPoints"]) {
            $e.find(".wpProQuiz_points").remove();
          }
        }

        if (typeof quiz_result_settings["showResultQuizTime"] !== "undefined") {
          if (!quiz_result_settings["showResultQuizTime"]) {
            $e.find(".wpProQuiz_quiz_time").remove();
          }
        }

        if (
          typeof quiz_result_settings["showViewQuestionButton"] !== "undefined"
        ) {
          if (!quiz_result_settings["showViewQuestionButton"]) {
            // remove filter if View Question Button is disabled;
            $e.find('select[name="filterQuestion"]').remove();
          }
        }

        if (typeof quiz_result_settings["showContinueButton"] !== "undefined") {
          if (!quiz_result_settings["showContinueButton"]) {
            $e.find(".quiz_continue_link").remove();
          }
        }
      },
      findResultIndex: function (p) {
        var r = config.resultsGrade;
        var index = -1;
        var diff = 999999;

        for (var i = 0; i < r.length; i++) {
          var v = r[i];

          if (p >= v && p - v < diff) {
            diff = p - v;
            index = i;
          }
        }

        return index;
      },

      showQustionList: function () {
        inViewQuestions = !inViewQuestions;
        globalElements.toplistShowInButton.hide();
        globalElements.quiz.toggle();
        $e.find(".wpProQuiz_QuestionButton").hide();
        globalElements.questionList.children().show();
        reviewBox.toggle();

        //Added by Webxity
        // $e.find(".ld_advance_quiz_resume").hide();
        // $e.find(".ld_advance_quiz_save").hide();
        $(".laq_advanced_swipe_questions_slides_wrapper").css(
          "display",
          "none"
        );
        $(".swipe_question_note").css("display", "none");
        $(".laq_advanced_swipe_questions_slides_backup").css(
          "display",
          "block"
        );
        $(".laq_advanced_swipe_questions_slides_backup .card_parent").each(
          function (index) {
            var parent_node = $(this)
              .parent()
              .parent();
            var idex = $(this).data("id");
            idex = parseInt(idex) - 1;
            var correct = parent_node
              .find("#laq_advanced_swipe_correct" + idex)
              .val();
            var selection = parent_node
              .find("#laq_advanced_swipe_selection" + idex)
              .val();
            var attempted = parent_node
              .find("#laq_advanced_swipe_attempted" + idex)
              .val();
            if (attempted == "yes") {
              if (correct == selection) {
                $(this)
                  .addClass("wpProQuiz_answerCorrect")
                  .css("margin", "5px");
              } else {
                $(this)
                  .addClass("wpProQuiz_answerIncorrect")
                  .css("margin", "5px");
              }
            }
          }
        );
        $(".card_calculation").each(function (index) {
          var correct = $(this)
            .find("#laq_advanced_calculated_correct")
            .val();
          var selection = $(this)
            .find("#laq_advanced_calculated_selection")
            .val();
          if (correct == selection) {
            $(this)
              .addClass("wpProQuiz_answerCorrect")
              .css("margin", "5px");
          } else {
            $(this)
              .addClass("wpProQuiz_answerIncorrect")
              .css("margin", "5px");
          }
        });
        $(".laq_jumbled_sentence_question select").each(function (index) {
          var parent_node = $(this).parents(".laq_jumbled_sentence_question");
          var idx = $(this).data("id");
          var correct = parent_node.find("#correct_options" + idx).val();
          var selection = $(this).val();

          if (correct == selection) {
            $(this)
              .addClass("wpProQuiz_answerCorrect")
              .css("margin", "5px");
          } else {
            $(this)
              .addClass("wpProQuiz_answerIncorrect")
              .css("margin", "5px");
          }
        });
		//End Added by Webxity
		
		/**
		 * Hotspot Question
		 * ADD LOGIC HERE TO SHOW HOTSPOT RESULTS
		 */

		$('.hotspot_question_row').each(function() {
				
			let hotspot_answer = $(this).find(".laq_hotspot_input:checked").val();
			let hotspot_correct = $(this).find(".correct_options").val();

			if(hotspot_answer !== hotspot_correct) {
				$(this).addClass("wpProQuiz_answerIncorrect");
			} else {
				$(this).addClass("wpProQuiz_answerCorrect");
			}

		});

        $e.find(".wpProQuiz_question_page").hide();
      },

      random: function (group) {
        group.each(function () {
          var e = $(this)
            .children()
            .get()
            .sort(function () {
              return Math.round(Math.random()) - 0.5;
            });
          if (e) {
            if (e[0]) {
              $(e).appendTo(e[0].parentNode);
            }
          }
        });
      },

      sortCategories: function () {
        var e = $(".wpProQuiz_list")
          .children()
          .get()
          .sort(function (a, b) {
            var aQuestionId = $(a)
              .find(".wpProQuiz_questionList")
              .data("question_id");
            var bQuestionId = $(b)
              .find(".wpProQuiz_questionList")
              .data("question_id");

            return (
              config.json[aQuestionId].catId - config.json[bQuestionId].catId
            );
          });

        if (e) {
          if (e[0]) {
            $(e).appendTo(e[0].parentNode);
          }
        }
      },

      restartQuiz: function () {
        globalElements.results.hide();
        //globalElements.quizStartPage.show();
        globalElements.questionList.children().hide();
        globalElements.toplistShowInButton.hide();
        reviewBox.hide();

        $e.find(".wpProQuiz_questionInput, .wpProQuiz_cloze input")
          .removeAttr("disabled")
          .removeAttr("checked")
          .css("background-color", "");

        // Reset all the question types to empty values. This really should be moved into a reset function to be called at other times like at Quiz Init.
        //				$e.find('.wpProQuiz_cloze input').val('');
        $e.find('.wpProQuiz_questionListItem input[type="text"]').val("");

        $e.find(
          ".wpProQuiz_answerCorrect, .wpProQuiz_answerIncorrect"
        ).removeClass("wpProQuiz_answerCorrect wpProQuiz_answerIncorrect");

        $e.find(".wpProQuiz_listItem").data("check", false);
        $e.find("textarea.wpProQuiz_questionEssay").val("");
        $e.find("input.uploadEssayFile").val("");
        $e.find("input.wpProQuiz_upload_essay").val("");

        $e.find(".wpProQuiz_response")
          .hide()
          .children()
          .hide();

        plugin.methode.resetMatrix($e.find(".wpProQuiz_listItem"));

        $e.find(".wpProQuiz_sortStringItem, .wpProQuiz_sortable").removeAttr(
          "style"
        );

        $e.find(
          ".wpProQuiz_clozeCorrect, .wpProQuiz_QuestionButton, .wpProQuiz_resultsList > li"
        ).hide();

        $e.find('.wpProQuiz_question_page, input[name="tip"]').show();

        $e.find(".wpProQuiz_certificate").attr(
          "style",
          "display: none !important"
        );

        globalElements.results.find(".wpProQuiz_time_limit_expired").hide();

        globalElements.next.last().val(lastButtonValue);

        inViewQuestions = false;

        // Clear Cookie on restart
        //plugin.methode.CookieDelete();
		
		/** 
		 * Save & Resume integration
		 * Remove wooninja save if quiz is restarted
		*/ 
		//plugin.methode.load_save_resume();
		
		// LEARNDASH-3201 - Added reload to force check on Quiz Repeats / Run Once logic.
		window.location.reload(true);
      },
      showSpinner: function () {
        $e.find(".wpProQuiz_spinner").show();
      },
      hideSpinner: function () {
        $e.find(".wpProQuiz_spinner").hide();
      },
      checkQuestion: function (list, endCheck) {
        var finishQuiz = list == undefined ? false : true;
        var responses = {};
        var r = {};

        // if(list == undefined && config.mode == 2 && is_quiz_resume_in_process == 'yes') {
        //     return;
        // }

        list = list == undefined ? currentQuestion : list;

        list.each(function () {
          var $this = $(this);
          var question_index = $this.index();
          var $questionList = $this.find(globalNames.questionList);
          var question_id = $questionList.data("question_id");
          var data = config.json[$questionList.data("question_id")];
		  var name = data.type;
		  /**
		   * Save & Resume Integration
		   * Remove resume question
		   */
        //   var resumedQuestion = resumedQuestions[question_id];

        //   if(config.mode == 2 && is_quiz_resume_in_process == 'yes') {

        //       if( !checkedQuestions.includes(question_id) ) {
        //           return true;
        //       } else if(data.type == 'laq_swipe_questions') {
        //           let is_attempted = false;

        //           $.each(resumedQuestion.response, function (index, response) {
        //               if (response.attempted == 'yes') {
        //                   is_attempted = true;
        //                   return;
        //               }
        //           });

        //           if (!is_attempted) {
        //               return true;
        //           }
        //       } else if(data.type == 'laq_calculated_formula') {
        //           return true;
        //       }
        //   }

          questionTimer.questionStop();

          if ($this.data("check")) {
            return true;
          }

          if (data.type == "single" || data.type == "multiple") {
            name = "singleMulti";
          }
          //if (config.ld_script_debug == true) {
          //	console.log('checkQuestion: calling readResponses');
          //}

          responses[question_id] = readResponses(
            name,
            data,
            $this,
            $questionList,
            true
          );
          responses[question_id]["question_pro_id"] = data["id"];
          responses[question_id]["question_post_id"] = data["question_post_id"];

          plugin.methode.CookieSaveResponse(
            question_id,
            question_index,
            data.type,
            responses[question_id]
          );
        });

        config.checkAnswers = {
          list: list,
          responses: responses,
          endCheck: endCheck,
          finishQuiz: finishQuiz
        };

        // if(config.mode == 2 && is_quiz_resume_in_process == 'yes') {
        //     finishQuiz = false;
        // }

        if (finishQuiz) {
          plugin.methode.sending(1, 80, 3);
        } else {
          plugin.methode.showSpinner();
		}
		
		//console.log(responses);

        plugin.methode.ajax(
          {
            action: "ld_advance_adv_quiz_pro_ajax", //changed for advance addon
            func: "checkAnswers",
            data: {
              quizId: config.quizId,
              quiz: config.quiz,
              course_id: config.course_id,
              quiz_nonce: config.quiz_nonce,
              responses: JSON.stringify(responses)
            }
          },
          function (json) {

			//console.log(json);

            plugin.methode.hideSpinner();
            var list = config.checkAnswers.list;

            var responses = config.checkAnswers.responses;
            var r = config.checkAnswers.r;
            var endCheck = config.checkAnswers.endCheck;
            var finishQuiz = config.checkAnswers.finishQuiz;

            // if(config.mode == 2 && is_quiz_resume_in_process == 'yes') {
            //     finishQuiz = false;
            // }

            list.each(function () {
              var $this = $(this);
              var $questionList = $this.find(globalNames.questionList);
              var question_id = $questionList.data("question_id");
              //var data = {id: question_id};

			  /**
			   * Save & Resume integration
			   * Remove checkedQuestions flag
			   */
            //   if(config.mode == 2) {
            //     if(is_quiz_resume_in_process == 'yes') {
            //         if(!checkedQuestions.includes(question_id)) {
            //             return true;
            //         }
            //     } else {
            //         if(!checkedQuestions.includes(question_id)) {
            //             checkedQuestions.push(question_id);
            //         }
            //     }
            //   }

              if ($this.data("check")) {
                return true; 
              }

              if (typeof json[question_id] !== "undefined") {
                var result = json[question_id];

                data = config.json[$questionList.data("question_id")];

                $this.find(".wpProQuiz_response").show();
                $this.find(globalNames.check).hide();
                $this.find(globalNames.skip).hide();
                $this.find(globalNames.next).show();

                results[data.id].points = result.p;
                if (typeof result.p_nonce !== "undefined")
                  results[data.id].p_nonce = result.p_nonce;
                else results[data.id].p_nonce = "";

                results[data.id].correct = Number(result.c);
                results[data.id].data = result.s;
                if (typeof result.a_nonce !== "undefined")
                  results[data.id].a_nonce = result.a_nonce;
                else results[data.id].a_nonce = "";
                results[data.id].possiblePoints = result.e.possiblePoints;

                // If the sort_answer or matrix_sort_answer question type is not 100% correct then the returned
                // result.s object will be empty. So in order to pass the user's answers to the server for the
                // sendCompletedQuiz AJAX call we need to grab the result.e.r object and store into results.
                if (jQuery.isEmptyObject(results[data.id].data)) {
                  if (
                    result.e.type != undefined &&
                    (result.e.type == "sort_answer" ||
                      result.e.type == "matrix_sort_answer")
                  ) {
                    results[data.id].data = result.e.r;
                  }
                }

                if (
                  typeof result.e.graded_id !== "undefined" &&
                  result.e.graded_id > 0
                ) {
                  results[data.id].graded_id = result.e.graded_id;
                }

                if (typeof result.e.graded_status !== "undefined") {
                  results[data.id].graded_status = result.e.graded_status;
                }

                results["comp"].points += result.p;

                $this.find(".wpProQuiz_response").show();
                $this.find(globalNames.check).hide();
                $this.find(globalNames.skip).hide();
                $this.find(globalNames.next).show();

                //results[data.id].points = result.p;
                //results[data.id].correct = Number(result.c);
                //results[data.id].data = result.s;

                // If the sort_answer or matrix_sort_answer question type is not 100% correct then the returned
                // result.s object will be empty. So in order to pass the user's answers to the server for the
                // sendCompletedQuiz AJAX call we need to grab the result.e.r object and store into results.
                if (jQuery.isEmptyObject(results[data.id].data)) {
                  if (typeof result.e.type !== "undefined") {
                    if (
                      result.e.type == "sort_answer" ||
                      result.e.type == "matrix_sort_answer"
                    ) {
                      if (typeof result.e.r !== "undefined") {
                        results[data.id].data = result.e.r;
                      }
                    }

                    if (result.e.type == "essay") {
                      if (typeof result.e.graded_id !== "undefined") {
                        results[data.id].data = {
                          graded_id: result.e.graded_id
                        };
                      }
                    }
                  }
                }

                //results['comp'].points += result.p;

                catResults[data.catId] += result.p;

                //Marker
                plugin.methode.markCorrectIncorrect(
                  result,
                  $this,
                  $questionList
                );

                if (result.c) {
                  if (typeof result.e.AnswerMessage !== "undefined") {
                    $this
                      .find(".wpProQuiz_correct")
                      .find(".wpProQuiz_AnswerMessage")
                      .html(result.e.AnswerMessage);
                    $this
                      .find(".wpProQuiz_correct")
                      .trigger("learndash-quiz-answer-response-contentchanged");
                  }
                  $this.find(".wpProQuiz_correct").show();
                  results["comp"].correctQuestions += 1;
                } else {
                  if (typeof result.e.AnswerMessage !== "undefined") {
                    $this
                      .find(".wpProQuiz_incorrect")
                      .find(".wpProQuiz_AnswerMessage")
                      .html(result.e.AnswerMessage);
                    $this
                      .find(".wpProQuiz_incorrect")
                      .trigger("learndash-quiz-answer-response-contentchanged");
                  }
                  $this.find(".wpProQuiz_incorrect").show();
                }

                $this.find(".wpProQuiz_responsePoints").text(result.p);

                $this.data("check", true);

                if (!endCheck)
                  $e.trigger({
                    type: "questionSolved",
                    values: { item: $this, index: $this.index(), solved: true }
                  });
              }
            });

            //Added by abbas
            // results["comp"].points = 0;
            // results["comp"].result = 0;
            // results["comp"].correctQuestions = 0;
            // //config.globalPoints = json.globalPoints;possiblePoints
            // $possiblePoints = 0;
            // $.each(json, function (question_id, result) {

			// /**
			//  * Save and Resume Integration
			//  * Remove checked Questions integration
			//  */
            // //   if(checkedQuestions.includes(question_id) && config.mode == 2 && is_quiz_resume_in_process == 'yes') {
            // //       return true;
            // //   }

            //   if (results[question_id] == null) {
            //     results[question_id] = {};
            //   }
            //   if (results["comp"] == null) {
            //     results["comp"] = {};
            //   }

            //   results[question_id].points = result.p;
            //   if (typeof result.p_nonce !== "undefined")
            //     results[question_id].p_nonce = result.p_nonce;
            //   else results[question_id].p_nonce = "";

            //   results[question_id].correct = Number(result.c);
            //   results[question_id].data = result.s;
            //   if (typeof result.a_nonce !== "undefined")
            //     results[question_id].a_nonce = result.a_nonce;
            //   else results[question_id].a_nonce = "";
            //   results[question_id].possiblePoints = result.e.possiblePoints;
            //   $possiblePoints += result.e.possiblePoints;

            //   if (jQuery.isEmptyObject(results[question_id].data)) {
            //     if (
            //       result.e.type != undefined &&
            //       (result.e.type == "sort_answer" ||
            //         result.e.type == "matrix_sort_answer")
            //     ) {
            //       results[question_id].data = result.e.r;
            //     }
            //   }

            //   if (
            //     typeof result.e.graded_id !== "undefined" &&
            //     result.e.graded_id > 0
            //   ) {
            //     results[question_id].graded_id = result.e.graded_id;
            //   }

            //   if (typeof result.e.graded_status !== "undefined") {
            //     results[question_id].graded_status = result.e.graded_status;
            //   }

            //   results["comp"].points += result.p;
            //   if (result.c && result.o == "no") {
            //     results["comp"].correctQuestions += 1;
            //   }

            //   if (jQuery.isEmptyObject(results[question_id].data)) {
            //     if (typeof result.e.type !== "undefined") {
            //       if (
            //         result.e.type == "sort_answer" ||
            //         result.e.type == "matrix_sort_answer"
            //       ) {
            //         if (typeof result.e.r !== "undefined") {
            //           results[question_id].data = result.e.r;
            //         }
            //       }

            //       if (result.e.type == "essay") {
            //         if (typeof result.e.graded_id !== "undefined") {
            //           results[question_id].data = {
            //             graded_id: result.e.graded_id
            //           };
            //         }
            //       }
            //     }
            //   }
            // });

            // config.globalPoints = $possiblePoints;

            //Added by abbas
            // Set a default just in case.
            //results.comp.p_nonce = '';

            //if ( typeof json['comp'] !== 'undefined' ) {
            //	if ( ( typeof json['comp']['p'] !== 'undefined' ) && ( typeof json['comp']['p_nonce'] !== 'undefined' ) ) {
            //		results.comp.points = json['comp']['p'];
            //		results.comp.p_nonce = json['comp']['p_nonce'];
            //	}
            //}

            // if(config.mode == 2 && is_quiz_resume_in_process == 'yes') {
            //     is_quiz_resume_in_process = "no";
            // }

            if (finishQuiz) plugin.methode.finishQuizEnd();

          }
        );
      },

      markCorrectIncorrect: function (result, $question, $questionList) {
        if (typeof result.e.c == "undefined") return;

        switch (result.e.type) {
          case "single":
          case "multiple":
            $questionList.children().each(function (i) {
              var $item = $(this);
              var index = $item.attr("data-pos");
              //					var checked = input.eq(i).is(':checked');

              if (result.e.c[index]) {
                var checked = $("input.wpProQuiz_questionInput", $item).is(
                  ":checked"
                );
                if (checked) {
                  plugin.methode.marker($item, true);
                } else {
                  plugin.methode.marker(
                    $item,
                    "wpProQuiz_answerCorrectIncomplete"
                  );
                }
              } else {
                if (!result.c && result.e.r[index])
                  plugin.methode.marker($item, false);
              }
            });
            break;
          case "free_answer":
            var $li = $questionList.children();
            if (result.c) plugin.methode.marker($li, true);
            else plugin.methode.marker($li, false);
            break;

          case "cloze_answer":
            $questionList.find(".wpProQuiz_cloze").each(function (i, v) {
              var $this = $(this);
              var cloze = $this.children();
              var input = cloze.eq(0);
              var span = cloze.eq(1);
              var inputText = plugin.methode.cleanupCurlyQuotes(input.val());

              if (result.s[i]) {
                //input.css('background-color', '#B0DAB0');
                input.addClass("wpProQuiz_answerCorrect");
              } else {
                input.addClass("wpProQuiz_answerIncorrect");
                //input.css('background-color', '#FFBABA');

                if (typeof result.e.c[i] != "undefined") {
                  span.html("(" + result.e.c[i].join() + ")");
                  span.show();
                }
              }
              input.attr("disabled", "disabled");
            });
            break;
          case "sort_answer":
            var $items = $questionList.children();

            $items.each(function (i, v) {
              var $this = $(this);

              if (result.e.c[i] == $this.attr("data-pos")) {
                plugin.methode.marker($this, true);
              } else {
                plugin.methode.marker($this, false);
              }
            });

            $items.children().css({ "box-shadow": "0 0", cursor: "auto" });

            //						$questionList.sortable("destroy");

            var index = new Array();
            jQuery.each(result.e.c, function (i, v) {
              index[v] = i;
            });
            $items.sort(function (a, b) {
              return index[$(a).attr("data-pos")] > index[$(b).attr("data-pos")]
                ? 1
                : -1;
            });

            $questionList.append($items);
            break;
          case "laq_jumbled_sentence":
            $questionList
              .find(".laq_jumbled_sentence_dropdown")
              .each(function (index) {
                var correct = $questionList
                  .find(".laq_jumbled_sentence_correct")
                  .eq(index)
                  .val();
                var curr_val = $(this).val();
                $questionList
                  .find(".laq_jumbled_sentence_correct_ans")
                  .eq(index)
                  .html(
                    "<span " +
                    (correct == curr_val ? 'style="display: none;"' : "") +
                    ' class="wpProQuiz_clozeCorrect" style="color:green">(' +
                    correct +
                    ")</span>"
                  );
                if (correct == curr_val) {
                  $(this).addClass("wpProQuiz_answerCorrect");
                } else {
                  $(this).addClass("wpProQuiz_answerIncorrect");
                }
              });

            break;
          case "laq_swipe_questions":
            $questionList
              .find(".laq_advanced_swipe_questions_slides_wrapper")
              .css("display", "none");
            $questionList.find(".swipe_question_note").css("display", "none");
            $questionList
              .find(".laq_advanced_swipe_questions_slides_backup")
              .css("display", "block");
            $questionList
              .find(".laq_advanced_swipe_questions_slides_backup .card_parent")
              .each(function (index) {
                var parent_node = $(this)
                  .parent()
                  .parent();
                var idex = $(this).data("id");
                idex = parseInt(idex) - 1;
                var correct = parent_node
                  .find("#laq_advanced_swipe_correct" + idex)
                  .val();
                var selection = parent_node
                  .find("#laq_advanced_swipe_selection" + idex)
                  .val();
                var attempted = parent_node
                  .find("#laq_advanced_swipe_attempted" + idex)
                  .val();
                if (attempted == "yes") {
                  if (correct == selection) {
                    $(this)
                      .addClass("wpProQuiz_answerCorrect")
                      .css("margin", "5px");
                  } else {
                    $(this)
                      .addClass("wpProQuiz_answerIncorrect")
                      .css("margin", "5px");
                  }
                }
              });
            break;
          case "laq_calculated_formula":
            $questionList.find(".card_calculation").each(function (index) {
              var correct = $(this)
                .find("#laq_advanced_calculated_correct")
                .val();
              var selection = $(this)
                .find("#laq_advanced_calculated_selection")
                .val();
              if (correct == selection) {
                $(this)
                  .find("#laq_advanced_calculated_selection")
                  .addClass("wpProQuiz_answerCorrect");
              } else {
                $(this)
                  .find("#laq_advanced_calculated_selection")
                  .addClass("wpProQuiz_answerIncorrect");
              }
              $(this)
                .find("#laq_advanced_calculated_selection")
                .parent()
                .append(
                  '<span class="wpProQuiz_clozeCorrect" style="color:green">(' +
                  correct +
                  ")</span>"
                );
            });
            break;
          case "matrix_sort_answer":
            var $items = $questionList.children();
            var matrix = new Array();
            statistcAnswerData = { 0: -1 };

            $items.each(function () {
              var $this = $(this);
              var id = $this.attr("data-pos");
              var $stringUl = $this.find(".wpProQuiz_maxtrixSortCriterion");
              var $stringItem = $stringUl.children();
              var i = $stringItem.attr("data-pos");

              if (
                $stringItem.length &&
                result.e.c[i] == $this.attr("data-pos")
              ) {
                plugin.methode.marker($this, true);
              } else {
                plugin.methode.marker($this, false);
              }

              matrix[i] = $stringUl;
            });

            plugin.methode.resetMatrix($question);

            $question
              .find(".wpProQuiz_sortStringItem")
              .each(function () {
                var x = matrix[$(this).attr("data-pos")];
                if (x != undefined) x.append(this);
              })
              .css({ "box-shadow": "0 0", cursor: "auto" });

            //	$question.find('.wpProQuiz_sortStringList, .wpProQuiz_maxtrixSortCriterion').sortable("destroy");
			break;
		  case "laq_hotspot_question":
		
			$questionList.find('.hotspot_question_row').each(function() {
				
				let hotspot_answer = $(this).find(".laq_hotspot_input:checked").val();
				let hotspot_correct = $(this).find(".correct_options").val();

				if(hotspot_answer !== hotspot_correct) {
					$(this).addClass("wpProQuiz_answerIncorrect");
				} else {
					$(this).addClass("wpProQuiz_answerCorrect");
				}

			});

		  break;
        }
      },
      showTip: function () {
        var $this = $(this);
        var id = $this
          .siblings(".wpProQuiz_question")
          .find(globalNames.questionList)
          .data("question_id");

        $this.siblings(".wpProQuiz_tipp").toggle("fast");

        results[id].tip = 1;

        $(document).bind("mouseup.tipEvent", function (e) {
          var $tip = $e.find(".wpProQuiz_tipp");
          var $btn = $e.find('input[name="tip"]');

          if (
            !$tip.is(e.target) &&
            $tip.has(e.target).length == 0 &&
            !$btn.is(e.target)
          ) {
            $tip.hide("fast");
            $(document).unbind(".tipEvent");
          }
        });
      },

      ajax: function (data, success, dataType) {
        dataType = dataType || "json";

        if (bitOptions.cors) {
          jQuery.support.cors = true;
        }

        if (data["quiz"] === undefined) {
          data["quiz"] = config.quiz;
        }
        if (data["course_id"] === undefined) {
          data["course_id"] = config.course_id;
        }
        if (data["quiz_nonce"] === undefined) {
          data["quiz_nonce"] = config.quiz_nonce;
        }
        //console.log('in ajax');
        //console.log('data[%o]', data);
        $.ajax({
          method: "POST",
          type: "POST",
          url: WpProQuizGlobal.ajaxurl,
          data: data,
          success: success,
          dataType: dataType
        });

        if (bitOptions.cors) {
          jQuery.support.cors = false;
        }
      },

      checkQuizLock: function () {
        quizStatus.loadLock = 1;

        plugin.methode.ajax(
          {
            action: "wp_pro_quiz_check_lock",
            quizId: config.quizId
          },
          function (json) {
            if (json.lock != undefined) {
              quizStatus.isLocked = json.lock.is;

              /* Added by Wayne
               * bbupdatev2 - Removed restart quiz logic
              */
              /*if (json.lock.pre) {
               *&$e.find('input[name="restartQuiz"]').hide();
              }*/
            }

            if (json.prerequisite != undefined) {
              quizStatus.isPrerequisite = 1;
              $e.find(".wpProQuiz_prerequisite span").text(json.prerequisite);
            }

            if (json.startUserLock != undefined) {
              quizStatus.isUserStartLocked = json.startUserLock;
            }

            quizStatus.loadLock = 0;

            if (quizStatus.isQuizStart) {
              plugin.methode.startQuiz();
            }
          }
        );
      },

      loadQuizData: function () {
        plugin.methode.ajax(
          {
            action: "wp_pro_quiz_load_quiz_data",
            quizId: config.quizId
          },
          function (json) {
            if (json.toplist) {
              plugin.methode.handleToplistData(json.toplist);
            }

            if (json.averageResult != undefined) {
              plugin.methode.setAverageResult(json.averageResult, true);
            }
          }
        );
      },

      setAverageResult: function (p, g) {
        var v = $e.find(".wpProQuiz_resultValue:eq(" + (g ? 0 : 1) + ") > * ");

        v.eq(1).text(p + "%");
        v.eq(0).css("width", (240 * p) / 100 + "px");
      },

      handleToplistData: function (json) {
        var $tp = $e.find(".wpProQuiz_addToplist");
        var $addBox = $tp
          .find(".wpProQuiz_addBox")
          .show()
          .children("div");

        if (json.canAdd) {
          $tp.show();
          $tp.find(".wpProQuiz_addToplistMessage").hide();
          $tp.find(".wpProQuiz_toplistButton").show();

          toplistData.token = json.token;
          toplistData.isUser = 0;

          if (json.userId) {
            $addBox.hide();
            toplistData.isUser = 1;

            if (bitOptions.isAddAutomatic) {
              $tp.hide();
            }
          } else {
            $addBox.show();

            var $captcha = $addBox.children().eq(1);

            if (json.captcha) {
              $captcha
                .find('input[name="wpProQuiz_captchaPrefix"]')
                .val(json.captcha.code);
              $captcha
                .find(".wpProQuiz_captchaImg")
                .attr("src", json.captcha.img);
              $captcha.find('input[name="wpProQuiz_captcha"]').val("");

              $captcha.show();
            } else {
              $captcha.hide();
            }
          }
        } else {
          $tp.hide();
        }
      },

      scrollTo: function (e, h) {
        var x = e.offset().top - 100;

        if (h || (window.pageYOffset || document.body.scrollTop) > x) {
          $("html,body").animate({ scrollTop: x }, 300);
        }
      },

      addToplist: function () {
        if (bitOptions.preview) return;

        var $addToplistMessage = $e
          .find(".wpProQuiz_addToplistMessage")
          .text(WpProQuizGlobal.loadData)
          .show();
        var $addBox = $e.find(".wpProQuiz_addBox").hide();

        plugin.methode.ajax(
          {
            action: "wp_pro_quiz_add_toplist",
            quizId: config.quizId,
            quiz: config.quiz,
            token: toplistData.token,
            name: $addBox.find('input[name="wpProQuiz_toplistName"]').val(),
            email: $addBox.find('input[name="wpProQuiz_toplistEmail"]').val(),
            captcha: $addBox.find('input[name="wpProQuiz_captcha"]').val(),
            prefix: $addBox.find('input[name="wpProQuiz_captchaPrefix"]').val(),
            //points: 99, //results.comp.points, // LD v2.4.3 Calculated on server
            results: results,
            //p_nonce: results.comp.p_nonce, // LD v2.4.3 Calculated on server
            //totalPoints:config.globalPoints, // LD v2.4.3 Calculated on server
            timespent: timespent
          },
          function (json) {
            $addToplistMessage.text(json.text);

            if (json.clear) {
              $addBox.hide();
              plugin.methode.updateToplist();
            } else {
              $addBox.show();
            }

            if (json.captcha) {
              $addBox
                .find(".wpProQuiz_captchaImg")
                .attr("src", json.captcha.img);
              $addBox
                .find('input[name="wpProQuiz_captchaPrefix"]')
                .val(json.captcha.code);
              $addBox.find('input[name="wpProQuiz_captcha"]').val("");
            }
          }
        );
      },

      updateToplist: function () {
        if (typeof wpProQuiz_fetchToplist == "function") {
          wpProQuiz_fetchToplist();
        }
      },

      registerSolved: function () {
        // Free Input field
        $e.find('.wpProQuiz_questionInput[type="text"]').change(function (e) {
          var $this = $(this);
          var $p = $this.parents(".wpProQuiz_listItem");
          var s = false;

          if ($this.val() != "") {
            s = true;
          }

          $e.trigger({
            type: "questionSolved",
            values: { item: $p, index: $p.index(), solved: s }
          });
        });

        // Free Input field
        $e.find(".laq_jumbled_sentence_dropdown").change(function (e) {
          var $this = $(this);
          var $p = $this.parents(".wpProQuiz_listItem");
          var s = false;

          if ($this.val() != "") {
            s = true;
          }

          $e.trigger({
            type: "questionSolved",
            values: { item: $p, index: $p.index(), solved: s }
          });
        });
        // Free Input field
        $e.find(
          '.laq_advanced_calculated_selection[type="text"], .laq_advanced_calculated_selection[type="number"]'
        ).change(function (e) {
          var $this = $(this);
          var $p = $this.parents(".wpProQuiz_listItem");
          var s = false;

          if ($this.val() != "") {
            s = true;
          }

          $e.trigger({
            type: "questionSolved",
            values: { item: $p, index: $p.index(), solved: s }
          });
        });

        // Free Input field
        $e.find(".laq_advanced_swipe_attempted").change(function (e) {
          var $this = $(this);
          var $p = $this.parents(".wpProQuiz_listItem");
          var s = false;

          if ($this.val() != "") {
            s = true;
          }

          $e.trigger({
            type: "questionSolved",
            values: { item: $p, index: $p.index(), solved: s }
          });
		});
		
		/**
		 * Hotspot Question
		 * Trigger solve status when a hotspot question is answered
		 */
		$('body').on( 'change', 'input.laq_hotspot_input[type=radio]', function(e){

			var $this = $(this);
          	var $p = $this.parents(".wpProQuiz_listItem");
          	var s = true;

			$e.trigger({
				type: "questionSolved",
				values: { item: $p, index: $p.index(), solved: s }
			});
		});

        // Single Choice field
        $e.find(
          '.wpProQuiz_questionList[data-type="single"] .wpProQuiz_questionInput, .wpProQuiz_questionList[data-type="assessment_answer"] .wpProQuiz_questionInput'
        ).change(function (e) {
          var $this = $(this);
          var $p = $this.parents(".wpProQuiz_listItem");
          var s = this.checked;

          $e.trigger({
            type: "questionSolved",
            values: { item: $p, index: $p.index(), solved: s }
          });
        });

        // Cloze field
        $e.find(".wpProQuiz_cloze input").change(function () {
          var $this = $(this);
          var $p = $this.parents(".wpProQuiz_listItem");
          var s = true;

          $p.find(".wpProQuiz_cloze input").each(function () {
            if ($(this).val() == "") {
              s = false;
              return false;
            }
          });

          $e.trigger({
            type: "questionSolved",
            values: { item: $p, index: $p.index(), solved: s }
          });
        });

        // ?? field
        $e.find(
          '.wpProQuiz_questionList[data-type="multiple"] .wpProQuiz_questionInput'
        ).change(function (e) {
          var $this = $(this);
          var $p = $this.parents(".wpProQuiz_listItem");
          var c = 0;

          $p.find(
            '.wpProQuiz_questionList[data-type="multiple"] .wpProQuiz_questionInput'
          ).each(function (e) {
            if (this.checked) c++;
          });

          $e.trigger({
            type: "questionSolved",
            values: { item: $p, index: $p.index(), solved: c ? true : false }
          });
        });

        // Essay textarea field. For Essay file uploads look into uploadFile() function
        $e.find(
          '.wpProQuiz_questionList[data-type="essay"] textarea.wpProQuiz_questionEssay'
        ).change(function (e) {
          var $this = $(this);
          var $p = $this.parents(".wpProQuiz_listItem");
          var s = false;

          if ($this.val() != "") {
            s = true;
          }
          $e.trigger({
            type: "questionSolved",
            values: { item: $p, index: $p.index(), solved: s }
          });
        });
      },

      loadQuizDataAjax: function (quizStart) {
        //console.log('config[%o]', config.quizId);

        plugin.methode.ajax(
          {
            action: "wp_pro_quiz_admin_ajax",
            func: "quizLoadData",
            data: {
              quizId: config.quizId,
              quiz: config.quiz,
              quiz_nonce: config.quiz_nonce
            }
          },
          function (json) {
            config.globalPoints = json.globalPoints;
            config.catPoints = json.catPoints;
            config.json = json.json;

            globalElements.quiz.remove();

            $e.find(".wpProQuiz_quizAnker").after(json.content);

            $(
              "table.wpProQuiz_toplistTable caption span.wpProQuiz_max_points"
            ).html(config.globalPoints);

            //Reinit globalElements
            globalElements = {
              back: $e.find('input[name="back"]'),
              next: $e.find(globalNames.next),
              quiz: $e.find(".wpProQuiz_quiz"),
              questionList: $e.find(".wpProQuiz_list"),
              results: $e.find(".wpProQuiz_results"),
              sending: $e.find(".wpProQuiz_sending"),
              quizStartPage: $e.find(".wpProQuiz_text"),
              timelimit: $e.find(".wpProQuiz_time_limit"),
              toplistShowInButton: $e.find(".wpProQuiz_toplistShowInButton"),
              listItems: $(),
              //save: $(".ld_advance_quiz_save"), //Added by webxity
             //resume: $(".ld_advance_quiz_resume"), //Added by webxity
              //save_as_next: $("#ld_advanced_save_as_next").val() //Added by webxity
            };

            plugin.methode.initQuiz();

            /*
            * - Added by Wayne
            * Trigger bbchild_render_final_quiz_hotspot_question
            * This will implement iCheck on hotspot questions radio buttons in final quiz.
            */
            $( document ).trigger( 'bbchild_render_final_quiz_hotspot_questions' );

            if (quizStart) plugin.methode.startQuiz(true);

            // load script to show player for ajax content
            var data = json.content;
            var audiotag = data.search("wp-audio-shortcode");
            var videotag = data.search("wp-video-shortcode");
            if (audiotag != "-1" || videotag != "-1") {
              $.getScript(
                json.site_url +
                "/wp-includes/js/mediaelement/mediaelement-and-player.min.js"
              );
              $.getScript(
                json.site_url +
                "/wp-includes/js/mediaelement/wp-mediaelement.js"
              );
              $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href:
                  json.site_url +
                  "/wp-includes/js/mediaelement/mediaelementplayer.min.css"
              }).appendTo("head");
            }
          }
        );
      },
    //   saveQuestionClicked: function () {
    //     var quizId = config.quizId;
    //     var quizPostId = config.quiz;
    //     if (globalElements.save_as_next != "yes") {
    //       timelimit.pause();

    //       var time = (+new Date() - startTime) / 1000;
    //       time =
    //         config.timelimit && time > config.timelimit
    //           ? config.timelimit
    //           : time;
    //       timespent = time;
    //       $e.find(".wpProQuiz_quiz_time span").text(
    //         plugin.methode.parseTime(time)
    //       );
    //     }

    //     var finishQuiz = list == undefined ? false : true;
    //     var responses = {};
    //     var r = {};
    //     var list = globalElements.questionList.children();
    //     var endCheck = true;
    //     var list = globalElements.questionList.children();
    //     list = list == undefined ? currentQuestion : list;

    //     list.each(function () {
    //       var $this = $(this);
    //       var question_index = $this.index();
    //       var $questionList = $this.find(globalNames.questionList);
    //       var question_id = $questionList.data("question_id");
    //       var data = config.json[$questionList.data("question_id")];
    //       var name = data.type;

    //       if (data.type == "single" || data.type == "multiple") {
    //         name = "singleMulti";
    //       }

    //       //if (config.ld_script_debug == true) {
    //       //	console.log('checkQuestion: calling readResponses');
    //       //}

    //       responses[question_id] = readResponses(
    //         name,
    //         data,
    //         $this,
    //         $questionList,
    //         false
    //       );
    //       responses[question_id]["question_pro_id"] = data["id"];
    //       responses[question_id]["question_post_id"] = data["question_post_id"];

    //       plugin.methode.CookieSaveResponse(
    //         question_id,
    //         question_index,
    //         data.type,
    //         responses[question_id]
    //       );
    //     });

    //     plugin.methode.ajax(
    //       {
    //         action: "ld_advance_save_quiz_pro", //changed for advance addon
    //         func: "checkAnswers",
    //         data: {
    //           quizId: config.quizId,
    //           quiz: config.quiz,
    //           course_id: config.course_id,
    //           quiz_nonce: config.quiz_nonce,
    //           responses: JSON.stringify(responses),
    //           viewedQuestions: viewedQuestions,
    //           checkedQuestions: checkedQuestions
    //         }
    //       },
    //       function (json) {
    //         plugin.methode.hideSpinner();
    //         jQuery(".ld_advance_quiz_resume").show();

    //         if (globalElements.save_as_next != "yes") {
    //           $(".wp_pro_quiz_message")
    //             .html("Quiz state is saved.")
    //             .css("display", "block");
    //           location.reload();
    //         }
    //       }
    //     );
    //   },
    //   load_save_resume: function () {
    //     if (is_resume_save_event_attached == false) {
    //       if (globalElements.save)
    //         globalElements.save.click(plugin.methode.saveQuestionClicked); // added by webxity

    //       if (globalElements.resume)
    //         globalElements.resume.click(plugin.methode.resumeQuestionClicked); // added by webxity
    //       is_resume_save_event_attached = true;
    //     }
    //   },
    //   resumeQuestionClicked: function () {
    //     is_quiz_resume_in_process = "yes";
    //     var post_data = {
    //       action: "ld_advance_resume_quiz",
    //       quizId: config.quizId,
    //       quizPostId: config.quiz
    //     };

    //     jQuery.ajax({
    //       type: "POST",
    //       url: WpProQuizGlobal.ajaxurl,
    //       dataType: "json",
    //       cache: false,
    //       data: post_data,
    //       error: function (jqXHR, textStatus, errorThrown) { },
    //       success: function (reply_data) {
    //         viewedQuestions = Object.values(reply_data.viewedQuestions).map(Number);
    //         checkedQuestions = Object.values(reply_data.checkedQuestions).map(Number);

    //         if (reply_data.type != "success") {
    //           $(".wp_pro_quiz_message")
    //             .html(reply_data.message)
    //             .css("display", "block");
    //         } else {
    //           $(".wp_pro_quiz_message")
    //             .html("")
    //             .css("display", "none"); //added by webxity

    //           resumedQuestions = reply_data.data.questions;
    //           var list = globalElements.questionList.children();
    //           var swipe_element_index = -1;
    //           list.each(function () {
    //             var $this = $(this);
    //             var $questionList = $this.find(globalNames.questionList);
    //             var question_id = $questionList.data("question_id");
    //             var data = config.json[$questionList.data("question_id")];


    //             if (!viewedQuestions.includes(question_id)) return;

    //             var question = Array();
    //             if (resumedQuestions) {
    //               if (resumedQuestions[question_id]) {
    //                 if (resumedQuestions[question_id]["response"]) {
    //                   question = resumedQuestions[question_id]["response"];
    //                 }
    //               }
    //             }
    //             if (data.type == "laq_swipe_questions") {
    //               swipe_element_index++;
    //             }

    //             //if( question.length>0 )
    //             {
    //               var main_index = list.index($this);

    //               switch (data.type) {
    //                 case "single":
    //                   jQuery(".wpProQuiz_questionListItem", $questionList).each(
    //                     function (i) {
    //                       var $item = $(this);
    //                       var index = $item.attr("data-pos");

    //                       if (question[index] == true) {
    //                         $item
    //                           .find("input[type=radio]")
    //                           .prop("checked", true);
    //                         $e.trigger({
    //                           type: "questionSolved",
    //                           values: {
    //                             item: $this,
    //                             index: main_index,
    //                             solved: true
    //                           }
    //                         });
    //                       }
    //                     }
    //                   );
    //                   break;
    //                 case "multiple":
    //                   jQuery(".wpProQuiz_questionListItem", $questionList).each(
    //                     function (i) {
    //                       var $item = $(this);
    //                       var index = $item.attr("data-pos");

    //                       if (question[index] == true) {
    //                         $item
    //                           .find("input[type=checkbox]")
    //                           .prop("checked", true);
    //                         $e.trigger({
    //                           type: "questionSolved",
    //                           values: {
    //                             item: $this,
    //                             index: main_index,
    //                             solved: true
    //                           }
    //                         });
    //                       }
    //                     }
    //                   );
    //                   break;
    //                 case "free_answer":
    //                   var $li = $questionList.children();
    //                   var value = $li
    //                     .find(".wpProQuiz_questionInput")
    //                     .val(question);
    //                   $li
    //                     .find(".wpProQuiz_questionInput")
    //                     .attr("disabled", false);
    //                   if (question != "") {
    //                     $e.trigger({
    //                       type: "questionSolved",
    //                       values: {
    //                         item: $this,
    //                         index: main_index,
    //                         solved: true
    //                       }
    //                     });
    //                   }
    //                   break;
    //                 case "cloze_answer":
    //                   $questionList
    //                     .find(".wpProQuiz_cloze")
    //                     .each(function (i, v) {
    //                       var $this = $(this);
    //                       $this.find("input[type=text]").val(question[i]);
    //                       if (question[i] != "") {
    //                         $e.trigger({
    //                           type: "questionSolved",
    //                           values: {
    //                             item: $this,
    //                             index: main_index,
    //                             solved: true
    //                           }
    //                         });
    //                       }
    //                     });
    //                   break;

    //                 case "sort_answer":
    //                   var $items = $questionList.children();
    //                   var sort_questions = "";
    //                   for (var i = 0; i < question.length; i++) {
    //                     var curr_id = question[i];

    //                     $items.each(function (i, v) {
    //                       var $this = $(this);

    //                       var node_id = $this.attr("data-pos");
    //                       if (node_id == curr_id) {
    //                         $e.trigger({
    //                           type: "questionSolved",
    //                           values: {
    //                             item: $this,
    //                             index: main_index,
    //                             solved: true
    //                           }
    //                         });
    //                         sort_questions +=
    //                           '<li class="wpProQuiz_questionListItem" data-pos="' +
    //                           curr_id +
    //                           '">' +
    //                           $this.html() +
    //                           "</li>";
    //                       }
    //                     });
    //                   }
    //                   if (sort_questions) $questionList.html(sort_questions);
    //                   break;
    //                 case "matrix_sort_answer":
    //                   $sortable_items = $questionList
    //                     .parent()
    //                     .find(".wpProQuiz_sortStringList");
    //                   for (var j = 0; j < question.length; j++) {
    //                     var curr_id = question[j];
    //                     jQuery(
    //                       ".wpProQuiz_questionListItem",
    //                       $questionList
    //                     ).each(function (i) {
    //                       var $item = $(this);
    //                       var index = $item.attr("data-pos");
    //                       if (curr_id == index) {
    //                         $sortable_items.find("li").each(function () {
    //                           var $inner_item = $(this);
    //                           var inner_index = $inner_item.attr("data-pos");
    //                           if (inner_index == j) {
    //                             var element = $inner_item.detach();
    //                             $item
    //                               .find(".wpProQuiz_maxtrixSortCriterion")
    //                               .append(element);
    //                           }
    //                         });
    //                         $e.trigger({
    //                           type: "questionSolved",
    //                           values: {
    //                             item: $this,
    //                             index: main_index,
    //                             solved: true
    //                           }
    //                         });
    //                       }
    //                     });
    //                   }
    //                   break;
    //                 case "assessment_answer":
    //                   jQuery(
    //                     ".wpProQuiz_questionListItem input",
    //                     $questionList
    //                   ).each(function (i) {
    //                     var $item = $(this);
    //                     var index = $item.attr("data-pos");
    //                     if (parseInt(question) == parseInt($item.val())) {
    //                       $item.prop("checked", true);
    //                       $e.trigger({
    //                         type: "questionSolved",
    //                         values: {
    //                           item: $this,
    //                           index: main_index,
    //                           solved: true
    //                         }
    //                       });
    //                     }
    //                   });
    //                   break;
    //                 case "essay":
    //                   var $li = $questionList.children();
    //                   $li.find("textarea").val(question);

    //                   if (question != "") {
    //                     $e.trigger({
    //                       type: "questionSolved",
    //                       values: {
    //                         item: $this,
    //                         index: main_index,
    //                         solved: true
    //                       }
    //                     });
    //                   }
    //                   break;
    //                 case "laq_jumbled_sentence":
    //                   for (var i = 0; i < question.length; i++) {
    //                     var record = question[i];
    //                     jQuery(
    //                       "select[name=" + record.name + "]",
    //                       $questionList
    //                     ).val(record.option);
    //                     if (record.option != "") {
    //                       $e.trigger({
    //                         type: "questionSolved",
    //                         values: {
    //                           item: $this,
    //                           index: main_index,
    //                           solved: true
    //                         }
    //                       });
    //                     }
    //                   }
    //                   break;
    //                 case "laq_swipe_questions":
    //                   for (var i = 0; i < question.length; i++) {
    //                     var record = question[i];
    //                     if (record.attempted == "yes") {
    //                       $e.trigger({
    //                         type: "questionSolved",
    //                         values: {
    //                           item: $this,
    //                           index: main_index,
    //                           solved: true
    //                         }
    //                       });
    //                       if (parseInt(record.selection) == 0) {
    //                         mySwipe[swipe_element_index].shiftSlide(
    //                           -1,
    //                           "drag",
    //                           "outside"
    //                         );
    //                       } else {
    //                         mySwipe[swipe_element_index].shiftSlide(
    //                           1,
    //                           "drag",
    //                           "outside"
    //                         );
    //                       }
    //                     }
    //                     $this
    //                       .find("#laq_advanced_swipe_attempted" + i)
    //                       .val(record.attempted);
    //                   }

    //                   break;
    //                 case "laq_calculated_formula":
    //                   if(config.mode==2) {
    //                       break;
    //                   }
    //                   for (var i = 0; i < question.length; i++) {
    //                     var record = question[i];
    //                     $itm = jQuery(".card_calculation", $questionList).eq(i);
    //                     $itm
    //                       .find(".laq_advanced_calculated_selection")
    //                       .val(record.selection);
    //                     if (record.selection != "") {
    //                       $e.trigger({
    //                         type: "questionSolved",
    //                         values: {
    //                           item: $this,
    //                           index: main_index,
    //                           solved: true
    //                         }
    //                       });
    //                     }
    //                   }
    //                   break;
    //               }
    //             }
    //           });

    //           jQuery(".ld_advance_quiz_resume").hide();
    //           if(config.mode==2) {
    //               plugin.methode.checkQuestion(list);
    //           } else {
    //               is_quiz_resume_in_process = "no";
    //           }
    //         }


    //       }
    //     });

    //     if (timelimit.getInterval() == 0) {
    //       timelimit.start();
    //     }
    //   },
      nextQuestionClicked: function () {
        var $questionList = currentQuestion.find(globalNames.questionList);
        var data = config.json[$questionList.data("question_id")];
        // Within the following logic. If the question type is 'sort_answer' there is a chance
        // the sortable answers will be displayed in the correct order. In that case the user will click
        // the next button.
        // The trigger to set the question was answered is normally a function of the sort/drag action
        // by the user. So we need to set the question answered flag in the case the Quiz summary is enabled.
        if (data.type == "sort_answer") {
          var question_index = currentQuestion.index();
          if (typeof quizSolved[question_index] === "undefined") {
            $e.trigger({
              type: "questionSolved",
              values: {
                item: currentQuestion,
                index: question_index,
                solved: true
              }
            });
          }
        }

        if (
          bitOptions.forcingQuestionSolve &&
          !quizSolved[currentQuestion.index()] &&
          (bitOptions.quizSummeryHide || !bitOptions.reviewQustion)
        ) {
          // Would really like to do something more stylized instead of a simple alert popup. yuk!
          alert(WpProQuizGlobal.questionNotSolved);
          return false;
        }

        plugin.methode.nextQuestion();

		/**
		 * Save & Resume Integration
		 * Remove pro quiz message
		 */
        // $(".wp_pro_quiz_message")
        //   .html("")
        //   .css("display", "none"); //added by webxity
      },
      initQuiz: function () {
        //if (config.ld_script_debug == true) {
        //	console.log('in initQuiz');
        //}

        plugin.methode.setClozeStyle();
        plugin.methode.registerSolved();

        globalElements.next.click(plugin.methode.nextQuestionClicked);

		/**
		 * Save & Resume integration
		 * Removed load_save_resume call
		 */
        //plugin.methode.load_save_resume();

        globalElements.back.click(function () {
          plugin.methode.prevQuestion();
        });

        $e.find(globalNames.check).click(function () {
          if (
            bitOptions.forcingQuestionSolve &&
            !quizSolved[currentQuestion.index()] &&
            (bitOptions.quizSummeryHide || !bitOptions.reviewQustion)
          ) {
            alert(WpProQuizGlobal.questionNotSolved);
            return false;
          }
          plugin.methode.checkQuestion();
        });

        $e.find('input[name="checkSingle"]').click(function () {
          // First get all the questions...
          list = globalElements.questionList.children();
          if (list != null) {
            list.each(function () {
              var $this = $(this);
              var $questionList = $this.find(globalNames.questionList);
              var question_id = $questionList.data("question_id");
              var data = config.json[$questionList.data("question_id")];

              // Within the following logic. If the question type is 'sort_answer' there is a chance
              // the sortable answers will be displayed in the correct order. In that case the user will click
              // the next button.
              // The trigger to set the question was answered is normally a function of the sort/drag action
              // by the user. So we need to set the question answered flag in the case the Quiz summary is enabled.
              if (data.type == "sort_answer") {
                //var question_index = $this.index();
                //if ( typeof quizSolved[question_index] === 'undefined') {
                $e.trigger({
                  type: "questionSolved",
                  values: { item: $this, index: $this.index(), solved: true }
                });
                //}
              }
            });
          }

          if (
            bitOptions.forcingQuestionSolve &&
            (bitOptions.quizSummeryHide || !bitOptions.reviewQustion)
          ) {
            for (
              var i = 0, c = $e.find(".wpProQuiz_listItem").length;
              i < c;
              i++
            ) {
              if (!quizSolved[i]) {
                alert(WpProQuizGlobal.questionsNotSolved);
                return false;
              }
            }
          }

          plugin.methode.showQuizSummary();
        });

        $e.find('input[name="tip"]').click(plugin.methode.showTip);
        $e.find('input[name="skip"]').click(plugin.methode.skipQuestion);

        $e.find('input[name="wpProQuiz_pageLeft"]').click(function () {
          plugin.methode.showSinglePage(currentPage - 1);
          plugin.methode.setupMatrixSortHeights();
        });

        $e.find('input[name="wpProQuiz_pageRight"]').click(function () {
          plugin.methode.showSinglePage(currentPage + 1);

		  plugin.methode.setupMatrixSortHeights();
		  /**
		   * Save & Resume integration
		   * Remove saveQuestionsClicked method call
		   */
          //Add by webxity
        //   if (globalElements.save_as_next == "yes") {
        //       plugin.methode.saveQuestionClicked();
        //   }
          //Add by webxity end
        });

        //console.log('line 2436: adding click event for essay upload button ');
        $e.find('input[id^="uploadEssaySubmit"]').click(
          plugin.methode.uploadFile
        );

        // Added in LD v2.4 to allow external notification when quiz init happens.
        $e.trigger("learndash-quiz-init");
      },
      // Setup the Cookie specific to the Quiz ID.
      CookieInit: function () {
        if (config.timelimitcookie == 0) return;

        cookie_name = "ld_" + config.quizId + "_quiz_responses";

        // Comment out to force clear cookie on init.
        //jQuery.cookie(cookie_name, '');


		/** 
		 * Save & Resume integration
		 * Remove default cookie save and replace with new save logic
		*/
		//cookie_value = jQuery.cookie(cookie_name);
		
		if ( 'undefined' != typeof WpProQuizGlobal.srfl_quiz_progress && 'undefined' != typeof WpProQuizGlobal.srfl_quiz_progress.answers ) {
			cookie_value = WpProQuizGlobal.srfl_quiz_progress.answers;
		}

		jQuery(document).trigger('srfl_restore_response', cookie_value );

        if (cookie_value == "" || cookie_value == undefined) {
          cookie_value = {};
        } else {
          cookie_value = JSON.parse(cookie_value);
        }

        //if (config.ld_script_debug == true) {
        //	console.log('CookieInit: cookie_name[%o] cookie_value[%o]', cookie_name, cookie_value);
        //}

		/**
		 * TO-DO
		 * Comment out setting responses and move this function call to startQuiz
		 * to accommodate Review mode questions
		 */
		//plugin.methode.CookieSetResponses();

		/**
		 * Save & Resume Integration
		 * Return everything to normal for reviewQuestion Triggers
		 */
		//initStatus = false;
        plugin.methode.CookieResponseTimer();
      },
      CookieDelete: function () {
        if (config.timelimitcookie == 0) {
          //if (config.ld_script_debug == true) {
          //	console.log('CookieDelete: config.timelimitcookie[%o]', config.timelimitcookie);
          //}
          return;
        }

        cookie_name = "ld_" + config.quizId + "_quiz_responses";
        //if (config.ld_script_debug == true) {
        //	console.log('CookieDelete: cookie_name[%o]', cookie_name);
        //}
        jQuery.cookie(cookie_name, "");
      },
      CookieProcessQuestionResponse: function (list) {
        if (list != null) {
          list.each(function () {
            var $this = $(this);

            var question_index = $this.index();
            var $questionList = $this.find(globalNames.questionList);
            var question_id = $questionList.data("question_id");
            var data = config.json[$questionList.data("question_id")];
            if (data) {
              var name = data.type;
              if (data.type == "single" || data.type == "multiple") {
                name = "singleMulti";
              }

              //if (config.ld_script_debug == true) {
              //	console.log('CookieProcessQuestionResponse: calling readResponses');
              //}
              var question_response = readResponses(
                name,
                data,
                $this,
                $questionList,
                false
              );

              //if (config.ld_script_debug == true) {
              //	console.log('CookieProcessQuestionResponse: calling CookieSaveResponse');
              //	console.log('question_id[%o], question_index[%o], data.type[%o], question_response[%o]', question_id, question_index, data.type, question_response);
              //}

              plugin.methode.CookieSaveResponse(
                question_id,
                question_index,
                data.type,
                question_response
              );
            }
          });
        }
      },
      // Save the answer(response) to the cookie. This is called from 'checkQuestion' and cookie timer functions.
      CookieSaveResponse: function (
        question_id,
        question_index,
        question_type,
        question_response
      ) {
        if (config.timelimitcookie == 0) {
          //if (config.ld_script_debug == true) {
          //	console.log('CookieSaveResponse: config.timelimitcookie[%o]', config.timelimitcookie);
          //}
          return;
		}
        /**
         * Save & Resume integration
         * Trigger ajax request to save quiz answers, remaining time, a current question 
         * along with other required data
         */
        
        jQuery(document).trigger('srfl_save_response', [ question_id, question_index, question_type, question_response ]);
		
        // set the value
        cookie_value[question_id] = {
          index: question_index,
          value: question_response["response"],
          type: question_type
        };

        // store the values.
        // Calculate the cookie date to expire
        var cookie_expire_date = new Date();
        cookie_expire_date.setTime(
          cookie_expire_date.getTime() + config.timelimitcookie * 1000
        );
        //if (config.ld_script_debug == true) {
        //	console.log('CookieSaveResponse: cookie_name[%o] cookie_value[%o]', cookie_name, cookie_value);
        //}
        jQuery.cookie(cookie_name, JSON.stringify(cookie_value), {
          expires: cookie_expire_date
        });
      },
      // The cookie timer loops every 5 seconds to save the last response from the user.
      // This only effect Essay questions as there is some current logic where once
      // 'readResponses' is called the question is locked.
      CookieResponseTimer: function () {
        if (config.timelimitcookie == 0) return;

        /*
				var list = null;
				var poll_interval = 5;
				
				// If mode is 3 we are display ALL questions. So we do this on an interval of 60 seconds. 
				if (config.mode == 3) {
					list = globalElements.questionList.children();
					var poll_interval = 60;
				} else {
					if (currentQuestion != null) {
						list = currentQuestion;
					}
				}
				
				if (list != null) {
					if (config.ld_script_debug == true) {
						console.log('CookieResponseTimer: liist[%o] ', list);
					}
					
					plugin.methode.CookieProcessQuestionResponse( list );
				}

				setTimeout(function() {
					plugin.methode.CookieResponseTimer();
				}, poll_interval*1000);					
				*/

        // Hook into the 'questionSolved' triggered event. This is much better than
        // a timer to grab the answer values. With the event trigger we only process the
        // single question when the user makes a change.
        $e.bind("questionSolved", function (e) {
          //if (config.ld_script_debug == true) {
          //	console.log('CookieResponseTimer: e.values[%o]', e.values);
          //}
          plugin.methode.CookieProcessQuestionResponse(e.values.item);
        });
      },
      // Load the Cookie (if present) and sets the values of the Quiz questions to the cookie saved value
      CookieSetResponses: function () {

        if (config.timelimitcookie == 0) return;

        /**
         * Save & Resume Integration
         * Detect if cookie_value == '', then don't populate the fields.
         */
        if (cookie_value == undefined || !Object.keys(cookie_value).length || cookie_value == '') {
          return;
        }

		var list = globalElements.questionList.children();
		
		//ADD RESPONSES VARIABLE
		var responses = {};
		
        list.each(function () {
			  
			var $this = $(this);

			var question_index = $this.index();
          	var $questionList = $this.find(globalNames.questionList);
          	var form_question_id = $questionList.data("question_id");

			if (cookie_value[form_question_id] != undefined) {
				var cookie_question_data = cookie_value[form_question_id];

				var form_question_data =
				config.json[$questionList.data("question_id")];
				if (form_question_data.type === cookie_question_data.type) {
				//if (config.ld_script_debug == true) {
				//	console.log('CookieSetResponses: form_question_data[%o] cookie_question_data.value[%o]', form_question_data, cookie_question_data.value);
				//}

				setResponse(
					form_question_data,
					cookie_question_data.value,
					$this,
					$questionList
				);
				
				/**
				 * Feature - Pause on Review Mode
				 * Check if a question was marked as 'checked'
				 */

					var $questionList = $this.find(globalNames.questionList);
					var question_id = $questionList.data("question_id");
					var data = config.json[$questionList.data("question_id")];
					var name = cookie_question_data.type;

					if(name == 'single' || name == 'multiple') {
						name = 'singleMulti';
					}

					responses[question_id] = readResponses(
						name,
						data,
						$this,
						$questionList,
						false
					);

					responses[question_id]["question_pro_id"] = data["id"];
					responses[question_id]["question_post_id"] = data["question_post_id"];

					plugin.methode.CookieSaveResponse(
						question_id,
						question_index,
						data.type,
						responses[question_id]
					);

				}
			}
		});

		/**
		 * Pause on Review Mode
		 * Do an AJAX Request to check questions if questions are saved
		 */
		if( $.isEmptyObject(responses) !== true && config.mode === 2) {
			
			plugin.methode.ajax({
				action: "ld_advance_adv_quiz_pro_ajax", //changed for advance addon
				func: "checkAnswers",
				data: {
					quizId: config.quizId,
					quiz: config.quiz,
					course_id: config.course_id,
					quiz_nonce: config.quiz_nonce,
					responses: JSON.stringify(responses)
				}
			},
			function (json) {

				list.each(function(){
					$this = $(this);
					var $questionList = $this.find(globalNames.questionList);
					var question_id = $questionList.data("question_id");
	
					if (cookie_value[question_id] != undefined) {
	
						$this.find(".wpProQuiz_response").show();
	
						var result = json[question_id];

						data = config.json[$questionList.data("question_id")];

						$this.find(".wpProQuiz_response").show();
						$this.find(globalNames.check).hide();
						$this.find(globalNames.skip).hide();
						$this.find(globalNames.next).show();

						results[data.id].points = result.p;
						if (typeof result.p_nonce !== "undefined")
						results[data.id].p_nonce = result.p_nonce;
						else results[data.id].p_nonce = "";

						results[data.id].correct = Number(result.c);
						results[data.id].data = result.s;
						if (typeof result.a_nonce !== "undefined")
						results[data.id].a_nonce = result.a_nonce;
						else results[data.id].a_nonce = "";
						results[data.id].possiblePoints = result.e.possiblePoints;

						// If the sort_answer or matrix_sort_answer question type is not 100% correct then the returned
						// result.s object will be empty. So in order to pass the user's answers to the server for the
						// sendCompletedQuiz AJAX call we need to grab the result.e.r object and store into results.
						if (jQuery.isEmptyObject(results[data.id].data)) {
						if (
							result.e.type != undefined &&
							(result.e.type == "sort_answer" ||
							result.e.type == "matrix_sort_answer")
						) {
							results[data.id].data = result.e.r;
						}
						}

						if (
						typeof result.e.graded_id !== "undefined" &&
						result.e.graded_id > 0
						) {
						results[data.id].graded_id = result.e.graded_id;
						}

						if (typeof result.e.graded_status !== "undefined") {
						results[data.id].graded_status = result.e.graded_status;
						}

						results["comp"].points += result.p;

						$this.find(".wpProQuiz_response").show();
						$this.find(globalNames.check).hide();
						$this.find(globalNames.skip).hide();
						$this.find(globalNames.next).show();

						//results[data.id].points = result.p;
						//results[data.id].correct = Number(result.c);
						//results[data.id].data = result.s;

						// If the sort_answer or matrix_sort_answer question type is not 100% correct then the returned
						// result.s object will be empty. So in order to pass the user's answers to the server for the
						// sendCompletedQuiz AJAX call we need to grab the result.e.r object and store into results.
						if (jQuery.isEmptyObject(results[data.id].data)) {
						if (typeof result.e.type !== "undefined") {
							if (
							result.e.type == "sort_answer" ||
							result.e.type == "matrix_sort_answer"
							) {
							if (typeof result.e.r !== "undefined") {
								results[data.id].data = result.e.r;
							}
							}

							if (result.e.type == "essay") {
							if (typeof result.e.graded_id !== "undefined") {
								results[data.id].data = {
								graded_id: result.e.graded_id
								};
							}
							}
						}
						}

						//results['comp'].points += result.p;

						catResults[data.catId] += result.p;
	
						//Mark question if correct or incorrect
						plugin.methode.markCorrectIncorrect(
							result,
							$this,
							$questionList
						);
		  
						//
						if (result.c) {
	
							if (typeof result.e.AnswerMessage !== "undefined") {
								$this
								.find(".wpProQuiz_correct")
								.find(".wpProQuiz_AnswerMessage")
								.html(result.e.AnswerMessage);
								$this
								.find(".wpProQuiz_correct")
								.trigger("learndash-quiz-answer-response-contentchanged");
							}
	
							$this.find(".wpProQuiz_correct").show();
	
							results["comp"].correctQuestions += 1;
	
						} else {
	
							if (typeof result.e.AnswerMessage !== "undefined") {
								$this
								.find(".wpProQuiz_incorrect")
								.find(".wpProQuiz_AnswerMessage")
								.html(result.e.AnswerMessage);
								$this
								.find(".wpProQuiz_incorrect")
								.trigger("learndash-quiz-answer-response-contentchanged");
							}
	
							$this.find(".wpProQuiz_incorrect").show();
	
						}
		
						$this.find(".wpProQuiz_responsePoints").text(result.p);
	
						$this.find("input[name='check']").hide();
						$this.find("input[name='skip']").hide();
						$this.find("input[name='back']").hide();
	
		
						$this.data("check", true);
	
						var question_type = result.e.type;;
	
						if(result.e.type == 'single' || result.e.type == 'multiple') {
							question_type = 'singleMulti';
						}
	
						lockResponse($questionList, question_type);
	
					}
				});
	
			});

			
		} 

        return;
      },
      setupMatrixSortHeights: function () {
        /** Here we have to do all the questions because the current logic when using X questions
         * per page doesn't allow that information.
         */
        $("li.wpProQuiz_listItem", globalElements.questionList).each(function (
          idx,
          questionItem
        ) {
          var question_type = $(questionItem).data("type");
          if ("matrix_sort_answer" === question_type) {
            // On the draggable items get the items max height and set the parent ul to that.
            var sortitems_height = 0;
            $("ul.wpProQuiz_sortStringList li", questionItem).each(function (
              idx,
              el
            ) {
              var el_height = $(el).outerHeight();
              if (el_height > sortitems_height) {
                sortitems_height = el_height;
              }
            });
            if (sortitems_height > 0) {
              $("ul.wpProQuiz_sortStringList", questionItem).css(
                "min-height",
                sortitems_height
              );
            }

            $("ul.wpProQuiz_maxtrixSortCriterion", questionItem).each(function (
              idx,
              el
            ) {
              var parent_td = $(el).parent("td");
              if (typeof parent_td !== "undefined") {
                var parent_td_height = $(parent_td).height();
                $(el).css("height", parent_td_height);
                $(el).css("min-height", parent_td_height);
              }
            });
          }
        });
      }
    };

    /**
     * @memberOf plugin
     */
    plugin.preInit = function () {
      plugin.methode.parseBitOptions();
      reviewBox.init();

      $e.find('input[name="startQuiz"]').click(function () {
        plugin.methode.startQuiz();
        return false;
      });

      $e.find('input[name="viewUserQuizStatistics"]').click(function () {
        plugin.methode.viewUserQuizStatistics(this);
        return false;
      });

      if (bitOptions.checkBeforeStart && !bitOptions.preview) {
        plugin.methode.checkQuizLock();
      }

      $e.find('input[name="reShowQuestion"]').click(function () {
        plugin.methode.showQustionList();
      });

        /**
            jon-start - Handles the All, Incorrect and Correct Answer 
        */

        $e.find('select[name="questionfilter"]').on('change', function() {

            switch (this.value) {
                case 'all': {
                    $e.find('.wpProQuiz_correct:not([style*="display: none"])').parents('.wpProQuiz_listItem').show();
                        $e.find('.wpProQuiz_incorrect:not([style*="display: none"])').parents('.wpProQuiz_listItem').show();
                    break;
                }
                case 'wrong': {
                    $e.find('.wpProQuiz_incorrect:not([style*="display: none"])').parents('.wpProQuiz_listItem').show();
                    $e.find('.wpProQuiz_correct:not([style*="display: none"])').parents('.wpProQuiz_listItem').hide();
                    break;
                }
                case 'correct': {
                    $e.find('.wpProQuiz_correct:not([style*="display: none"])').parents('.wpProQuiz_listItem').show();
                    $e.find('.wpProQuiz_incorrect:not([style*="display: none"])').parents('.wpProQuiz_listItem').hide();
                    break;
                }
                default: {
                    $e.find('.wpProQuiz_correct:not([style*="display: none"])').parents('.wpProQuiz_listItem').show();
                        $e.find('.wpProQuiz_incorrect:not([style*="display: none"])').parents('.wpProQuiz_listItem').show();
                }
            }

        });

      $e.find('input[name="restartQuiz"]').click(function () {
        plugin.methode.restartQuiz();
      });

      $e.find('input[name="review"]').click(plugin.methode.reviewQuestion);

      $e.find('input[name="wpProQuiz_toplistAdd"]').click(
        plugin.methode.addToplist
      );

      $e.find('input[name="quizSummary"]').click(
        plugin.methode.showQuizSummary
      );

      $e.find('input[name="endQuizSummary"]').click(function () {
        if (bitOptions.forcingQuestionSolve) {
          // First get all the questions...
          list = globalElements.questionList.children();
          if (list != null) {
            list.each(function () {
              var $this = $(this);
              var $questionList = $this.find(globalNames.questionList);
              var question_id = $questionList.data("question_id");
              var data = config.json[$questionList.data("question_id")];

              // Within the following logic. If the question type is 'sort_answer' there is a chance
              // the sortable answers will be displayed in the correct order. In that case the user will click
              // the next button.
              // The trigger to set the question was answered is normally a function of the sort/drag action
              // by the user. So we need to set the question answered flag in the case the Quiz summary is enabled.
              if (data.type == "sort_answer") {
                var question_index = $this.index();
                if (typeof quizSolved[question_index] === "undefined") {
                  $e.trigger({
                    type: "questionSolved",
                    values: { item: $this, index: question_index, solved: true }
                  });
                }
              }
            });
          }

          for (
            var i = 0, c = $e.find(".wpProQuiz_listItem").length;
            i < c;
            i++
          ) {
            if (!quizSolved[i]) {
              alert(WpProQuizGlobal.questionsNotSolved);
              return false;
            }
          }
        }

        if (
          bitOptions.formActivated &&
          config.formPos == formPosConst.END &&
          !formClass.checkForm()
        )
          return;

        plugin.methode.finishQuiz();
      });

      $e.find('input[name="endInfopage"]').click(function () {
        if (formClass.checkForm()) plugin.methode.finishQuiz();
      });

      $e.find('input[name="showToplist"]').click(function () {
        globalElements.quiz.hide();
        globalElements.toplistShowInButton.toggle();
      });

      $e.bind("questionSolved", plugin.methode.questionSolved);

      //console.log('line 2702: adding click event for essay upload button');
      //$e.find('input[id^="uploadEssaySubmit"]').click(plugin.methode.uploadFile);

      if (!bitOptions.maxShowQuestion) {
        plugin.methode.initQuiz();
      }

      if (bitOptions.autoStart) plugin.methode.startQuiz();
    };

    plugin.preInit();
  };

  $.fn.wpProQuizFront = function (options) {
    return this.each(function () {
      if (undefined == $(this).data("wpProQuizFront")) {

        /**
		 * Pause on Review mode
		 * Make quiz type global for other plugins to access
		 */
        window.tdQuizConfig = options.mode;
        
        $(this).data("wpProQuizFront", new $.wpProQuizFront(this, options));
      }
    });
  };
})(jQuery);
