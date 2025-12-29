/* This is your custom Javascript */

(function ($) {

    "use strict";

    /**
     * Encapsulate JS setInterval function to create function to detect its status
     * @param fn
     * @param time
     */
    function Interval(fn, time) {
        var timer = false;
        this.start = function () {
            if (!this.isRunning())
                timer = setInterval(fn, time);
        };
        this.stop = function () {
            clearInterval(timer);
            timer = false;
        };
        this.isRunning = function () {
            return timer !== false;
        };
    }
	

    window.BuddyBossThemeChild = {
        init : function () {
            this.removeUnusedStorage();
            this.arrangeQuizResultsOrder();
            this.promoCountdownTimer();
            this.popupSalesBanner();
            this.promoHeaderStrip();
            this.filterQuizStatistics();
            this.customQuizScroll();
            this.removeNotificationBar();
            this.promoBundleHandler();
            this.refundPolicyPopup();
            this.rearrangeCourseListOptions();
            this.courseProgressPagination();
            this.updateCoursePriceBasedonCartPrice();
            this.updateCourseProgressDropdown();
            this.addUSDsuffix();
            this.styleHotspotInput();
            this.styleHotspotInputInFinalQuiz();
            this.moveFirstReply();
			this.updateCartURL();
			this.searchBar();
        },
        arrangeQuizResultsOrder : function() {

            const quizBox = $('.ld-quiz-list');

            //CHECK IF PAGE HAS QUIZ BOX
            if ( !quizBox.length ) {
                return;
            }

            //LOOP THROUGH EACH QUIZ LIST OF EACH COURSE
            $.each(quizBox, function() {

                //Create an object for all quiz elements
                const quizzes = $(this).find('.ld-table-list-items').children();;

                // Create an array of objects that contains d)ate and the quiz element
                let results = [];

                $.each(quizzes, function(){

                    let quizObject = {};

                    $(this).find('.ld-column-label').remove();

                    quizObject.date = Date.parse($(this).find('.ld-table-list-column-date').text());

                    quizObject.el = $(this);

                    results.push(quizObject);
                
                });

                //Remove the Content of Quizzes
                quizzes.remove();

                //Sort the Array
                const sortedQuizzes = results.sort(function( a, b ) {
                    return b.date - a.date;
                });

                //Append the Sorted ArrayQuizzes
                $.each(sortedQuizzes, (key, val) => {
                    $(this).append(val.el);
                });

            });


        },
        promoCountdownTimer : function () {

            if(!$('.promo-countdown').length || typeof PHP_VARS == 'undefined') {     
                return;
            }
			
			/*
			 *  Hotfix for the popup modal NOT showing even after expiry.
			 *  This removes the expired "tdPopupExpiryDate" in the user's browser local storage.
			 */
			
			if ( (Date.now() - localStorage.getItem('tdPopupExpiryDate')) > 0){
     			
				// Show the value of the current tdPopupExpiryDate
				// console.log('tdPopupExpiryDate (Epoch format) : ' + localStorage.getItem('tdPopupExpiryDate'));
				// console.log('tdPopupExpiryDate: ' + new Date(parseInt(localStorage.tdPopupExpiryDate)));
 				
				localStorage.removeItem('tdPopupExpiryDate');
				
 				// console.log('tdPopupExpiryDate has been deleted!');
     			// console.log('tdPopupExpiryDate NOW: ' + localStorage.getItem('tdPopupExpiryDate'));
			}
                     
            let arr = PHP_VARS.expiryDate.split(' ').join('T') + ':00+08:00';            

            let countDownDate = new Date(arr);

            function prependZero( number ) {
        
                let two_digit = '';
    
                if( number < 10 ) {
                    two_digit = '0';    
                } 
    
                return two_digit + number.toString(); 
            }
            
            let el_days = $('.days');
            let el_hours = $('.hours');
            let el_minutes = $('.minutes');
            let el_seconds = $('.seconds');
        
            let clock = setInterval(function() {
                let now = new Date().getTime();
                let distance = countDownDate - now;

                if (distance < 0) {
                    
                    $('.promo-countdown').html("SORRY! PROMO HAS ENDED");

                    localStorage.removeItem('tdPopupExpiryDate');
                    localStorage.removeItem('hideHeaderStrip');
                    $('.price').html('<span class="woocommerce-Price-amount amount">' + $( '.woocommerce-Price-amount').html() + '</span>');

                    clearInterval(BuddyBossThemeChild.checkIfYouCanShowPopup);
                    let waitTime = setTimeout(function() {
                        $('.promotion-header').fadeOut(function(){
                            $(this).remove();
                        });
                        $('.promo-countdown').fadeOut(function(){
                            $(this).remove();
                        });
// 						TD-479: Automatically hide notification bar and pop-up after the Sale Expiry Date
						$('.popup.active').fadeOut(function(){
                            $(this).remove();
                        });
    
                    },3000);

                    clearInterval(clock);
                }
                
                // TD-645: Change the countdown timer to show only the hours instead of days
				if (excludeDays.timer_popup !== '1') {
					// Time calculations for days, hours, minutes, and seconds
					let days = Math.floor(distance / (1000 * 60 * 60 * 24));
					let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					let seconds = Math.floor((distance % (1000 * 60)) / 1000);

					// DISPLAY TIME ON PROPER BOXES
					el_days.html(prependZero(days));
					el_hours.html(prependZero(hours));
					el_minutes.html(prependZero(minutes));
					el_seconds.html(prependZero(seconds));
				} else {
					let hours = Math.floor(distance / (1000 * 60 * 60));
					let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					let seconds = Math.floor((distance % (1000 * 60)) / 1000);

					// DISPLAY TIME ON PROPER BOXES
					el_hours.html(prependZero(hours));
					el_minutes.html(prependZero(minutes));
					el_seconds.html(prependZero(seconds));
				}
				// End - TD-645: Change the countdown timer to show only the hours instead of days
        
            }, 1000);

        },
        popupSalesBanner : function () {

            if(!$('.popup').length) {
                return;
            }

            let now = Math.floor(new Date());

            const tdPopupExpiryDate = parseInt(Math.floor(localStorage.getItem('tdPopupExpiryDate')));
            
            if( typeof(localStorage) && (localStorage.getItem('tdPopupExpiryDate') === 'undefined' || tdPopupExpiryDate <= now || localStorage.getItem('tdPopupExpiryDate') === null) ) {

                let secondsSinceLastActivity = 0;
            
                let maxInactivity = (30);
                
                /*let checkIfYouCanShowPopup = setInterval(function(){

                    secondsSinceLastActivity++;

                    if(secondsSinceLastActivity > maxInactivity){

                        let currentTime = new Date();
                        
                        currentTime.setDate(currentTime.getDate() + 2);
                        
                        $('.popup').addClass('active');

                        //ADD 3 DAYS TO EXPIRY DATE IF BLANK OR TIMER JUST EXPIRED
                        localStorage.setItem('tdPopupExpiryDate', currentTime.getTime().toString());

                        clearInterval(checkIfYouCanShowPopup);

                    }
                }, 1000);*/
                
                //let checkIfYouCanShowPopup = setTimeout( function(){
                
                	if( typeof(localStorage) && (localStorage.getItem('tdPopupExpiryDate') === 'undefined' || localStorage.getItem('tdPopupExpiryDate') === null) ) {
                        let currentTime = new Date();
                        
						// ADD 7 DAYS TO EXPIRY DATE IF BLANK OR TIMER JUST EXPIRED
                    	currentTime.setDate(currentTime.getDate() + 2);
                        
                    	$('.popup').addClass('active');

                    	// Add the modified tdPopupExpiryDate in the browser local storage
                    	localStorage.setItem('tdPopupExpiryDate', currentTime.getTime().toString());
						
						 // Auto-close the popup after 20 seconds
							setTimeout(function () {
							  $('.popup').removeClass('active');
							}, 20000); // 20 seconds 
						 // Auto-close the popup after 20 seconds
						
                    }
               
				// Show pop-up 3 seconds after load
				// TD-186 - lower down the pop-up time    
                //}, 3000);
                
                function activity(){
                    secondsSinceLastActivity = 0;
                }
                
                var activityEvents = [
                    'mousedown', 'mousemove', 'keydown',
                    'scroll', 'touchstart'
                ];
                
                activityEvents.forEach(function(eventName) {
                    document.addEventListener(eventName, activity, true);
                });

            }

            $('.popup .dashicons-dismiss').on( 'click', function() {
                $('.popup').removeClass('active');
            })

        },
        promoHeaderStrip : function () {

            if(!$('.promotion-header').length){
                return;
            }
            
            if( typeof(localStorage) && localStorage !== 'undefined') {

                //IF NOT EXPIRED OR BLANK
                if( localStorage.getItem('hideHeaderStrip') === 'undefined' || localStorage.getItem('hideHeaderStrip') === null)  {
                    $('.promotion-header').addClass('active');
                } else {
                    $('.promotion-header').remove();
                }

                $('.promotion__link').on('click', '.dashicons-dismiss', function (e){
                    e.preventDefault();
                    e.stopPropagation();
                    
                    localStorage.setItem('hideHeaderStrip', 1);
                
                    $('.promotion-header').remove();
                
                });
				
				//TD-108: Make Every Row of Table Clickable

				const rows = document.querySelectorAll('tr[data-href]');
					
				rows.forEach(function(row){
					row.addEventListener("click", () => {
						window.location.href = row.dataset.href;
					});
				});


            }
        },
        removeUnusedStorage : function () {

            /* TO DO REMOVE LOCAL STORAGE IF NOT NEEDED*/
            
            if( typeof(localStorage) && localStorage.getItem('tdPopupExpiryDate') !== 'undefined' && typeof PHP_VARS === 'undefined') {
                localStorage.removeItem('tdPopupExpiryDate');
            }

            if( typeof(localStorage) && localStorage.getItem('hideHeaderStrip') !== 'undefined'  &&  typeof PHP_VARS === 'undefined') {
                localStorage.removeItem('hideHeaderStrip');
            }

        },
        filterQuizStatistics : function () {

            if ( !$('.wpProQuiz_modal_window').length ) {
                return;
            }

            //NEW ARRAY OF OBJECTS FOR LOADED QUIZ STATISTICS TABLE
            let dataArray = [];

            //SET DEFAULT FILTERS
            let questionFilters = {
                viewall : true,
                correct : false,
                incorrect: false,
                skipped: false,
                review: false,
                category : 'all'
            };

            //CLEAR INTERVAL VARIABLE TO EXECUTE AFTER QUIZ STATISTICS TABLE IS LOADED
            let checkQuizDisplay;

            //INITIATE FILTERS
            function initFilters () {

                //ADD THIS FILTER SECTION                
				if (
					(window.location.pathname.indexOf("/courses/") !== -1 && window.location.pathname.indexOf("/lessons/") === -1) ||
					window.location.pathname.indexOf("/my-dashboard/") !== -1
				) { // TD-1296 (Added by JR): The "Show All Categories" should be visible on both the courses and my-dashboard pages.
					$('.wpProQuiz_modal_window').prepend(`
						<div class="wpProQuizCustomized_filters">
							<span class="wpProQuizCustomized_filters__title">FILTERS: </span>
							<select name="wpProQuizCustomized_filters" id="js-quizfilter-category" class="wpProQuizCustomized_filter btn--disabled">
								<option value="all">Show All Categories</option>
							</select>
							<select id="js-quizfilter-questions"  class="wpProQuizCustomized_filter btn--disabled">
								<option>Filter Questions</option>
							</select>     
						</div>
					`);
				}
				
				if (window.location.pathname.indexOf("/courses/") != -1 && window.location.pathname.indexOf("/lessons/") != -1) { // TD-1296 (Modified by JR): Removed the "Show All Categories" on the lessons page.
					$('.wpProQuiz_modal_window').prepend(`
						<div class="wpProQuizCustomized_filters">							
							<select id="js-quizfilter-questions"  class="wpProQuizCustomized_filter btn--disabled">
								<option>Filter Questions</option>
							</select>     
						</div>
					`);
				}
       
                //WAIT FOR QUIZ STATISTICS AJAX REQUEST TO FINISH
                checkQuizDisplay = setInterval( function() {

                    //TERMINATE WAIT TIME IF TABLE IS AVAILABLE                    
					if( $('#wpProQuiz_user_content table').length || $('#wpProQuiz_user_content .non-table-statistic').length ) { // TD-1296 (Modified by JR): Ensures that "Filter Questions" works properly with non-table format.

                        //CREATE AN ARRAY FOR FILTER
                        let quizTable = $('#wpProQuiz_user_content table tbody tr');

                        let type = "", currentCategory = "", currentAnswer = "";
                            
                        //LOAD OPTIONS TO CATEGORY SELECT ELEMENT
                        let categoryArray = [];

                        quizTable.each(function(index){

                            let rowInfo = {};

                            let isCategoryRow = $(this).hasClass('categoryTr') && $(this).find('th span:last-child').text() !== 'Sub-Total: ' ? true : false;

                            let isSubTotalRow = $(this).hasClass('categoryTr') && $(this).find('th span:last-child').text() === 'Sub-Total: ' ? true : false
                            
                            let isQuestionRow = $(this).find('.statistic_data').length ? true : false;

                            let isAnswerRow = $(this).find('ul.wpProQuiz_questionList').length ? true : false;

                            let hasReviewFlag = $(this).hasClass('reviewFlagged');

                            if (isCategoryRow) {
                                type = "category";
                                currentCategory = $(this).find('th span:last-child').text();
                                categoryArray.push(currentCategory);
                                currentAnswer = '';
                            } else if (isSubTotalRow) { 
                                type = "subtotal";
                                currentAnswer = '';
                            } else if (isQuestionRow) {
                                type = "question";
                                let isCorrect, isIncorrect;

                                //CHECK IF QUESTION AND ANSWER IS CORRECT, SKIPPED, OR INCORRECT
                                isCorrect = $(this).find('th:nth-child(5)').text() === '0'  ? true : false;

                                isIncorrect = $(this).next().find('.wpProQuiz_questionList .wpProQuiz_answerIncorrect').length ? true : false;

                                    if(isCorrect && !isIncorrect) {
                                        currentAnswer = 'correct';
                                    } else if(!isCorrect && !isIncorrect) {
                                        currentAnswer = 'skipped';
                                    } else {
                                        currentAnswer = 'incorrect';
                                    }

                            } else if (isAnswerRow) {
                                type = "answer";
                            } else {
                                type ="blank"
                                currentAnswer = '';
                            }

                            rowInfo.answer = currentAnswer;
                            rowInfo.category = currentCategory;
                            rowInfo.type = type;
                            rowInfo.review = hasReviewFlag;

                            dataArray.push(rowInfo);

                        });
                        
                        $('.wpProQuizCustomized_filter').removeClass('btn--disabled');
                        $('.btn--filter').addClass('btn--filter--selected');

                        //ADD THE CATEGORIES TO CATEGORY SELECT BOX
                        let catIndex = 0;
                        for(catIndex = 0; catIndex < categoryArray.length; catIndex++){
                            let option = `<option value="${categoryArray[catIndex]}">${categoryArray[catIndex]}</option>`;
                            $("#js-quizfilter-category").append(option);
                        }

                        $('#js-quizfilter-category').select2({minimumResultsForSearch: Infinity});

                        //ADD FILTERS TO QUESTION FILTERS                        
						if (
							(window.location.pathname.indexOf("/courses/") !== -1 && window.location.pathname.indexOf("/lessons/") === -1) ||
							window.location.pathname.indexOf("/my-dashboard/") !== -1
						) { // TD-1296 (Added by JR): The "Skipped" and "Marked for Review" should visible on both the courses and my-dashboard pages.
							$('#js-quizfilter-questions').attr("multiple", "multiple");
							$('#js-quizfilter-questions').html(`
								<option value="viewall" selected><i></i>View All Questions</option>
								<option value="correct">Correct</option>
								<option value="incorrect">Incorrect</option>
								<option value="skipped">Skipped</option>
								<option value="review">Marked for Review</option>
							`);
						}
						
						if (window.location.pathname.indexOf("/courses/") != -1 && window.location.pathname.indexOf("/lessons/") != -1) { // TD-1296 (Added by JR): Removed "Skipped" and "Marked for Review" filters from the Lessons page.
							
							$('#js-quizfilter-questions').attr("multiple", "multiple");
							$('#js-quizfilter-questions').html(`
								<option value="viewall" selected><i></i>View All Questions</option>
								<option value="correct">Correct</option>
								<option value="incorrect">Incorrect</option>                            
							`);
							
							// Filter functionality - correct, incorrect, viewall
							$('#js-quizfilter-questions').on('change', function () {
								var selectedValue = this.value; // Get the selected value								

								// Reset all questions to be visible before applying the new filter
								var allQuestions = document.getElementsByClassName('nts_listItem');
								for (var i = 0; i < allQuestions.length; i++) {
									allQuestions[i].style.display = 'block'; // Reset display to block for all questions
								}

								// Check the selected filter and adjust visibility
								if (selectedValue === 'correct') {									

									// Hide incorrect answers by removing their display
									var incorrectElements = document.getElementsByClassName('wpProQuiz_response incorrect');
									for (var i = 0; i < incorrectElements.length; i++) {
										var parentElement = incorrectElements[i].closest('li');
										if (parentElement) {
											parentElement.style.display = 'none'; // Hide the parent <li> for incorrect answers
										}
									}

									// Show only correct answers
									var correctElements = document.getElementsByClassName('wpProQuiz_response correct');
									for (var i = 0; i < correctElements.length; i++) {
										var parentElement = correctElements[i].closest('li');
										if (parentElement) {
											parentElement.style.display = 'block'; // Show the parent <li> for correct answers
										}
									}
								}
								else if (selectedValue === 'incorrect') {
									
									// Hide correct answers by removing their display
									var correctElements = document.getElementsByClassName('wpProQuiz_response correct');
									for (var i = 0; i < correctElements.length; i++) {
										var parentElement = correctElements[i].closest('li');
										if (parentElement) {
											parentElement.style.display = 'none'; // Hide the parent <li> for correct answers
										}
									}

									// Show only incorrect answers
									var incorrectElements = document.getElementsByClassName('wpProQuiz_response incorrect');
									for (var i = 0; i < incorrectElements.length; i++) {
										var parentElement = incorrectElements[i].closest('li');
										if (parentElement) {
											parentElement.style.display = 'block'; // Show the parent <li> for incorrect answers
										}
									}
								}
								else if (selectedValue === 'viewall') {									

									// Show both correct and incorrect answers
									var allElements = document.getElementsByClassName('wpProQuiz_response');
									for (var i = 0; i < allElements.length; i++) {
										var parentElement = allElements[i].closest('li');
										if (parentElement) {
											parentElement.style.display = 'block'; // Show the parent <li> for both correct and incorrect answers
										}
									}
								}
								else {									

									// Default: Show all questions (both correct and incorrect)
									var allElements = document.getElementsByClassName('wpProQuiz_response');
									for (var i = 0; i < allElements.length; i++) {
										var parentElement = allElements[i].closest('li');
										if (parentElement) {
											parentElement.style.display = 'block'; // Show all questions
										}
									}
								}
							});
						}


                        $('#js-quizfilter-questions').select2({
                            dropdownCssClass: "questionsfilter-dropdown",
                            closeOnSelect: false,
                            templateResult: formatState
                        });                        

                        $("#js-quizfilter-questions+.select2-container--default .select2-selection--multiple").html('<span>Filter Questions</span><i class="bb-icon-filter"></i>')
                                                
                        clearInterval(checkQuizDisplay);
                    
                    }

                }, 100);

            }

            //RESET FILTERS WHEN STAT MODAL IS CLOSED
            function resetFilters () {
                //REMOVE FILTERS AND TABLE
                $('.wpProQuizCustomized_filters').remove();
                $('#wpProQuiz_user_content').html('');
            
                //RESET TABLE VARIABLES
                dataArray = [];
                questionFilters = {
                    viewall: true,
                    correct : false,
                    incorrect : false,
                    skipped : false,
                    review: false,
                    category : 'all'
                };

                clearInterval(checkQuizDisplay);
            }

            //FILTER THE TABLE BASED ON FILTER AVAILABLE
            function filterTable () {

                $("#wpProQuiz_user_content").fadeOut(100, function(){
                    
                    let categoryFilter = questionFilters.category;
                    let correctFilter = questionFilters.correct;
                    let incorrectFilter = questionFilters.incorrect;
                    let skippedFilter = questionFilters.skipped;
                    let viewallFilter = questionFilters.viewall;
                    let reviewedFilter = questionFilters.review;

                    //CREATE AN ARRAY FOR FILTER
                    let quizTable = $('#wpProQuiz_user_content table tbody tr');

                    quizTable.each(function(index){

                        let objCurrentRow = dataArray[index];
                            
                        $(this).addClass('hide');
                                                
                        //CHECK IF CATEGORY ROW, SUBTOTAL, BLANK, QUESTION, OR ANSWER
                        if( objCurrentRow.type === 'category' || objCurrentRow.type === 'subtotal' ||  objCurrentRow.type === 'blank' ) {
                            
                            //IF IT MATCHES THE CATEGORY OR IS ALL
                            if(objCurrentRow.category === categoryFilter ||  categoryFilter === 'all') {
                                $(this).removeClass('hide');
                            }

                        } else if( ( objCurrentRow.category === categoryFilter || categoryFilter === 'all' ) && ( objCurrentRow.type === 'question' || objCurrentRow.type === 'answer' ) ) {                            
                  
                            if( correctFilter === true && objCurrentRow.answer === 'correct' && ( (reviewedFilter === true && objCurrentRow.review === true) || reviewedFilter === false) ) {
                                $(this).removeClass('hide');
                            } 
                            
                            if ( incorrectFilter === true && (objCurrentRow.answer === 'incorrect' || objCurrentRow.answer === 'skipped') && ( ( reviewedFilter === true && objCurrentRow.review === true) || reviewedFilter === false) ) {
                                $(this).removeClass('hide');
                            } 
                            
                            if ( skippedFilter === true && objCurrentRow.answer === 'skipped' && ( ( reviewedFilter === true && objCurrentRow.review === true ) || reviewedFilter === false ) ) {
                                $(this).removeClass('hide');
                            }
                            
                            if(viewallFilter === true  && ( ( reviewedFilter === true && objCurrentRow.review === true ) || reviewedFilter === false ) ) {
                                $(this).removeClass('hide');
                            }
                            
                            if( correctFilter === false && incorrectFilter === false && skippedFilter === false && viewallFilter === false && ( reviewedFilter === true && objCurrentRow.review === true ) ) {
                                $(this).removeClass('hide');
                            }
                            
                            if( correctFilter === false && incorrectFilter === false && skippedFilter === false && viewallFilter === false && reviewedFilter === false) {
                                $(this).addClass('hide');
                            }
							
							/** 
							 * TD-1357: "View" result button does not work for HOTSPOT questions when a filter is applied
							 * Show answer row (containing .laq_hotspot_questions) only if the previous question row is visible
							 * Added by JR
							 */
							if (objCurrentRow.type === 'answer') {								
								// This ensures that answer rows are shown only when their corresponding question rows are visible after filtering.
								if ($(this).prev().hasClass('hide') === false) {
									$(this).removeClass('hide');
								}
							}
							/* TD-1357 - End */

                            // if( correctFilter === true && objCurrentRow.answer === 'correct') {
                            //     $(this).removeClass('hide');
                            // } 
                            
                            // if ( incorrectFilter === true && (objCurrentRow.answer === 'incorrect' || objCurrentRow.answer === 'skipped') ) {
                            //     $(this).removeClass('hide');
                            // } 
                            
                            // if ( skippedFilter === true && objCurrentRow.answer === 'skipped') {
                            //     $(this).removeClass('hide');
                            // }

                            // if(viewallFilter === true ) {
                            //     $(this).removeClass('hide');
                            // }

                            // if( correctFilter === false && incorrectFilter === false && skippedFilter === false && viewallFilter === false) {
                            //     $(this).addClass('hide');
                            // }

                        } else {
                            $(this).addClass('hide');
                        }

                    });

                    $(this).fadeIn();
                });
            }

            //SET ANSWER FILTER
            function setFilterAnswer( answer ) {

                //WHATEVER THE VALUE OF THE FILTER, REVERSE IT
                if(typeof answer === 'undefined' || answer === null) {
                    return {};
                } else if(answer === 'correct') {
                    questionFilters.correct = !questionFilters.correct;
                } else if(answer === 'incorrect') {
                    questionFilters.incorrect = !questionFilters.incorrect
                } else if(answer === 'skipped') {
                    questionFilters.skipped = !questionFilters.skipped;
                } else if(answer === 'review') {
                    questionFilters.review = !questionFilters.review;
                } else if(answer === 'viewall') {
                    questionFilters.viewall = !questionFilters.viewall;
                }
                
                filterTable();
            }

            //SET CATEGORY FILTER
            function setFilterCategory ( category ) {
                if( typeof category === 'undefined' || category === null ) {
                    return {};
                } else {
                    questionFilters.category = category;
                    filterTable();    
                }
            }

            //ADD ICONS IN QUESTION FILTER DROPDOWN
            function formatState ( state ) {
                if (!state.id) { return state.text; }
                let $newState = $('<i class="bb-icon-check-square-small"></i><span><span>');
                $newState.find('span').html(state.text);
                return $newState;
            } 

            $('body').on('click', '.user_statistic', function () {
                initFilters();
            });

            $('body').on('select2:select', '#js-quizfilter-questions', function(e){
                setFilterAnswer(e.params.data.id);
            });

            $('body').on('select2:unselect', '#js-quizfilter-questions', function(e){
                setFilterAnswer(e.params.data.id);
            });

            $('body').on('click', '#wpProQuiz_overlay_close', function () {
                resetFilters();
            });

            $('body').on('change', '#js-quizfilter-category', function () {
                setFilterCategory($(this).children("option:selected").val());
            });
        
        },
        customQuizScroll : function () {

            if( !$('.lms-topic-sidebar-wrapper ').length ) {
                return;
            }

            $(".lms-topic-sidebar-data").trigger("sticky_kit:detach");

            function init() {

                //CREATE SCROLLBARS 
                $('.lms-topic-sidebar-data').append(`
                    <div class="td-quiz-scrollContainer">
                        <div class="td-quiz-scroll">
                            <div class="td-quiz-scrollbar"></div>
                        </div>
                    </div>
                `);

                $('.bb-lms-title').wrapInner('<span class="bb-lms-title__overflow">').css({'display' : 'inline-block'});

                initScrollBar();

            }

            function initScrollBar ( thisObj ) {

                //FIND THE LONGEST TOPIC ON EACH LESSON
                let scrollWidth = 0;
                let scrollContainer = 0;

                $('.bb-lms-title__overflow').clone().appendTo('body').css({
                    'display'   : 'block',
                    'position'  : 'absolute',
                    'right'     : '-100%' 
                }).each(function(){
                    let currentWidth = $(this).outerWidth() + 70;
                    scrollWidth = (currentWidth > scrollWidth) ? currentWidth : scrollWidth;  
                }).remove();

                $('.bb-lesson-head').clone().appendTo('body').css({
                    'display'   : 'block',
                    'position'  : 'absolute',
                    'right'     : '-100%' 
                }).each(function(){
                    let currentWidth = $(this).outerWidth();
                    scrollContainer = (currentWidth > scrollContainer) ? currentWidth : scrollContainer;  
                }).remove();


                $('.td-quiz-scroll').css({
                    'width' : scrollContainer
                });
        
                $('.td-quiz-scrollbar').css({
                    'width': scrollWidth
                });
                
            }

            //WHEN SCROLLBAR IS DRAGGED
            let lastLeftLocation = 0;
            function dragScrollBar () {

                lastLeftLocation = $('.td-quiz-scroll').scrollLeft() ;
                let adjustment = ( lastLeftLocation - ( lastLeftLocation * 2 ) ) ;
                
                $('.bb-lms-title__overflow').css({
                    'transform' : `translateX(${adjustment}px)` 
                });

            }

            //INITIALIZE SCROLLBAR
            init();
                        
            $('.td-quiz-scroll').on('scroll', function() {
                dragScrollBar();
            });                

        },
        removeNotificationBar : function () {
            //REMOVE NOTIFICATION BAR AFTER 30 SECONDS
            if ( $('#wpfront-notification-bar-spacer').length ) {
                
                setTimeout(function() {

                    if ( $('#wpfront-notification-bar-spacer').length ) {
                        $('#wpfront-notification-bar-spacer').remove();
                    }

                },30000);

            }

        },
        promoBundleHandler : function () {

            if (! $(".td_promo").length) {
                return;
            }

            //CALCULATE VALID ITEMS FOR PROMO
            function calcItemsValidForPromo() {
            
                displayDiscountDetails( parseInt($('.default-header .itemsValidForPromo').text() ));

            }

            //PROMO SUGGESTION LOGIC
            function displayDiscountDetails ( item_count = 0 ) {
                
                let discountID, discount, suggestion;
				//TD-124: Update Bulk Discounts
				const discounts = [10, 12, 14, 16, 18, 20, 22]
                //const discounts = [10, 15, 18, 21, 24, 26, 30];
                //const discounts = [15, 19, 23, 27, 32, 36, 40];
                //const discounts = [22, 25, 28, 32, 37, 41, 45];
                const upArrow = $('.dashicons-arrow-up');
                const downArrow = $('.dashicons-arrow-down');

                if (item_count < 2) {
                    discountID = 0;
                    suggestion = 2;
                    downArrow.addClass('invisible');
                } else if (item_count >= 7) {
                    discountID = 6;
                    suggestion = 8;
                    upArrow.addClass('invisible');
                } else {
                    discountID = item_count - 1;
                    suggestion = item_count + 1;
                    upArrow.removeClass('invisible');
                    downArrow.removeClass('invisible');
                }
                discount = discounts[discountID];
                
                $('.js-course-text').html(suggestion);
                $('.js-bundle-discount').html(discount);

            }

            calcItemsValidForPromo();


            //CONTINOUSLY CHECK FOR NEW ITEMS IN CART
            let cartItemCount = 0;
            if ($('.count').length) {
                cartItemCount = parseInt($('.count').text());
            }

            let cartWatch = setInterval(function(){

                if ($(".bb-icon-shopping-cart + .count").length) {
    
                    let current_cartItems = parseInt($('.count').text());
    
                    //CALCULATE VALID PRODUCTS
                    if ( current_cartItems !== cartItemCount ) {
                        calcItemsValidForPromo();
                    }
    
                    cartItemCount = current_cartItems;
    
                }
                
            }, 100);
            

            //CHECK FOR PROMO IF WE ADD A PRODUCT
            $('body').on('click', '.js-courseAdd',function (){
                let currentSuggestion = parseInt($('.js-course-text').text());
                displayDiscountDetails(currentSuggestion);
            });

            //CHECK FOR PROMO IF WE ADD A PRODUCT
            $('body').on('click', '.js-courseSubtract', function (){
                let currentSuggestion = parseInt($('.js-course-text').text());
                displayDiscountDetails (currentSuggestion - 2);
            });

        },
        refundPolicyPopup : function () {

            if( !$('.smart_refunder').length ) {
                return;
            }
            
            //CREATE INTERVAL VARIABLE FOR BACKGROUND CLOSE
            let waitForBgClose = new Interval(function(){

                if( !$('.TB_overlayBG').length && $('.srf-reminders').length ) {
                    $('body .srf-reminders').remove();
                    waitForBgClose.stop();
                }

            }, 100);

            //EVENT LISTENER FOR REQUEST REFUND BUTTON
            $('body').on('click', '.smart_refunder', function() {

                // WAIT FOR THE PAGE TO LOAD

                const tmpltRefund = `
                    <div class="srf-reminders">
                        <h3 class="srf-reminders__heading">
                            Kindly read our policies before applying for a refund.
                        </h3>
                        <div class="srf-reminders__desc">
							<div class="srf-reminders__desc__head">For video course:</div>
                            <ul>
                                <li>A full refund can be requested within 7 days of purchase.</li>
                            </ul>
                            <div class="srf-reminders__desc__head">For practice exams:</div>
                            <ul>
                                <li>A full refund can be requested within 15 days of purchase as long as you have not attempted more than two practice tests from the course content.</li>
                                <li>A 50% refund can be requested within 15 days of purchase if you have attempted more than two but less than five practice tests from the course content.</li>
                                <li>If you have attempted five or more practice tests then you are no longer eligible for a refund.</li>
                            </ul>
                            <div class="srf-reminders__desc__note">
                                <span><i class="bb-icon-info-circle"></i> Note:</span> This includes tests in Timed Mode, Review Mode, Section-Based Tests, Topic-Based Tests (for Solutions Architect Associate), and the Final Test. Repeating a previously attempted test will also add to the attempt count.
                            </div>
                        </div>
                        
                        <div class="srf-reminders__desc">                    
                            <div class="srf-reminders__desc__head">For downloadable products such as eBooks:</div>
                            <ul>
                                <li>A full refund can be requested within 15 days of purchase as long as you have not downloaded the eBook/s.</li>
                            </ul>
                        </div>
    
                        <div class="srf-reminders__agree">
                            <input type="checkbox" id="srf-reminders__agree__btn">
                            <label for="srf-reminders__agree__btn">I have understood the refund policy and confirm that I am eligible for a refund</label>
                        </div>
                        <button class="srf-reminders__proceed srf-reminders__proceed--disabled" disabled>Proceed</button>
                    </div>`;

                //Run background detection timer
                waitForBgClose.start();

                //WAIT FOR POPUP BEFORE LOADING 
                let waitForRefundPopup = setInterval(function() {
                
                    if($('.TB_overlayBG').length) {
                        $('body .TB_overlayBG').after(tmpltRefund);
                        clearInterval(waitForRefundPopup);
                    }

                }, 100);
                
            });

            //Handle agree button toggle
            $('body').on('change', '#srf-reminders__agree__btn', function() {

                let proceedBtn = $('.srf-reminders__proceed');

                proceedBtn.toggleClass('srf-reminders__proceed--disabled');

                if( proceedBtn.hasClass('srf-reminders__proceed--disabled') ) {
                    proceedBtn.prop('disabled', true);
                } else {
                    proceedBtn.prop('disabled', false);
                }

            });


            //Remove refund reminders and show refund box
            $('body').on('click', '.srf-reminders__proceed', function() {
                $('.srf-reminders').remove();
                $('#TB_window').addClass('active');
                
                //clearInterval for waitForBgClose
                if (waitForBgClose.isRunning()) {
                    waitForBgClose.stop();
                }

            });
        },
        rearrangeCourseListOptions : function () {

            if( !$('#ld_course_categorydropdown_select').length ) {
                return;
            }

            $('#ld_course_categorydropdown_select option').each(function() {

                const str = $(this).text();
                
                if ( str.includes('AWS Practice Exams') ) {
                    $(this).clone().insertAfter('#ld_course_categorydropdown_select option:first');
                    $(this).remove();
                }

            }); 
        },
        courseProgressPagination: function() {
            
            /**
             * Paginate Quiz Attempts
             * Add pagination on courses with higher than 10 quiz attempts
            */

            let progressBar = $(".ld-course-list"); 
            
            if( !progressBar.length ) {
                return;
            }

            //SIZE OF PAGINATION
            const PAGE_SIZE = 5;

            // This will initialize the number of paging on each courses
            function initQuizAttemptsPagination() {
            
                let courses = $("#ld-profile .ld-item-list-item-course");

                //GET PAGE NUMBERS
                courses.each(function(index){

                    let thisCourse = $(this);

                    let quiz_attempts = thisCourse.find('.ld-quiz-list .ld-table-list-item');

                    let quiz_attempts_count = quiz_attempts.length;

                    //COURSE NAME FOR CONSOLE
                    let quiz_name = thisCourse.find('.ld-item-name').text();

                    quiz_attempts.each( function(index) {
                        if(index >= PAGE_SIZE) {
                            $(this).css({'display': 'none'});
                        }
                    });

                    //RENDER PAGINATION AFTER LAST ELEMENT
                    if( quiz_attempts_count >= PAGE_SIZE ) {

                        let pageCount = Math.ceil( quiz_attempts_count / PAGE_SIZE );

                        let paginateElements = '';

                        if ( pageCount > 1 ) {

                            for( let indexPageCount = 1; indexPageCount <= pageCount; indexPageCount++ ) {
                            
                                let currentPageClass = '';
                                if( indexPageCount === 1 ) {
                                    currentPageClass = 'course-progress-paging__page--current';
                                }
    
                                if(indexPageCount <= PAGE_SIZE) {
                                    paginateElements += `<button class="course-progress-paging__page course-progress-paging__page--${indexPageCount} ${currentPageClass}" data-pagenumber="${indexPageCount}">${indexPageCount}</button>`;
                                }
                            
                            }
    
                            //ADD NEXT BUTTON
                            if(pageCount > PAGE_SIZE) {
                                paginateElements += `<button class="course-progress-paging__next">></button>`;
                            }
    
                            paginateElements = `<div class="course-progress-paging">${paginateElements}</div>`
    
                            thisCourse.find('.ld-quiz-list').append(paginateElements);

                        }

                    }

                });

            

            }

            initQuizAttemptsPagination();


            let quizPaginate = {
                element: [],
                paginateBox: [], 
                courseBox: [], 
                pageNumber : [],
                quizAttempts: [],
                pageCount: [],
                init : function( thisElement ) {

                    this.element = thisElement;

                    this.paginateBox = this.element.closest('.course-progress-paging');
                    
                    this.courseBox = this.element.closest('.ld-item-list-item-course');

                    if( typeof thisElement.data('pagenumber') !== 'undefined' ) {
                        this.pageNumber =  this.element.data('pagenumber');
                    }

                    this.quizAttempts = this.element.closest('.ld-item-list-item-course').find('.ld-quiz-list .ld-table-list-item');

                    this.pageCount = Math.ceil( this.quizAttempts.length / PAGE_SIZE );

                },
                selectPage : function( thisElement ) {

                    this.init( thisElement );

                    // if(typeof this.pageNumber !== 'undefined') {
                    //     return;
                    // }

    
                    this.quizAttempts.hide();
                    
                    this.paginateBox.find('.course-progress-paging__page').removeClass('course-progress-paging__page--current');
                    
                    this.element.addClass('course-progress-paging__page--current');

                    let pageNumber = this.pageNumber;
    
                    this.quizAttempts.each( (index ) => {
                        
                        if( index >= (pageNumber*PAGE_SIZE - PAGE_SIZE) && index < pageNumber*PAGE_SIZE ) {
                            this.quizAttempts.eq(index).show();
                        }
    
                    });

                },
                next: function( thisElement ) {

                    this.init( thisElement );

                    if(typeof this.pageNumber === 'undefined') {
                        return;
                    }

                    let lastPage = this.paginateBox.find('.course-progress-paging__page').last().data('pagenumber');
                    
                    let paginateElements = '<button class="course-progress-paging__back"><</button>';

                    let pageNumbersCreated = 0; 

                    for(let indexPageCount = lastPage+1; indexPageCount <= this.pageCount; indexPageCount++) {

                        if( pageNumbersCreated === PAGE_SIZE ) {
                            paginateElements += `<button class="course-progress-paging__next">></button>`;
                            break;
                        }

                        let currentPageClass = '';
                        if( indexPageCount === lastPage + 1 ) {
                            currentPageClass = 'course-progress-paging__page--current';
                        }
                    
                        paginateElements += `<button class="course-progress-paging__page course-progress-paging__page--${indexPageCount} ${currentPageClass}" data-pagenumber="${indexPageCount}">${indexPageCount}</button>`;

                        pageNumbersCreated++;

                    }

                    this.paginateBox.html(paginateElements);

                    this.selectPage($(`.course-progress-paging__page--${lastPage+1}`));

                },
                back: function( thisElement ) {
                    
                    this.init( thisElement );

                    let firstPage = this.paginateBox.find('.course-progress-paging__page').first().data('pagenumber');

                    console.log(firstPage);
                    
                    let paginateElements = '';

                    if( firstPage !== PAGE_SIZE + 1){
                        paginateElements += '<button class="course-progress-paging__back"><</button>';
                    }

                    for(let indexPageCount = firstPage-PAGE_SIZE; indexPageCount < firstPage; indexPageCount++) {
                        
                        let currentPageClass = '';
                        if( indexPageCount === firstPage - 1 ) {
                            currentPageClass = 'course-progress-paging__page--current';
                        }

                        paginateElements += `<button class="course-progress-paging__page course-progress-paging__page--${indexPageCount} ${currentPageClass}" data-pagenumber="${indexPageCount}">${indexPageCount}</button>`;
                    }

                    paginateElements += '<button class="course-progress-paging__next">></button>';

                    this.paginateBox.html(paginateElements);

                    this.selectPage($(`.course-progress-paging__page--${firstPage-1}`));


                }
            };
            

            $('body').on('click', '.course-progress-paging__next', function(){

                quizPaginate.next( $(this) );

            });

            //
            $('body').on('click', '.course-progress-paging__back', function(){

                quizPaginate.back( $(this) );

            })


            //SELECT PAGE NUMBER BUTTON
            $('body').on('click', '.course-progress-paging__page', function() {

                quizPaginate.selectPage( $(this) );
                
            });

            $('body').on('click', '.ld-pagination-page-profile .next', function() {

                let waitProgressPaging = new Interval(function(){

                    initQuizAttemptsPagination();
                    waitProgressPaging.stop();

                }, 5000);
                
                waitProgressPaging.start();

            });

            $('body').on('click', '.ld-pagination-page-profile .prev', function() {

                let waitProgressPaging = new Interval(function(){

                    initQuizAttemptsPagination();
                    waitProgressPaging.stop();

                }, 5000);
                
                waitProgressPaging.start();

            });

            
        },
        updateCoursePriceBasedonCartPrice: function () {

            /**
             * Fix - Update product price when bundle deal is active
             * If item is in cart and bundle deal is active, price 
             * should show the price in cart and not the potential discount price.
             */

			//ONLY APPLY THIS FIX ON SHOP PAGE
// 			if( window.location.pathname!== '/shop/'){
// 			  return;
// 			}
			
            //CHECK IF MINI CART EXISTS
            if( !$(".header-mini-cart").length ) {
                return;
            }

            //SHOULD CONTAIN product_id
            let cartProducts = [];
            
            function updateCartProductsObject(){

                let miniCartProducts = $(".site-header-container .header-mini-cart .woocommerce-mini-cart li");

                if( miniCartProducts.length === cartProducts.length ) {
                    return;
                }

                //Empty cartProducts array
                cartProducts = [];
                
                //REMOVE ALL PRICING OVERLAY TO RENDER NEW ONES
                if( $('price-overlay') ) {
                    $('.price-overlay').remove();
                }

                miniCartProducts.each(function(index) {
                    
                    let cartProduct = {};

                    let cartProduct_id = $(this).find('.remove_from_cart_button').data('product_id');
                    
                    //GET PRICE HTML
                    let cartProduct_price = $(this).find('.quantity > span').html();
                    if( $(this).find('.quantity > div').length ) {
                        cartProduct_price = $(this).find('.quantity > div').html();
                    }

                    cartProduct.price = cartProduct_price;
                    cartProduct.id = cartProduct_id;
                    cartProduct.class= `.post-${cartProduct_id}`;
                    
                    cartProducts.push(cartProduct);
					
					// Prevents updating items in the cart that has already 'FREE' label with $0.00
					let findFree = $(this).find('.quantity > span > bdi').text();
					
					if(findFree === "$0.00"){
						return;
					}
					
					// TD-131 - Fix Product page price overlay
					if(window.location.href.includes('/product/')) {
						
						$(`.post-${cartProduct_id} .entry-summary .price`).append(`<div class="price price-overlay">${cartProduct_price}</div>`);

					} 

					else{

						$(`.post-${cartProduct_id} .price`).append(`<div class="price price-overlay">${cartProduct_price}</div>`);

					}
					
					

                });

            }

            //INITIATE
            updateCartProductsObject();


            //WATCH FOR CHANGES, SAVE INFORMATION TO NEW OBJECT
            let watchCartUpdate = new Interval(function(){

                let miniCartProducts = $(".site-header-container .header-mini-cart .woocommerce-mini-cart li");

                if( miniCartProducts.length !== cartProducts.length ) {
                    updateCartProductsObject();
                }

            }, 500);

            watchCartUpdate.start();

        },
        updateCourseProgressDropdown: function(){
            
            /**
              * Add feature - Set the dropdown function in Progress Bar as "expanded" by default
            */

             if( !$(".single-sfwd-courses .ld-item-list-item-expanded").length){
                 return;
             }
             

            // START - Added by Jon
            let watchProgressBar = new Interval( function() {
                
                let progressBar = $('#ld-profile');

                if ( progressBar.length !== 0 ) {
                    
                    document.querySelector('.ld-icon-arrow-down').click();
                    
                    watchProgressBar.stop();

                }

            }, 500);
            
            watchProgressBar.start();
            
            //document.querySelector('.ld-icon-arrow-down').click();
            // End - Added by Jon


            const expand = document.querySelector('.ld-item-list-item-expanded');

            expand.style.MaxHeight = "649px";

        },
        addUSDsuffix: function(){
            /**
            * Add USD suffix on product prices
            */

            if( !$(".single").length && !$(".page").length && !$(".archive").length){
                return; 
            }

            $('.amount').after( ' USD' );
        },
        styleHotspotInput: function() {

            //Add input type for hotspot questions.
            if( !$('.laq_hotspot_input').length ) {
                return;
            }

            $('.laq_hotspot_input').iCheck({
                checkboxClass: 'icheckbox_minimal',
                radioClass: 'iradio_minimal'
            }).on('ifChanged', function (e) {
                $(e.currentTarget).trigger('change');
            });

        },
        styleHotspotInputInFinalQuiz : function() {

            $( document ).on( 'bbchild_render_final_quiz_hotspot_questions', function() {

                $('.laq_hotspot_input').iCheck({
                    checkboxClass: 'icheckbox_minimal',
                    radioClass: 'iradio_minimal'
                }).on('ifChanged', function (e) {
                    $(e.currentTarget).trigger('change');
                });

            } );                        

        },
        moveFirstReply: function () {

            $('.bs-single-forum-list .bbp-reply-position-1').parent().insertAfter('.bs-header-item');
 
            $('.bb-single-reply-list').css({
                'display' : 'block'
            });

        },
		updateCartURL: function () {
			 
			 if( !$(".page-id-24792").length){
				return;
				}
				history.pushState({}, null, 'https://portal.tutorialsdojo.com/cart/');
		 },
		searchBar: function () {
			
                if( !$(".single").length && !$(".page").length && !$(".archive").length && !$(".search").length ){
                    return; 
                }
    
                // Toggle Search
                $( '.header-search-link' ).on(
                    'click',
                    function (e) {
                        e.preventDefault();
                        $( 'body' ).toggleClass( 'search-visible' );
                        if ( ! navigator.userAgent.match( /(iPod|iPhone|iPad)/ )) {
                            setTimeout(
                                function () {
                                    $( 'body' ).find( '.header-search-wrap .search-field-top' ).focus();
                                },
                                90
                            );
                        }
                    }
                );
    
                $( '.header-search-wrap .search-field-top' ).focus(
                    function () {
                        if ( ! navigator.userAgent.match( /(iPod|iPhone|iPad)/ )) {
                            var $input = this;
                            setTimeout(
                                function () {
                                    $input.selectionStart = $input.selectionEnd = 10000;
                                },
                                0
                            );
                        }
                    }
                );
    
                // Hide Search
                $( '.close-search' ).on(
                    'click',
                    function (e) {
                        e.preventDefault();
                        $( 'body' ).removeClass( 'search-visible' );
                        $( '.header-search-wrap input.search-field-top' ).val( '' );
                    }
                );
    
                $( document ).click(
                    function (e) {
                        var container = $( '.header-search-wrap, .header-search-link' );
                        if ( ! container.is( e.target ) && container.has( e.target ).length === 0) {
                            $( 'body' ).removeClass( 'search-visible' );
                        }
                    }
                );
    
                $( document ).keyup(
                    function (e) {
    
                        if (e.keyCode === 27) {
                            $( 'body' ).removeClass( 'search-visible' );
                        }
                    }
                );
                
            }
        
    }
	
	 /* 
     * TD-217 - Show spinner / loading message
     * 
     * Works in:
     *
     * https://portal.tutorialsdojo.com/courses/(any)
     * https://portal.tutorialsdojo.com/courses/(any)/lessons/(any)
     * 
     */
		function showSpinnerWhileLoading(page) {
		
			var clickElements, appendToElement, hideElement;
			
			if( page == 'coursepage' ){
				clickElements = $('.ld-table-list-title, .ld-item-title, .learndash_join_button, .ld-course-title, .ld-topic-title');
				appendToElement = '.ld-lesson-list';
				hideElement = '.ld-item-list-items, .bb-about-instructor, #course-reviews-section';
			}else{
				clickElements = $('.learndash_next_prev_link, .lms-quiz-item, .lms-topic-item, .ld-table-list-item, .bb-lesson-head');
				appendToElement = '#learndash-page-content';
				hideElement = '.learndash-wrapper';
			}
	    
			
			clickElements.on('click', function(event){
				
				//  TD-273: Prevent the Spinner to show if the CTRL button is press
				if ( event.ctrlKey || event.shiftKey || macKeys.shiftKey || event.metaKey  ) {
					return;
				}
				
  				if(!clickElements){
					return;
				}
				
				let clickedElement = $(event.target).closest('.ld-item-list-item').find('.lms-is-locked-ico');
				
				if(event.target.nodeName == 'A'){
					var buttonSpinner = document.createElement('span');
					buttonSpinner.setAttribute("id", "buttonSpinner");
					$('.learndash_join_button > a').prepend(buttonSpinner);
					clickElements = "";
					return;
				}
				
				if(!document.querySelector('.learndash-course-student-message') && clickedElement.length){
					return;
				}
				
				var loaderContainer = document.createElement('div');
				loaderContainer.setAttribute("id", "spinner");
  
				var loader = document.createElement('div');
				loader.setAttribute("id", "loader");
				
				if( $('body').hasClass('bb-dark-theme') ){
					
					loader.style.border = '4px rgba(255, 255, 255, 0.50) solid';
					loader.style.borderTop = '4px black solid';
					
				}
				
				loaderContainer.append(loader);
				loaderContainer.append(" Please wait while the content is being loaded...")
  				
				
				
				$($(`${appendToElement}`)).append(loaderContainer);
				
				
				$($(`${hideElement}`)).hide();
				
				clickElements = "";
				
				return;
			});
			return;
        }

    $(document).on('ready', function(){
        BuddyBossThemeChild.init();
		
				
		// TD-204 - Show spinner
	    // showSpinnerWhileIFrameLoads();
		
		// TD-217 - Show spinner / loading message
		
		/*
	    if (window.location.href.indexOf("courses") != -1){
			
			if(document.querySelector('.bb-learndash-content-wrap')){
				showSpinnerWhileLoading('coursepage');
			}else{
				showSpinnerWhileLoading('lessonpage');
			}
		}else{
			return;
		}
		*/
		
    });

    
    $(document).on('resize', function(){

    });
	
	 $(document).on('resize', function(){

    });
	
	// TD-99 - Auto Load WooCommerce Product Gallery on Hover 
    $(window).on('load', function(){
		
		if (window.location.href.indexOf("product") != -1) {
		
			$('.flexslider').flexslider({
        		animation: "fade",
        		controlNav: "thumbnails",
        		start: function (){
        		}
      		});

      		$(".flex-control-thumbs li img").hover(function(){
        		$(this).click();
      		});
		}
		
		/* 
		 * TD-40: Auto Play Vimeo in TD Video Course 
		 */

			
		setTimeout(function() {

			if (window.location.href.indexOf("topic") != -1 || window.location.href.indexOf("lesson") != -1){

				window.scrollBy(0, 100);
							
   				var iframe = document.getElementsByName('fitvid0')[0];
			
				if( iframe == null || iframe == undefined ){
									
					let count = 1;
				
					while (count < 101){							
							iframe = document.getElementsByName('fitvid0')[0];
						
							if (iframe){							
								break;
							}
							count++;
					}
				
					// Don't proceed if the Vimeo iFrame is not found/loaded					
					return;
				}
		
				const player = new Vimeo.Player(iframe);
				if (isToggleActive) {
				player.play().then(function() { 			  		
				}).catch(function(error) { 			  	    
				});
				}
			
			
				player.on('play', function() {    				
				if (isToggleActive) {
					player.requestFullscreen().then(function() {     					
 					}).catch(function(error) {
						//error found
					});
				}
				});
			
			
				player.getMuted().then(function(muted) {
    				if (muted){
						player.setMuted(false);
					}			 
				});
				
				
				player.enableTextTrack('en').then(function() {					
				}).catch(function(error) {					
				});
			

				player.on('ended', function() {     				
					player.exitFullscreen().then(function() {						
						if (isToggleActive) {
						setTimeout(function() {
     						document.querySelectorAll(".next-link")[0].click();
							document.querySelectorAll(".learndash_mark_complete_button")[0].click();
						}, "1000");
						}
 					}).catch(function(error) {						
					});
				});
			}
		}, "1000");
		
		
    });

	 /* 
     * TD-204 - Show spinner / loading message
     * 
     */
	function showSpinnerWhileIFrameLoads() {
 		var iFramelLoaderContainer = document.createElement('div');
 		iFramelLoaderContainer.setAttribute("id", "iFrameLoader");
 	    var iframe = $('iframe');
    	 	if (iframe.length && window.location.href.indexOf("lesson") != -1) {
    	     $(iframe).before('<div id=\'iFrameLoader\'></div>');	
 			$(iframe).on('load', function() {
             document.getElementById('iFrameLoader').style.display='none';
         	});
     	}
		
		/* Remove iFrameLoader in aws-cloud-practitioner-essentials */
		if (iframe.length && window.location.href.indexOf("courses/aws-cloud-practitioner-essentials") != -1) {
             document.getElementById('iFrameLoader').style.display='none';         	
		}
		
 		if( $('body').hasClass('bb-dark-theme') ){
 					
 					iFrameLoader.style.border = '4px rgba(255, 255, 255, 0.50) solid';
 					iFrameLoader.style.borderTop = '4px black solid';
 					
		}
	 }
	
/* * 
 * TD-751 Start - Toggle that allows users to enable/disable the auto-play feature for all video courses.	
 * */
	
	// Declare variables at the top level to make them global
	let isToggleActive = localStorage.getItem('isToggleActive') === 'true';
	let toggleBtn;

	document.addEventListener("DOMContentLoaded", function () {
		// Check if the current URL contains any of the specified strings in this regex
		var regex_course = /\/courses\/(.+)-video-course\//;

		// Check if the URL also contains specific query parameters
		const hasSpecificParameters = (
		  window.location.href.includes("lesson") ||
		  window.location.href.includes("topic")
		);

		// Check if the DOM contains an iframe
		const hasIframe = document.querySelector("iframe");
				
		if (regex_course.test(window.location.href) && hasSpecificParameters != window.location.href.includes("flash-cards") && hasIframe) {

			// Creating Auto play toggle section/ button
			const ld_tabs_content = document.querySelector(".ld-tabs-content");

			if (ld_tabs_content) {
			  // Create a new div at the top of ld-tabs-content
			  const newDiv = document.createElement("div");
			  
			  /* TD-818: Add "Auto Play" label on the video section*/
			  const autoPlayIcon = document.createElement("img");
			  autoPlayIcon.src = "https://media.tutorialsdojo.com/public/td_autoPlay_icon.png"; 
			  autoPlayIcon.classList.add("autoPlayIcon"); 

			  newDiv.appendChild(autoPlayIcon);	
			  newDiv.appendChild(document.createTextNode("Auto Play"));
			  newDiv.classList.add("autoplay-section");
                /* END TD-818: Add "Auto Play" label on the video section*/
				
			  ld_tabs_content.insertBefore(newDiv, ld_tabs_content.firstChild);

			  toggleBtn = document.createElement("div");
			  toggleBtn.classList.add("toggle");	  	  
			  newDiv.appendChild(toggleBtn);

			  // Update toggle state based on local storage
			  if (isToggleActive) {
				toggleBtn.classList.add("active-toggle");
			  }

			  toggleBtn.addEventListener("click", () => {
				toggleBtn.classList.toggle("active-toggle");
				isToggleActive = toggleBtn.classList.contains("active-toggle");

				// Update tooltip text based on toggle state
				tooltipDiv.textContent = isToggleActive ? "Auto play is on" : "Auto play is off";

				// Save the updated setting to local storage
				localStorage.setItem('isToggleActive', isToggleActive.toString());
			  });

			  // Data-Tooltip
			  let tooltipDiv = document.createElement("div");
			  tooltipDiv.classList.add("tooltip");
			  tooltipDiv.textContent = isToggleActive ? "Auto play is on" : "Auto play is off";
			  toggleBtn.appendChild(tooltipDiv);

			  // Event listener for changes in the localStorage key
			  window.addEventListener('storage', (event) => {
				if (event.key === 'isToggleActive') {
				  isToggleActive = event.newValue === 'true';

				  // Update toggle state based on local storage
				  if (isToggleActive) {
					toggleBtn.classList.add("active-toggle");
				  } else {
					toggleBtn.classList.remove("active-toggle");
				  }
					// Update tooltip text based on toggle state
				  tooltipDiv.textContent = isToggleActive ? "Auto play is on" : "Auto play is off";
				}
			  });
			}
		}
	});
	
/* * 
 * End - TD-751	
 * */
	
	
    /** TD-874: Temporarily Hide the YouTube videos on Practice Exams and its corresponding Video Title
	 *
jQuery(document).ready(function($) {
	if (!window.location.href.includes("practice-exams")) {
    	return;
	}
		console.log('Temporarily hide YT videos');
	var tdYTvids = document.getElementsByClassName('bb-video-wrapper');

	for (let i = 0; i < tdYTvids.length; i++) {
  		tdYTvids[i].previousElementSibling.style.display = 'none';
  		tdYTvids[i] = tdYTvids[i].style.display = 'none';
		console.log('Removed: ' + i);
	}
	

});

	** TD-874: Temporarily Hide the YouTube videos on Practice Exams and its corresponding Video Title
	 * */
	
	
	
	/** TD-803: Automatic submission of quizzes within the time limit is not working in Final Test Mode.
	 * 	This will hide the Pause Button for all courses in Final Test mode.
	 * */
	document.addEventListener("DOMContentLoaded", function() {
		if (!window.location.href.includes("final-test")) {
		return;
		}
		const startQuizButton = document.querySelector('input[name="startQuiz"]');
		if (!startQuizButton) {
			return;
		}
		startQuizButton.addEventListener("click", function() {
			const pauseButton = document.querySelector('input[name="srfl_puase"]');
			if (pauseButton) {
				pauseButton.style.display = "contents";
			}
		});
	});
	/** END - TD-803: Automatic submission of quizzes within the time limit is not working in Final Test Mode
	 * */
    
	/*TD-573: Subscription model - billed monthly or annually*/
jQuery(document).ready(function($) {
	
	if(window.location.href.includes("/billing-account/view-subscription")) {
		
    // Check if the cancellation success flag is present in sessionStorage
    var cancellationSuccess = sessionStorage.getItem('cancellationSuccess');
	
    // If the flag is present, show the success dialog and remove the flag
    if (cancellationSuccess) {
        showSuccessDialog();
        sessionStorage.removeItem('cancellationSuccess');
    }

    // Initialize the jQuery UI dialog
    var dialog = $("#td_cancel-subscription").dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 585,
        title: "Are you sure you want to cancel this subscription?",
        open: function(event, ui) {
            $(".ui-widget-overlay").on('click', function() {
                dialog.dialog("close");
            });

            // Button click handlers
            $("#td_confirm-cancel").on('click', function() {
                // User confirmed, proceed with cancellation using AJAX
                var cancelUrl = $(this).data("url");
                $.ajax({
                    url: cancelUrl,
                    method: 'POST',
                    success: function(response) {
                        // Handle successful cancellation
                        sessionStorage.setItem('cancellationSuccess', 'true');
                        window.location.reload();
                    }
                });
            });

            $("#td_cancel-action").on('click', function() {
                // User canceled, close the dialog
                dialog.dialog("close");
            });
        },
        close: function() {
            // Cleanup when the dialog is closed
            dialog.dialog("close");
        }
    });

    // Remove the close button (X button)
    $(".ui-dialog-titlebar-close").remove();

    // Click event for cancel links
    $("td.subscription-actions a.cancel, table.shop_table.subscription_details a.cancel").on('click', function(e) {
        e.preventDefault();

        // Get the cancellation URL and store it in data attribute
        var cancelUrl = $(this).attr("href");
        $("#td_confirm-cancel").data("url", cancelUrl);

        // Open the dialog
        dialog.dialog("open");
    });

    // Function to show a success dialog
    function showSuccessDialog() {
        var successDialog = $("<div>").html("<p>Your subscription has been successfully cancelled. You still have access until the end of your subscription date and you can reactivate your account anytime.</p>").dialog({
            modal: true,
            title: "We're sorry to see you go",
            resizable: false,
            buttons: {
                OK: function() {
                    // Close the success dialog
                    successDialog.dialog("close");
                }
            },
            close: function() {
                // Cleanup when the dialog is closed
                successDialog.dialog("close");
            }
        });
    }
}
});
 /* END-TD-573: Subscription model - billed monthly or annually*/
	
