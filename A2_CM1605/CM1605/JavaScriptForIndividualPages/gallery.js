document.addEventListener('DOMContentLoaded', function() {
	let next = document.querySelector('.next')
	let prev = document.querySelector('.prev')

	next.addEventListener('click', function(){
		let items = document.querySelectorAll('.item')
		document.querySelector('.slide').appendChild(items[0])
	})

	prev.addEventListener('click', function(){
		let items = document.querySelectorAll('.item')
		document.querySelector('.slide').prepend(items[items.length-1]) // here the length of items = 6
	})
	function menuBar() {
            var nav = document.getElementById("right-nav");
            // Toggle .hidden class to show/hide the navigation links
            nav.classList.toggle("hidden");
              }
});