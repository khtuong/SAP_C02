/**
 * This file contains all the modules of Save and resume quiz plugin.
 */
(function($) {

	/**
	 * Current quiz's all the answers. 
	 * @type Array
	 */
	var quizAnswers = {};

	/**
	 * This is to save the state of the ajax request. We abort preivous if new request sent.
	 * @type XHR
	 */
	var progressAjaxRequest = null;

	/**
	 * Status of the quiz. True if paused, false if in progress.
	 * @type bool
	 */
	var pauseStatus = false;

	/**
	 * We start interval once Pause button is clicked. Because if the user resumes quiz within 5 seconds, we don't reload the page.
	 * @type int
	 */
	var pauseInterval = null;

	/**
	 * This is used with pauseInterval.
	 * @type int
	 */
	var pauseTimer = 0;

	jQuery( document ).ready( function() {

		// var start_quiz_btn_val = 'Start Quiz';
		var nextBtnVal = 'Save & Next';
		var resumeBtnVal = 'Resume Quiz';

		/**********************************************************************
			Things to do after document load >>>>>>>>>>
		**********************************************************************/

		if ( true == srfl_js_object.save_resume_setting ) {
			// set remaining quiz timer.
			var timerCookie = 'ldadv-time-limit-' + srfl_js_object.user_id + '-' + srfl_js_object.pro_quiz_id;

			if ( '' !== srfl_js_object.remaining_quiz_time ) {
				jQuery.cookie( timerCookie, srfl_js_object.remaining_quiz_time );
			}

			var $wpProQuizContent = jQuery( "#wpProQuiz_" + srfl_js_object.pro_quiz_id );

			// Change 'Next' button's value. 
			changeButtonNames( $wpProQuizContent.find( "input[name='next']" ), nextBtnVal );

			// We have progress so change Start Quiz to Resume Quiz.
			if ( true == srfl_js_object.has_progress ) {
				changeButtonNames( $wpProQuizContent.find( "input[name='startQuiz']" ), resumeBtnVal );
			}
	
			// Add 'pause' button next to 'Review' question button.
			jQuery( 'input[name="review"]' ).after( '<input type="button" name="srfl_puase" value="Pause" class="wpProQuiz_button2" style="margin-left: 5px; float: left; display: block;">' );



			/**********************************************************************
				Things to do on events trigger >>>>>>>>>>
			**********************************************************************/

			/**
			 * Restore DB values in the JS variable. Event is from the wpProQuiz_front.js file.
			 */
			jQuery( document ).on( 'srfl_restore_response', function( data, dbAnswers ) {
				if ( '' !== dbAnswers ) {
					quizAnswers = jQuery.parseJSON( dbAnswers );
				}
			} );

			/**
			 * Adds response in the variable to use in the ajax request later. Event is from the wpProQuiz_front.js file.
			 */
			jQuery( document ).on( 'srfl_save_response', function( data, questionId, questionIndex, questionType, questionResponse ) {

				if ( true == srfl_js_object.save_resume_setting ) {
					quizAnswers[questionId] = {'index': questionIndex, 'value': questionResponse[ 'response' ], 'type': questionType};
				}
				
			});

			/**
			 * When clicked on the Next( Save & Next ) button.
			 */
			jQuery( document ).on( 'click', "input[name='next']", function() {
				// Get the current URL
				var currentUrl = window.location.href;

				// Create regex to match 'review-mode' and 'section-based' in the URL
				var reviewModeRegex = /review-mode/;
				var sectionBasedRegex = /section-based/;

				// If the current URL does not contain 'review-mode' or 'section-based', call the saveProgress function
				// Using the "Save & Next" button, progress is saved only when the page is not in review mode or section-based mode.
				if (!reviewModeRegex.test(currentUrl) && !sectionBasedRegex.test(currentUrl)) {
					saveProgress();
				}
			});
			
			/**
			 * When clicked on the Check button.
			 * For the review mode and section-based mode, use the 'Check' button to save the progress instead of using the 'Save & Next' button.
			 */
			jQuery( document ).on( 'click', "input[name='check']", function() {
				saveProgress();
			});

			/**
			 * When the quiz is started.
			 */
			jQuery("input[name='startQuiz']").click(function() {
				// Jump onto the question where user was. Here timeout because we jump on the question when LD displays the questions and it takes a fraction of second delay.
				setTimeout(function() {
					    jQuery(".wpProQuiz_reviewQuestion li").eq( srfl_js_object.current_question ).click();
				}, 500);
				
			});


			/**
			 * When clicked on the Pause button.
			 */
			jQuery( document ).on( 'click', "input[name='srfl_puase']", function() {
				pauseQuiz();
			});

			/**
			 * When clicked on the Resume button.
			 */
			jQuery( document ).on( 'click', "input[name='srfl_unpuase']", function() {
				unPauseQuiz();
			});

			/**
			 * When windows is resized.
			 */
			jQuery( window ).resize( function () {
			    setDimensions( 'window_resize' );
			});
		}
	} );


	/**********************************************************************
		Common functions >>>>>>>>>>
	**********************************************************************/

	/**
	 * Triggers ajax request to save the quiz progress.
	 */
	function saveProgress() {
		
		if ( true == srfl_js_object.save_resume_setting ) {

			var post_data = {
				'action': 'srfl_save_quiz_progress',
				'user_id': srfl_js_object.user_id,
				'course_id': srfl_js_object.course_id,
				'pro_quiz_id': srfl_js_object.pro_quiz_id,
				'auth': srfl_js_object.nonce,
				'quiz_answers': quizAnswers,
				'timer': jQuery.cookie( 'ldadv-time-limit-' + srfl_js_object.user_id + '-' + srfl_js_object.pro_quiz_id ),
				'reviewed_answers': window.srflReviewedItems,
				'current_question': jQuery( "li.wpProQuiz_reviewQuestionTarget" ).index()
			};

			progressAjaxRequest = jQuery.ajax( {
				type: "POST",
				url: srfl_js_object.ajax_url,
				dataType: "json",
				cache: false,
				data: post_data,
				beforeSend : function()    {           
			        if( progressAjaxRequest != null ) {
			            progressAjaxRequest.abort();
			        }
			    },
				error: function( jqXHR, textStatus, errorThrown ) {
					//TD-395: Implement Re-try Functionality for Quiz Submissions to avoid Frozen Results Page
					if(textStatus == 'error'){
						jQuery(document).one( 'click', "input[name='next'], input[name='check']", function() {
						$('.learndash-wrapper').append("<div id='td_srfl_error_message' class='td_rtf_error_message'><div class='td_srfl_error_message'><div class='td_srfl_re_try'></div><p> Oops! Something went wrong. Please try again.</p> <br> <input type='button' class='td_srfl_error_message_button' value='Try Again' onClick='window.location.reload()' id='td_srfl_retry'><br> </div></div>");
						
					var td_rtf_error_message = document.getElementById("td_srfl_error_message");
					var next = document.getElementsByName("next");
					var check_button_review_mode = document.getElementsByName("check");
					var span = document.getElementsByClassName("close")[0];
						
					next.onclick = function(){
						td_rtf_error_message.style.display = "block";
					}
					
					check_button_review_mode.onclick = function(){
						td_rtf_error_message.style.display = "block";
					}
					
					window.onclick = function(event){
					 if (event.target == td_rtf_error_message){
						td_rtf_error_message.style.display = "none";
					 }
					}
					});
					};
					//End TD-395: Implement Re-try Functionality for Quiz Submissions to avoid Frozen Results Page
				},
				success: function( reply_data ) {
					// Progress saved successfully.
				},
				timeout: 60000 // we wait for 1 minute.
			} );
		}
	}

	/**
	 * Display's the summary when Pause is called.
	 */
	function pauseQuiz() {
		pauseStatus = true;

		var ansQuestions    = 0;
		var unansQuestions  = 0;
		var reviewQuestions = 0;
		var count = 0;

		jQuery.each( window.srflReviewedItems, function( index, question ) {
			if ( true == question.solved ) {
				ansQuestions++;
				//return; // We are not counting the questions in review total which are solved.
			}
			if ( true == question.review ) {
				reviewQuestions++;
			}
		} );

		unansQuestions = window.srflReviewedItems.length - ansQuestions;

		jQuery(".total_questions").html( window.srflReviewedItems.length );
		jQuery(".ans_questions").html( ansQuestions );
		jQuery(".unans_questions").html( unansQuestions );
		jQuery(".review_questions").html( reviewQuestions );

		var remTimeSec = jQuery.cookie( 'ldadv-time-limit-' + srfl_js_object.user_id + '-' + srfl_js_object.pro_quiz_id )
		
		/**
		 * Pause on Review Mode
		 * Remove countdown timer if in review mode.
		 */

		if(window.tdQuizConfig === 1) {
			jQuery(".rem_time").html( secondsToHms( remTimeSec ) );
		} else {
			jQuery(".rem_time__cont").remove();
		}

		setDimensions( srfl_js_object.pro_quiz_id );
		overlayFadeIn();

		saveProgress();

		pauseInterval = setInterval(function(){
			pauseTimer++;
			if ( ! hasPauseWorking() ) {
				// alert("no cheating");
			}
		}, 1000);
	}

	/**
	 * Unpause the quiz.
	 */
	function unPauseQuiz() {

		pauseStatus = false;

		clearInterval(pauseInterval);

		if ( pauseTimer > -1 ) {
			location.reload();
		} else {
			pauseTimer = 0;
			overlayFadeOut();
		}
	}

	/**
	 * Checks if the user is cheating. That is looking at the questions by pausing the quiz.
	 * @return bool true if the user is not cheating.
	 */
	function hasPauseWorking() {
		var status = true;
		if ( true === pauseStatus ) {
			$overlay = jQuery("#srfl_question_overlay");

			if ( $overlay.length == 0 ) { // If the overlay is deleted.
				status = false;
			} else if ( 1 != $overlay.css("opacity") ) { // Of changes are in opacity.
				status = false;
			} else if ( "visible" != $overlay.css("visibility") ) { // if visibility is changed.
				status = false;
			} else if ( "block" != $overlay.css("display") ) { // if display is changed.
				status = false;
			}
		}
		return status;
	}

	/**
	 * set element 'value' attributes.
	 * @param  jquery el    jQuery element.
	 * @param  string value Value to be set.
	 */
	function changeButtonNames( el, value ) {
		el.attr('value', value);
	}

	/**
	 * Set dimentions to the overlay element.
	 *
	 * @param int proQuizId Pro Quiz ID.
	 */
	function setDimensions(proQuizId) {

		if ( 'window_resize' == proQuizId ) {
			proQuizId = jQuery( "#srfl_question_overlay" ).attr( 'data-pro_quiz_id' );
		}

		if ( null == proQuizId || 'undefined' == proQuizId ) {
			return;
		}

		$el = jQuery( "#wpProQuiz_" + proQuizId );

		if(null == $el || 'undefined' == $el) {
			return;
		}

		jQuery( "#srfl_question_overlay" ).css({
			top     : $el.offset().top,
			width   : $el.outerWidth(),
			height  : $el.outerHeight(),
			left 	: $el.offset().left,
		});
		jQuery( "#srfl_question_overlay" ).attr( 'data-pro_quiz_id', proQuizId );
	}

	/**
	 * Fade's in overlay.
	 */
	function overlayFadeIn() {
		jQuery("#srfl_question_overlay").fadeIn();
	}

	/**
	 * Fade's out overlay.
	 */
	function overlayFadeOut() {
		jQuery("#srfl_question_overlay").fadeOut();
	}

	/**
	 * Convert seconds to hours:minutes:seconds
	 * @param  number d Seconds.
	 * @return string   hours:minutes:seconds.
	 */
	function secondsToHms(d) {
	    d = Number(d);
	    var h = Math.floor(d / 3600);
	    var m = Math.floor(d % 3600 / 60);
	    var s = Math.floor(d % 3600 % 60);

	    var hDisplay = h > 9 ? h : '0' + h;
	    var mDisplay = m > 9 ? m : '0' + m;
	    var sDisplay = s > 9 ? s : '0' + s;

	    // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	    // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	    return hDisplay + ':' + mDisplay + ':' + sDisplay; 
	}

})(jQuery);