/* * 
   * TD-790 Start - Create a UI for Playground Sandbox.	
   * */
//Popup message fo order confirmation, redirecting user to Lab Library or Sandbox
document.addEventListener('DOMContentLoaded', function () {
    var tdpopupLink = document.querySelector('a[href="#TDproductPopup"]');
    var tdpopup = document.querySelector('#TDproductPopup');
    var td_close = document.querySelector('.td-popup-mess');
  
    if (tdpopupLink) {
      tdpopupLink.addEventListener('click', function (e) {
        e.preventDefault(); // prevent the default behavior of the link
        tdpopup.style.display = 'flex';
      });
    }
  
    if (td_close) {
      td_close.addEventListener('click', function () {
        tdpopup.style.display = 'none';
      });
    }
  });
  /* * 
 * End - TD-790	
 * */
	/**
	 * TD-807: Play Cloud 2: Disable the "Minimize/Maximize sidebar" button on PlayCloud Sandbox/ Hands-On Labs
	 * */
	jQuery(document).ready(function($) {
		if(window.location.href.includes("/courses/playcloud-sandbox-aws/lessons/")) {
		
		var minimizeButton = document.querySelector('.header-minimize-link.course-toggle-view');

			if (minimizeButton) {
				minimizeButton.addEventListener('click', function(e) {
					e.preventDefault();
					e.stopPropagation();				
				}, true);
			}
			
		var maximizeButton = document.querySelector('.header-maximize-link.course-toggle-view');

			if (maximizeButton) {
				maximizeButton.addEventListener('click', function(e) {
					e.preventDefault();
					e.stopPropagation();				
				}, true);
			}
			
			/** 
			 * Hide the Minimize/Maximize icon
			 * */ 
			var minimize_icon = document.getElementsByClassName('bb-icon-minimize');
			minimize_icon[0].style.display = 'none';
			
			var maximize_icon = document.getElementsByClassName('bb-icon-maximize');
			maximize_icon[0].style.display = 'none';
			
			/** 
			 * Prevent Default Scrolling Behavior
			 * */ 
			
			let preventScroll = function(e) {
				e.preventDefault();
				window.scrollTo(0, 0);
			}

			window.addEventListener('scroll', preventScroll, false);

			let detectScroll = function() {
				window.removeEventListener('scroll', preventScroll, false);
				window.removeEventListener('scroll', detectScroll, false);
			}

			window.addEventListener('scroll', detectScroll, false);

		}
	});

	/** 
	 * End - TD-807: Play Cloud 2: Disable the "Minimize/Maximize sidebar" button on PlayCloud Sandbox/ Hands-On Labs
	 * */
	
	// Automatically Launch the course for all the embedded AWS ATP courses
	window.onload = function() {
	  if (document.getElementById('atp_launch_course') != null) {
		document.getElementById('atp_launch_course').click();
	  }
	};
	
	/** 
 	* TD-1203 - Drag and Drop WCAG Fix
 	*/
    document.addEventListener('DOMContentLoaded', () => {
        // Check if the current page is a practice exam (lesson or topic page)
        const isPracticeExamPage = window.location.href.includes("topic") || window.location.href.includes("lesson");
		const isCoursePage = window.location.href.includes("courses");

        if (!isPracticeExamPage) {
            //console.log('The page is NOT in practice exam. Bailing out now...');
            return; // Exit early if not on the correct page
        } else if (isCoursePage) {
			document.querySelectorAll('.ld-expand-button').forEach(btn => btn.click());
		} else {
              console.log('Loading practice exam...');
		}

       // console.log('The page is currently in practice exam');

        let selectedElement = null; // Track the selected draggable item

        document.addEventListener('keydown', (e) => {
            const activeEl = document.activeElement;

            // Early return if no element is focused
            if (!activeEl) return;

            if (e.key === 'ArrowRight') {
                e.preventDefault(); // Prevent default actions like scrolling

                // Handle the case when a draggable item is focused
                if (activeEl.classList.contains('wpProQuiz_sortStringItem')) {
                    // Deselect the previously selected item if it exists
                    if (selectedElement) {
                        selectedElement.setAttribute('aria-grabbed', 'false');
                        selectedElement.style.outline = ''; // Remove visual feedback
                    }

                    // Select the new item
                    selectedElement = activeEl;
                    selectedElement.setAttribute('aria-grabbed', 'true');
                    selectedElement.style.outline = '2px solid blue'; // Add visual feedback
                }
                // Handle the case when a drop zone is focused
                else if (activeEl.classList.contains('wpProQuiz_maxtrixSortCriterion') && selectedElement) {
                    // Prevent drop if the zone is already occupied
                    if (activeEl.children.length > 0) {
                        alert('This answer area already has an item. Please choose another answer area.');
                        return; // Prevent dropping the item
                    }

                    // Move the selected item to the drop zone
                    activeEl.appendChild(selectedElement);

                    // Reset the selected item state
                    selectedElement.setAttribute('aria-grabbed', 'false');
                    selectedElement.style.outline = '';
                    selectedElement = null;
                }
				else {
					const nextBtn = document.querySelector('input[name="next"]');
    				if (nextBtn) nextBtn.click();
				}
            }
			
			
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
				const backBtn = document.querySelector('input[name="back"]');
    			if (backBtn) backBtn.click();
			}
			
			
        });
	
	});
		
		
