jQuery( document ).ready( function($) {
	if( $('body').hasClass('bb-dark-theme') ){
		$( '.spinner' ).children().css( 'background-color', 'white' );
	}
	
	if(!document.getElementById("startPlaycloud")){
		return;    
	}

	let playcloudType = document.getElementById("startPlaycloud").value;
	$('.awsUrl').attr("href", localStorage.getItem(`td-${playcloudType}-url`));
	
	function clock(expiry){
		setInterval(function() {
			let now = new Date().getTime();
			let timeDiff = expiry - now;
			
			function prependZero( number ) {
			let two_digit = '';
			if( number < 10 ) {
				two_digit = '0';   
			}
				return two_digit + number.toString();
			}
			let el_minutes = $('.minutes');
			let el_seconds = $('.seconds');
			
			if (timeDiff < 0) {
				$(".playcloud-countdown__timer").html("Please refresh the page to start again");
				clearInterval();
			}
			
			let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
			let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
			
			el_minutes.html(prependZero(minutes));               
			el_seconds.html(prependZero(seconds));
			}, 1000);
	}
	
	
	if ( (Date.now() - localStorage.getItem(`td-${playcloudType}`)) > 0 ){
		$('.playcloud-countdown__timer').hide();
		localStorage.removeItem(`td-${playcloudType}`);
		localStorage.removeItem(`td-${playcloudType}-url`);
	}
	
	
	else{
		var playcloudButton = document.getElementById("startPlaycloud");
		playcloudButton.parentNode.removeChild(playcloudButton);
		let playcloudExpiry = localStorage.getItem(`td-${playcloudType}`);
		clock(playcloudExpiry);
	}
	
	
	function playcloudCountdownTimer(){
		let minutesToAdd=15;
		let playcloudExpiry = new Date().getTime() + minutesToAdd * 60050; 
		localStorage.setItem(`td-${playcloudType}`, playcloudExpiry);
		clock(playcloudExpiry);
	}
	
	
	$( '#startPlaycloud' ).click( function( ) {
		
		
		$( '#startPlaycloud' ).hide();
		$( '.spinner, .spinner-caption' ).show();
		
		$.ajax({
			url: ajaxurl, // Since WP 2.8 ajaxurl is always defined and points to admin-ajax.php
			data: {
				'action':'playcloud_start_ajax',
				'type':playcloudType
			},
			success:function(data) {
				$( '.spinner, .spinner-caption' ).hide();
				if(data.includes('https://signin.aws.amazon.com')){
				
					playcloudCountdownTimer();
					// TD-194: Add 4 seconds delay
// 					setTimeout( async() => {await window.open(data)}, 4000);  
					setTimeout(() => {
					  console.log("Delayed for 3 seconds...");
						window.open(data);
					}, 3000); 					
// 					window.open(data);

					localStorage.setItem(`td-${playcloudType}-url`, data);
					$('.awsUrl').attr({
						href : localStorage.getItem(`td-${playcloudType}-url`),
						id : `td-${playcloudType}-url`
					});
					$('.playcloud-countdown__timer').show();
					var playcloudButton = document.getElementById('startPlaycloud');
					playcloudButton.parentNode.removeChild(playcloudButton);
				}
				else{
					$('#errorDisplay').show();
				}
				
			},  
			error: function(errorThrown){
			}
		});   
		

	});

	/*
	 *  TD-203: Add a functionality to allow users to manually end a PlayCloud lab  
	 */
	
	$( '#stopButton' ).click( function(){
		$( '.spinner, .spinner-stopping' ).show();
		$( '.cdCaption, .minutes-and-seconds, .stopPlaycloud, .reopen' ).hide();
		
		localStorage.removeItem(`td-${playcloudType}`);
		localStorage.removeItem(`td-${playcloudType}-url`);
		
		location.reload();
		
	});
	
	
});

				 