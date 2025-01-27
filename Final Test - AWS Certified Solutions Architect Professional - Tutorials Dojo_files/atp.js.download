jQuery( document ).ready( function($) {
	
	if(!document.getElementById("atp_launch_course")){
		return;
	}
	
	let atp_course = document.getElementById("atp_launch_course");
	let loading_message = document.getElementById("loading-message");
	
	atp_course.addEventListener("click", function() {
		let course_url = atp_course.value;
		window.open(course_url, '_blank');
		atp_course.style.display = "none";
    	loading_message.style.display = "block";
	});
});