// 	document.addEventListener('DOMContentLoaded', function () {
//     // Check if the URL contains "playclouds"
//     	if (window.location.href.includes("playclouds")) {
//         	// Select the content wrapper in Focus Mode
//         	var contentWrap = document.querySelector('.ld-in-focus-mode .learndash-wrapper .learndash_content_wrap');

//         	// Apply the full-width style if the element exists
//         	if (contentWrap) {
//             	contentWrap.style.maxWidth = "100%";
//         	}
//     	}
// 	});
// 	

			
	
	// START - TD-1235: Add the "Your Progress" section inside the course
	document.addEventListener('DOMContentLoaded', function () {
    // Check if the URL contains "your-progress"
    	if (window.location.href.includes("your-progress")) {
		
		// Hide the default "Your Progress" header
		document.getElementById("your-progress").style.display = "none";
			
        // Expand the Quiz Attempts
        	setTimeout(function() {
				document.querySelectorAll(".ld-icon-arrow-down.ld-icon").forEach(
					function(button) {
   			 			button.click();
					}			
				);
        	}, 500 );
    	}
	});
	// END - TD-1235: Add the "Your Progress" section inside the course

	
	document.addEventListener('DOMContentLoaded', function () {
    // Check if the URL contains "azure-playcloud-labs"
    	if (window.location.href.includes("azure-playcloud-labs")) {
		    const AZURE_LABS_ORIGIN = "https://azurelabs.tutorialsdojo.com";
            const iframe = document.getElementById("azurelabsiframe");
			
            if (iframe) {
                iframe.onload = () => {
                    const portalCookies = document.cookie;
                    if (!portalCookies) {
                        console.log("No portal cookies found");
                        return;
                    }
					
                    iframe.contentWindow.postMessage(
                        { type: "transfer_cookie", data: portalCookies },
                        AZURE_LABS_ORIGIN,
                    );
                };
            }
    	} else if (window.location.href.includes("gcp-playcloud-labs")) {
			const GCP_LABS_ORIGIN = "https://gcplabs.tutorialsdojo.com";
            const iframe = document.getElementById("gcplabsiframe");
			
            if (iframe) {
                iframe.onload = () => {
                    const portalCookies = document.cookie;
					
                    if (!portalCookies) {
						console.log("no cookie");
                        return;
                    }
					
					console.log(portalCookies);
					
                    iframe.contentWindow.postMessage(
                        { type: "transfer_cookie", data: portalCookies },
                        GCP_LABS_ORIGIN,
                    );
                };
            }
			
		}
	});
	
	
	
	
	
	
	/** TD-1266: TD Content - Create a new functionality for "Case Study" questions */
