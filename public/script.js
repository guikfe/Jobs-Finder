/**
*** Developer: Guilherme K. Ferreira
*** First version: 02/08/2013 (friday)
**/

google.maps.visualRefresh = true;

var geocoder;
var map;
var infowindow;
var mc;
var oms;

function createGMaps() {
	geocoder = new google.maps.Geocoder();
	var myLatlng = new google.maps.LatLng(12.983,-67.676);
	var mapOptions = {
		zoom: 3,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: false,
		streetViewControl: false
	}

	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	// mc = new MarkerClusterer(map);
	oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied : true, circleSpiralSwitchover: 6 });

	infowindow = new google.maps.InfoWindow({content: "loading..."});

	$.get('/jobs', function(jobs) {
		setMarkers(jobs);
	});
}

function setMarkers(jobs) {
	for (var i=0; i<jobs.length; i++) {
		var job = jobs[i];

		setMarker(job);
	}

}

function setMarker(job) {
	var icon;

	if (job.category == 'programming') {
		icon = 'img/icons/programming.png';
	} else if (job.category == 'design') {
		icon = 'img/icons/design.png';
	} else if (job.category == 'business') {
		icon = 'img/icons/business.png';
	} else if (job.category == 'support') {
		icon = 'img/icons/support.png';
	}else {
		icon = 'img/icons/misc.png';
	}

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(job.lat, job.lon),
		title: job.startupname,
		map: map,
		icon: icon,
		job: job
	});

	oms.addMarker(marker);

	oms.addListener('click', function(marker, event) {
		var jobHtml = Mustache.render($('#job').text(), marker.job);
		infowindow.setContent(jobHtml);
		infowindow.open(map, marker);
	});
}

function codeAddress() {
  var address = document.getElementById('search-address').value;
  geocoder.geocode( {'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', createGMaps);

$(function() {

	var removeModal = function() {
		$('#modal').removeClass('md-show');
	};

	$('.add-job-btn').click(function(e) {
		var modal = $('#modal');
		if(modal.hasClass('md-show'))
			modal.removeClass('md-show')
		else
			modal.addClass('md-show');
	});

	$('.save-job-btn').click(function() {
		var startupName = $('#startup-name').val();
		var siteUrl = $('#site-url').val();
		var contact = $('#contact').val();
		var weAre = $('#we-are').val();
		var weWant = $('#we-want').val();
		var lon = $('.gllpLongitude').val();
		var lat = $('.gllpLatitude').val();

		$.post('/jobs', $('#job-form').serialize(), function () {
			removeModal();
			alert('Your job will be added as soon as possible!');
		}).fail(function() {
			alert('There was a problem while trying to send the request... try later or contact us.');
		});

		var selector = '#startup-name, #site-url, #contact, #we-are, #we-want, .gllpLatitude, .gllpLongitude';
		console.log($('#job-form').serialize());
	});

	$('.md-overlay, .md-close').click(function() {
		removeModal();
	});

	$('#search-address-btn').click(function() {
		codeAddress();
	});

});

// Search Address
var searchAddress = function(event) {
	if (event.keyCode == 13) {
		$('.gllpSearchButton').trigger('click');
		return false;
	}
}