document.addEventListener('DOMContentLoaded', function () {
    const caseStudyItems = document.querySelectorAll('.td-azure-case-study');

    caseStudyItems.forEach(caseStudy => {
        const rows = caseStudy.querySelectorAll('.td-azure-case-study-row');
        const contents = caseStudy.querySelectorAll('.td-azure-case-study-content');

        rows.forEach(row => {
            row.addEventListener('click', () => {
				// Remove active class from all rows
                rows.forEach(r => r.classList.remove('active'));
                // Add active class to the clicked row
                row.classList.add('active');
				
                // Remove active class from all content within this case study
                contents.forEach(content => content.classList.remove('active'));

                // Add active class to the corresponding content
                const contentId = row.getAttribute('data-content');
                const targetContent = caseStudy.querySelector(`#${contentId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    });
});
/** END - TD-1266 */
	
	
	
	/** 
 	* TD-1203 -Select TWO/THREE WCAG Fix
 	*/
    document.addEventListener('DOMContentLoaded', function () {
        // Check if the current page is a practice exam (lesson or topic page)
        if (!window.location.href.includes('topic') && !window.location.href.includes('lesson')) {
           // console.log('The page is NOT in practice exam. Bailing out now...');
            return; // Exit early if not on the correct page
        }

//         const codequestframe = document.getElementById("tdCodeQuest");

//         // Wait for iframe to load
//         if(codequestframe){
//         	iframe.onload = () => {
//            	   // Send cookies to iframe
//             	iframe.contentWindow.postMessage(
//                		{ cookie: document.cookie },
//                 		"https://codequest.tutorialsdojo.com" // target iframe origin
//             	);
//         	}
// 		};
		
		
      //  console.log('The page is currently in practice exam.');

        // Find all questions in the quiz
        const questions = document.querySelectorAll('.wpProQuiz_question');

        questions.forEach((question) => {
            // Get the question text and determine the selection limit
            const questionTextElement = question.querySelector('.wpProQuiz_question_text');
            if (!questionTextElement) return;

            const questionText = questionTextElement.textContent.trim();
            let selectionLimit = 0;

            // Determine the selection limit based on keywords in the question text
            if (/Select TWO|Choose Two/i.test(questionText)) {
                selectionLimit = 2;
            } else if (/Select THREE|Choose THREE/i.test(questionText)) {
                selectionLimit = 3;
            }

            // Only proceed if a selection limit is identified
            if (selectionLimit > 0) {
                const checkboxes = question.querySelectorAll('input[type="checkbox"]');

                checkboxes.forEach((checkbox) => {
                    checkbox.addEventListener('change', function () {
                        // Get the currently checked checkboxes within this specific question
                        const checkedCheckboxes = question.querySelectorAll('input[type="checkbox"]:checked');

                        // Enforce the selection limit
                        if (checkedCheckboxes.length > selectionLimit) {
                            this.checked = false;

                            // Remove `is-selected` class from the label when checkbox is selected but exceeds the limit
                            const label = this.closest('label');
                            if (label && label.classList.contains('is-selected')) {
                                label.classList.remove('is-selected');
                            }

                            alert(`You can only select ${selectionLimit} option${selectionLimit > 1 ? 's' : ''}.`);
                        }
                    });
                });
            }
        });
    });

	// TD-1371 Center the "Mark Complete" button for CodeQuest only
	function centerMarkCompleteButton() {
	  // Check if the current page URL is under the CodeQuest lessons path
	  if (window.location.pathname.includes('/courses/codequest-ai-powered-programming-labs/lessons/')) {
	  const container = document.querySelector('.learndash-wrapper .learndash_content_wrap .ld-content-actions');
	  if (container) {
		  container.style.justifyContent = 'center';
		}
	  }
		
	if (window.location.pathname.includes('/courses/playcode-ai-labs/lessons/')) {
	  const learndash_container = document.getElementById("learndash-page-content");
	  if (learndash_container) {
		  document.getElementById("learndash-page-content").style.padding="0px";
		  console.log('Full-Screen mode automatically enabled');
		}
	  }	
		
	}

	document.addEventListener('DOMContentLoaded', centerMarkCompleteButton);
	//End of TD-1371
	
	/** 
	 * TD-1296: Create New Version of View Results Page Aligned with Quiz Summary Design
	 * Disable horizontal (X-axis) scroll on the modal window (lessons page only).
	 * Added by JR
	 **/
	document.addEventListener("DOMContentLoaded", function() { 
		// Wait for the element with class 'user_statistic' (View result icon) to be clicked
		var ViewResultIcons = document.querySelectorAll('.user_statistic');

		// Check if the element exists
		if (ViewResultIcons.length > 0) {
			ViewResultIcons.forEach(function(icon) {
				icon.addEventListener("click", function(event) {					
					// Lessons page
					if (window.location.pathname.indexOf("/courses/") != -1 && window.location.pathname.indexOf("/lessons/") != -1) {	
						document.querySelector('.wpProQuiz_modal_window').style.overflowX = 'hidden'; // Disable horizontal scroll
					}					
				});
			});
		}		
	});
	// End - TD-1296
	
})(jQuery);