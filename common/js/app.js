
//Vérification de la connexion
function checkConnection() 
{
	test = navigator.onLine;
	return connectionStatus = navigator.onLine ? 'online' : 'offline';
}


function logout()
{
	setLocalStorage('login', '');
	localStorage.removeItem('pwd');
	localStorage.removeItem('token');
	callAnotherPage('login');
}

function startReady() 
{
	$('#head').load('header.html', function( response, status, xhr ) 
	{
		if ( status == "error" ) 
		{
		}
		else
		{
			$('#corps').load('modules/chargement.html');
		}
	});
};

function chargement_onDeviceReady()
{
	
	checkToken(function(session)
	{
		$('#checkAllStarterDebug').append('<div>Connection Internet : OK...</div>')
		starter_loadingBarre(50);
		if(session.call)
		{
			$('#checkAllStarterDebug').append('<div>Session : OK...</div>')
			starter_loadingBarre(100);
			$('#corps').css({"bottom":"50px"});
			$('#banner').css({"height":"50px"});
			$('#corps').load("modules/accueil.html");
			$('#banner').load("modules/banner.html");
		}
		else
		{
			$('#checkAllStarterDebug').append('<div>Session : Terminée</div>')
			starter_loadingBarre(60);
			connection_auto();
		}
	});	
}

function checkToken(callback)
{
	if(checkConnection() == 'online')
	{
		var token = getLocalStorage('token');
		$.ajax({
			ASYNC 	: false,
			type    : "POST",
			url     : "http://api.pdtdev.com/mobile.php",
			dataType: 'JSON',
			headers: {
				"X-PDT-App-Auth": token
			},
			success : callback
		});
	}
	else
	{	
		$('#corps').load('modules/error_horsConnection.html', function()
		{
			$('#corps').css({"bottom":"0px"});
			$('#banner').css({"height":"0px"});
		});
		return false;
		
	}
}


function starter_loadingBarre(perc)
{
	$('#loadingAllStarter_barInside').width(perc+"%");
}

function recoverPassword()
{
	var email = $('#email').val();
	
	if (!email)
	{
		
		$('#email').css({'border-bottom':'1px solid red'});
		$('#error_login').html('L\'adresse e-mail n\'est pas renseignée.');
		$('#error_login').show();

	}
	else
	{
		$('#error_login').hide();
		$('.input-container').hide();
		$('.button-container').hide();
		$('#login_forgotPassword_message').text('Votre demande a bien été prise en compte. Vous allez recevoir un nouveau mot de passe à l\'adresse mail indiquée.');
		var login = 'login';
		$('.formulaire_content').append('<div class="button-container">'+
		'<button type="button" value="back" id="log" onClick="callAnotherPage(\''+login+'\')"><img src="common/img/login_arrow.png" id="login_arrow" style="width: 25px; margin-right: 10px; -moz-transform: scaleX(-1);-o-transform: scaleX(-1);transform: scaleX(-1); filter: FlipH;-ms-filter: "FlipH";" /><span style="font-size:0.80em;">Revenir à la connexion</span></button>'+
		'</div>');
	}
	
}

function connection_auto(name)
{
	var login = getLocalStorage('login');
	var pwd = getLocalStorage('pwd');

	if (pwd)
	{
		starter_loadingBarre(70);
		$.ajax({
			type       : "POST",
			url        : "http://api.pdtdev.com/mobile.php",
			
			dataType   : 'JSON',
			headers: {
				"Authorization": "Basic " + btoa(login + ":" + pwd)
			},
			data : {autoPassword : pwd},
			success    : function(response) 
			{
				starter_loadingBarre(80);
				if(response.result.identification)
				{
					setLocalStorage('token',response.result.token);
					
					var token = getLocalStorage('token');

					if (response.result.token == token)
					{
						starter_loadingBarre(100);
						
						if(name)
						{
							$('#corps').load("modules/"+name+".html");
						}
						else{
							$('#corps').load("modules/accueil.html");
							$('#banner').load("modules/banner.html");
						}
					}
					else
					{
						$('#checkAllStarterDebug').show();
						$('#checkAllStarterDebug').append('<div>Erreur : 03</div>')
					} 
				}	
				else
				{
					$('#checkAllStarterDebug').show();
					$('#checkAllStarterDebug').append('<div>Erreur : 02 (changement de password entre le stockage mobile et la réalité </div>')
					// a rajouter rediection vers login
				}
			},
			error      : function(response) 
			{
				$('#checkAllStarterDebug').show();
				$('#checkAllStarterDebug').append('<div>Erreur : 01 -- ERREUR DE REQUETE SERVEUR</div>');
				
			}
		});
	}
	else
	{
		$('#checkAllStarterDebug').append('<div>Redirection vers LOGIN : En cours...</div>')
		starter_loadingBarre(100);
		
		callAnotherPage("login")
	}
}



function callAnotherPage(name)
{
	checkToken(function(session)
	{
		if(session.call)
		{

			switch (name)
			{
				
				case "accueil_actualite" :
				
				$('#sousPage').load("modules/"+name+".html");
				$('#banner').load("modules/banner.html");
				break;
				
				case "jobs" :
				$('#sousPage').load("modules/"+name+".html");
				$('#sousPage').css({'overflow':'hidden'});
				break;
				
				case "profil":
				$('#sousPage').load("modules/profil.html", function() 
				{
					var test = userInfos();
					var applicant = test.result.user.INFOS.applicant;
					var radar = test.result.user.INFOS.criterion;
					var experiences = test.result.user.INFOS.experiences.html;
					
					if(test.call)
					{
						$('#sousPage').css({'overflow':'hidden'});

						$('#name').append(" "+applicant.firstname+" "+applicant.name);
						
						$('#birthday').append(" "+applicant.date_birth);
						$('#mail').append(" "+applicant.email);
						$('#tel').append(" "+applicant.desk_phone);
						$('#address').append(" "+applicant.address);
						$('#address_supplement').append(" "+applicant.address_supplement);
						$('#postal_code').append(applicant.postal_code);
						$('#city').append(" "+applicant.city);
						$('#departementName').append(" "+applicant.departementName);
						$('#linkedin_link').append(" "+applicant.linkedin_link);
						$('#viadeo_link').append(" "+applicant.viadeo_link);
						$('#twitter_link').append(" "+applicant.twitter_link);
						
						$('#study_level').append(" "+applicant.study_level);
						$('#last_degree').append(" "+applicant.last_degree);
						
						$('#professional_strengths').append(" "+applicant.professional_strengths);
						$('#personality').append(" "+applicant.personality);
						(applicant.availability==1) ? $('#availability').append("Oui") : $('#availability').append("Non");
						$('#mobility').append(" "+applicant.mobility);
						
						$('#candidature').append(" "+applicant.candidature);
						$('#vue').append(" "+applicant.vue);
						
						$('#experiences').after(experiences);
						
						
						for (var i in applicant) {
							if (applicant[i] === null || applicant[i] === undefined) {

								$('#'+i).empty();
								$('#'+i).css({"margin-bottom":"0px"});
								delete applicant[i];
							}
						}	
					}
					else
					{
						$('#corps').load("modules/login.html");
					}
				});
				
				break;
				case "error_horsConnection":
				
				$('#corps').load("modules/"+name+".html");
				break;
				
				case "login_forgotPassword":
				
				break;
				
				default :
				$('#sousPage').css({'overflow-y':'scroll'});
				$('#sousPage').load("modules/"+name+".html");
			}
		}
		else
		{

			switch (name)
			{
				// DECONNEXION :
				case "login":
				
				$('#corps').load("modules/"+name+".html");
				$('#corps').css({"bottom":"0px"});
				$('#banner').css({"z-index":"-1"});
				
				break;
				
				case "login_forgotPassword":

				var email = $('#username').val();
				$('#corps').load("modules/"+name+".html", function()
				{
					
					$('#email').val(email);
				});
				$('#email').val(email);
				break;
				
				case "error_horsConnection":
				$('#corps').load("modules/"+name+".html");
				break;
			}
		}
	});
}

function setLocalStorage(elem, data)
{
	localStorage.setItem(elem, data);
	if(!getLocalStorage(elem)==null)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function getLocalStorage(elem)
{
	var token = localStorage.getItem(elem);
	return token;
}



function getInfosUser(callback)
{
	var token = getLocalStorage('token');
	
	$.ajax({
		type       : "POST",
		url        : "http://api.pdtdev.com/mobile.php",
		dataType   : 'JSON',
		
		data		: {user : 'STATS'},
		async:false,
		headers: {
			"X-PDT-App-Auth": token
		},
		success    : callback
	});     
} 


function userInfos() 
{
	
	
	var token = getLocalStorage("token");
	var profil;
	
	$.ajax({
		type       : "POST",
		url        : "http://api.pdtdev.com/mobile.php",
		dataType   : 'JSON',
		
		data		: {user : "INFOS"},
		async:false,
		headers: {
			"X-PDT-App-Auth": token
		},
		success    : function(response) 
		{
			profil = response;
			
		},
		error      : function(response) 
		{

			var obj = response.result.user.INFOS.applicant;

			profil = response;
		}
	});
	
	return profil;
    
	
}


function loadInfosUser()
{
	
	$('#sousPage').load("modules/profil.html", function() 
	{
		var test = userInfos();
		var applicant = test.result.user.INFOS.applicant;
		var radar = test.result.user.INFOS.criterion;
		var experiences = test.result.user.INFOS.experiences.html;

		
		if(test.call)
		{
			$('#sousPage').css({'overflow-y':'scroll'});
			
			
			console.log(applicant);
			$('#name').append(" "+applicant.firstname+" "+applicant.name);
			
			$('#birthday').append(" "+applicant.date_birth);
			$('#mail').append(" "+applicant.email);
			$('#tel').append(" "+applicant.desk_phone);
			$('#address').append(" "+applicant.address);
			$('#address_supplement').append(" "+applicant.address_supplement);
			$('#postal_code').append(applicant.postal_code);
			$('#city').append(" "+applicant.city);
			$('#departementName').append(" "+applicant.departementName);
			$('#linkedin_link').append(" "+applicant.linkedin_link);
			$('#viadeo_link').append(" "+applicant.viadeo_link);
			$('#twitter_link').append(" "+applicant.twitter_link);
			
			$('#study_level').append(" "+applicant.study_level);
			$('#last_degree').append(" "+applicant.last_degree);
			
			$('#professional_strengths').append(" "+applicant.professional_strengths);
			$('#personality').append(" "+applicant.personality);
			(applicant.availability==1) ? $('#availability').append("Oui") : $('#availability').append("Non");
			$('#mobility').append(" "+applicant.mobility);
			
			$('#candidature').append(" "+applicant.candidature);
			$('#vue').append(" "+applicant.vue);
			
			var experiences = test.result.user.INFOS.experiences.html;
			$('#experiences').after(experiences);
			$('#profil_socialNetworkingLinks').hide();
			$('#profil_mySearch').hide();
			$('#profil_radarPersonnalite').show();
			$('#profil_savoirEtre').hide();
			$('#profil_experience').hide();
			$('#profil_details').hide();
			
			
			for (var i in applicant) {
				if (applicant[i] === null || applicant[i] === undefined) {

					$('#'+i).empty();
					$('#'+i).css({"margin-bottom":"0px"});
					delete applicant[i];
				}
			}
			
			
			
			
		}
		else
		{
			$('#corps').load("modules/login.html");
		}
		
	});
	
	
	
} 


function initializeProfil()
{
	loadPhotoProfil();
}


function getJobs(mode, callback)
{
	var token = getLocalStorage('token');

	
	$.ajax({
		ASYNC : false,
		type       : "POST",
		url        : "http://api.pdtdev.com/mobile.php",
		dataType   : 'JSON',
		data		: {annonces : mode},
		headers: {
			"X-PDT-App-Auth": token
		},
		success : callback 
	});     
}



function connection() 
{
	setLocalStorage('token', '');
	
	var user = $('#username').val();
	var pass = $('#password').val();

	
	setLocalStorage('login',user);
	
	if (user && pass)
	{
		$.ajax({
			type       : "POST",
			url        : "http://api.pdtdev.com/mobile.php",
			
			dataType   : 'JSON',
			headers: {
				"Authorization": "Basic " + btoa(user + ":" + pass)
			},
			success    : function(response) 
			{
				if(response.result.identification){
					
					setLocalStorage('token',response.result.token);
					if($('#login_check_box').data('checked'))
					{
						
						setLocalStorage('pwd',response.result.pwd);
					}
					
					var token = getLocalStorage('token');
					
					if (response.result.token == token)
					{
						$('#corps').css({"bottom":"50px"});
						$('#banner').css({"height":"50px"});
						$('#banner').css({"z-index":"99"});
						$('#corps').load("modules/accueil.html");
					}
					else
					{
						$('#error').append('Erreur de session. Merci de bien vouloir réessayer ultérieurement.')
					}
				}	
				else
				{
					$('#password').css({'border-bottom':'1px solid red'});
					$('#username').css({'border-bottom':'1px solid red'});
					$('#error_login').html('Le nom d\'utilisateur et/ou le mot de passe semble(nt) incorrect(s).');
					$('#error_login').show();
					
				}
			},
			error      : function(response) 
			{
				
				$('#error_log').remove();
				
				$('#login').before('<div id="error_log">Connexion impossible pour le moment. Veuillez réessayer ultérieurement.<div>');
				$('#error_log').css({'color' : 'red'});
				
			}
			
		});
	}
	else
	{
		
		if (!user && pass)
		{
			$('#password').css({'border-bottom':'1px solid white'});
			$('#username').css({'border-bottom':'1px solid red'});
			$('#error_login').html('L\'adresse e-mail n\'est pas renseignée.');
			$('#error_login').show();
			
		}
		else if (user && !pass)
		{
			$('#username').css({'border-bottom':'1px solid white'});
			$('#password').css({'border-bottom':'1px solid red'});
			$('#error_login').html('Le mot de passe n\'est pas renseigné.');
			$('#error_login').show();
			
		}
		else
		{
			$('#username').css({'border-bottom':'1px solid red'});
			$('#password').css({'border-bottom':'1px solid red'});
			$('#error_login').html('L\'adresse e-mail et le mot de passe ne sont pas renseignés.');
			$('#error_login').show();
			
		}
		
	}
	
	
} 

//--- JOBS ---//

function getJobDetails(id, obj)
{

	var token = getLocalStorage("token");
	var job = JobDetails(token, id);
	
	
	
	$('#listJobsCompat').css({
		"height": "100vh"
	});
	
	$('#listJobsCompat').empty().load("modules/jobs_jobDetails.html", function()
	{
		$('#top').css({
			"height": "13.2%"
		});
		$('#ville').css({
			"height": "13.2%"
		});
		
		$('.chartCirclePostulants').attr('data-percent',job.compatibilite_total);
		
		$('#title').append(job.title);
		$('#ent_name').append(job.ent_name);
		$('#ent_city').append(job.ent_city);
		var critere ="";
		$.each(job.compatibilite, function(index, value)
		{

			
			switch (index)
			{
				case 'compatibilite_localisation' :
				critere = "Localisation";
				break;
				case 'compatibilite_criterion' :
				critere = "Personnalité";
				break;
				case 'compatibilite_experiences' :
				critere = "Expérience";
				break;
				case 'compatibilite_jeRecherche' :
				critere = "Ma recherche";
				break;
				case 'compatibilite_mobilite' :
				critere = "Mobilité";
				break;
				
			}
			
			
			$('#Job_circleStat').append('<div id="job_localisation" style="float: left;margin-left: 10px;position: relative;width: 30%;text-align: center;">'+
			'<div style="float: left;height: 100%;z-index: 99;text-align: center;">'+
			'<div class="chartCirclePostulants"  data-percent="'+value+'" data-dimension="60" data-bordersize="2" data-fgcolor="#e1581c" ></div>'+
			'<div id="'+index+'" style="position: relative;bottom: 40px;float: initial;font-size: 12px;">'+value+' %</div>'+
			'</div>'+
			'<div style="height:100%;font-weight:bold;font-size:10px;top:-20px;position:relative;">'+critere+'</div>'+
			'</div>');
		});
		
		
		$('#compatibilite_total').append(job.compatibilite_total+"%");
		
		$('#description').append(job.description);
		$('#contract_type').append(job.contract_type);
		$('#additional_information').append(job.additional_information);
		
		$(".chartCirclePostulants").circliful();

		initializeMap("Dijon",job.city);
	});
	
	
}

function geocoding(place, geocoder)
{
	var address = place;
	geocoder.geocode({'address': address}, function(results, status) 
	{
		if (status === google.maps.GeocoderStatus.OK) 
		{
	
			return results[0].geometry.location
		}
		else 
		{
			$('#mapDiv').remove();

		}
	});
}

function isEmpty( el ){
	return !$.trim(el.html())
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination)
{
	var geocoder = new google.maps.Geocoder();
	var origin = origin;
	var destination = destination;

	directionsService.route({
		origin: origin,  // Haight.
		destination: destination,  // Ocean Beach.
		// Note that Javascript allows us to access the constant
		// using square brackets and a string value as its
		// "property."
		travelMode: google.maps.TravelMode.DRIVING
		}, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			if (response.routes[0].legs[0].distance.value > 30)
			{
				$('#Annonce_MapKm').empty().append(response.routes[0].legs[0].distance.text);
			}
			if (!isEmpty($('#Annonce_MapKm')))
			{
				$('#Annonce_titleDistance').empty().append('Distance : ');
				$('#Annonce_MapTime').empty().append(" soit "+response.routes[0].legs[0].duration.text);
			}
			
			} else {
			$('#mapDiv').remove();
			window.alert('Directions request failed due to ' + status);
		}
	});
	
	
}


function initializeMap(origin, destination) {
	var geocoder = new google.maps.Geocoder();
	var lieu = geocoding("Dijon", geocoder);
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	var map = new google.maps.Map(document.getElementById("mapDiv"), {
		zoom: 8,
		center: lieu
	});
	directionsDisplay.setMap(map);
	calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination);
}


function geocodeAddress(geocoder, resultsMap, origin, destination) {
	
	geocoder.geocode({'address': address}, function(results, status) 
	{
		if (status === google.maps.GeocoderStatus.OK) 
		{
			resultsMap.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location
			});
		}
		else 
		{
			$('#mapDiv').remove();
		}
	}	);
}


function onDeviceReadyMap() {
	initMap();
}	

function JobDetails(token, id) 
{

	
	var details = new Object();
	var compatibilite = new Object();
	
	$.ajax({
		type       : "POST",
		url        : "http://api.pdtdev.com/mobile.php",
		dataType   : 'JSON',
		
		data		: {annonces : "DETAIL", id_jobOffers : id},
		async:false,
		headers: {
			"X-PDT-App-Auth": token
		},
		success    : function(response) 
		{

			
			if(response.call)
			{
				if (response.result.session == "alive")
				{
					details.title = response.result.annonces.DETAIL.annonce.job_position;
					details.city = response.result.annonces.DETAIL.annonce.city;
					details.contact_email = response.result.annonces.DETAIL.annonce.contact_email;
					details.created_date = response.result.annonces.DETAIL.annonce.created_date;
					details.description = response.result.annonces.DETAIL.annonce.description;
					details.update_date = response.result.annonces.DETAIL.annonce.update_date;
					details.contract_type = response.result.annonces.DETAIL.annonce.contract_type;
					details.additional_information = response.result.annonces.DETAIL.annonce.additional_information;
					details.businessSector_id = response.result.annonces.DETAIL.annonce.businessSector_id;
					details.compatibilite_localisation = response.result.annonces.DETAIL.compatibilite.cat1_localisation;
					details.compatibilite_criterion = response.result.annonces.DETAIL.compatibilite.cat2_criterion;
					details.compatibilite_experiences = response.result.annonces.DETAIL.compatibilite.cat3_experiences;
					details.compatibilite_jeRecherche = response.result.annonces.DETAIL.compatibilite.cat4_jeRecherche;
					details.compatibilite_mobilite = response.result.annonces.DETAIL.compatibilite.cat5_mobilite;
					details.compatibilite_total = response.result.annonces.DETAIL.compatibilite.total;
					details.ent_name = response.result.annonces.DETAIL.entreprise.name;
					details.ent_adresse = response.result.annonces.DETAIL.entreprise.adresse;
					details.ent_city = response.result.annonces.DETAIL.entreprise.city;
					details.ent_postal_code = response.result.annonces.DETAIL.entreprise.postal_code;
					details.ent_siret = response.result.annonces.DETAIL.entreprise.siret;
					details.ent_website_link = response.result.annonces.DETAIL.entreprise.website_link;
					
					compatibilite.compatibilite_localisation = response.result.annonces.DETAIL.compatibilite.cat1_localisation;
					compatibilite.compatibilite_criterion = response.result.annonces.DETAIL.compatibilite.cat2_criterion;
					compatibilite.compatibilite_experiences = response.result.annonces.DETAIL.compatibilite.cat3_experiences;
					compatibilite.compatibilite_jeRecherche = response.result.annonces.DETAIL.compatibilite.cat4_jeRecherche;
					compatibilite.compatibilite_mobilite = response.result.annonces.DETAIL.compatibilite.cat5_mobilite; 
					
					details.compatibilite = compatibilite;			
				}
				else
				{
					jobs = false;
					callAnotherPage("login");
				}  
			}
			else
			{
				callAnotherPage("login");
				// alors aller dans Page Identif  
			}
		},
		error      : function(response) 
		{
			callAnotherPage("error_accessAPI");
		}
	});     
	return details;
	
}

function getApplications()
{
	var token = getLocalStorage("token");
	var application = applicationsDetails(token);


	$("#sousPage").load("modules/accueil_applicationHistory.html", function()
	{
		application.reverse();
		$.each(application, function (index, value) {
			
			$('.applications_apply').append(
			'<div class="actuatite_news">'+
			'<div style="clear:both;border:1px solid black;height:70px;" onClick="getJobDetails('+value.jobOffer_id+')">'+
			
			'<div id="title_job" style="float:left;width:30%;height:100%;vertical-align:middle;border:1px solid green;">'+value.date+'</div>'+
			
			'<div style="float:left;width:65%;border:1px solid red;">'+
			'<div id="title_job">'+value.job_position+'</div>'+
			'<div id="company" style="font-style:italic;">'+value.nameCompany+'</div>'+
			'</div>'+
			
			'</div>'+
			'</div>');
			
		}); 
		
	});
	
	
	
} 

function applicationsDetails(token) 
{

	var details = new Object();
	
	$.ajax({
		type       : "POST",
		url        : "http://api.pdtdev.com/mobile.php",
		dataType   : 'JSON',
		
		data		: {annonces : "IAPPLYJOB"},
		async:false,
		headers: {
			"X-PDT-App-Auth": token
		},
		success    : function(response) 
		{

			if(response.call)
			{
				if (response.result.session == "alive")
				{
					details = response.result.annonces.IAPPLYJOB;
				}
				else
				{
					jobs = false;
					callAnotherPage("login");
				}  
			}
			else
			{
				callAnotherPage("login");
			}
		},
		error      : function(response) 
		{
			callAnotherPage("error_accessAPI");
		}
	});     
	
	return details;
	
}


function getConsultedJobs()
{
	var token = getLocalStorage("token");
	var application = consultedJobsDetails(token);

	$("#sousPage").load("modules/accueil_consultedHistory.html", function()
	{
		application.reverse();
		$.each(application, function (index, value) {
			
			$('.consulted_jobs').append(
			'<div class="actuatite_news">'+
			'<div style="clear:both;border:1px solid black;height:75px;" onClick="getJobDetails('+value.jobOffer_id+')">'+
			
			'<div id="title_job" style="float:left;width:30%;height:100%;vertical-align:middle;border:1px solid green;">'+value.date+'</div>'+
			
			'<div style="float:left;width:65%;border:1px solid red;">'+
			'<div id="title_job">'+value.job_position+'</div>'+
			'<div id="company" style="font-style:italic;">'+value.nameCompany+'</div>'+
			'</div>'+
			
			'</div>'+
			'</div>'); 
			
		}); 
		
	});
	
	
	
}

function consultedJobsDetails(token) 
{

	var details = new Object();
	
	$.ajax({
		type       : "POST",
		url        : "http://api.pdtdev.com/mobile.php",
		dataType   : 'JSON',
		
		data		: {annonces : "ISEEJOB"},
		async:false,
		headers: {
			"X-PDT-App-Auth": token
		},
		success    : function(response) 
		{

			if(response.call)
			{
				if (response.result.session == "alive")
				{
					details = response.result.annonces.ISEEJOB;
				}
				else
				{
					jobs = false;
					callAnotherPage("login");
				}  
			}
			else
			{
				callAnotherPage("login");
			}
		},
		error      : function(response) 
		{
			callAnotherPage("error_accessAPI");
		}
	});     
	
	return details;
	
}


function paire(value) 
{
	return (value & 1)==1;
}



function loadRSS()
{
	$.get("http://blog.place-des-talents.com/feed/", function(data) 
	{
		var $xml = $(data);
		$('#fluxRSS').empty();
		
		$xml.find("item").each(function() 
		{
			var $this = $(this),
			item = {
				title: $this.find("title").text(),
				link: $this.find("link").text(),
				description: $this.find("description").text(),
				pubDate: $this.find("pubDate").text(),
				author: $this.find("author").text(),
				img : $($this.find("description").text()). find("img").attr('src') 
			}
			
			$('#fluxRSS').append(
			'<div class="actualite_content" style="border:1px solid rgba(154,154,154,.5);background-clip: padding-box; -webkit-background-clip: padding-box;position: relative;width: 95%;height: auto;margin: auto; margin-top: 10px;margin-bottom: 20px; text-align: center; overflow: hidden;">'+
			'<div class="actuatite_news" onClick="getArticleDetails(\''+item.link+'\')">'+
			'<div class="actualites_title">'+
			'<p>'+item.title+'</p>'+
			'<p style="font-size: 11px;font-weight: 600;margin-top: 2px;margin-bottom: 4px;">'+DateFormatRSS(item.pubDate)+'</p>'+
			'</div>'+
			
			'<img class="actualites_image" src="'+item.img+'" />'+
			'<div class="actualites_options">'+
			'<div class="actualites_option_link">'+
			'<p><img src="common/img/accueil_actu_lunettes.png" class="actualites_options_img" /></p>'+
			'</div>'+
			'<div class="actualites_option_link" onClick="shareLink(event,\''+item.title+'\', \''+item.link+'\')">'+
			'<p><img src="common/img/accueil_actu_share.png" class="actualites_options_img"/></p>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>');
		});
	});
}

function notification_CheckNewsJobs()
{
	
	var lastlistStored = JSON.parse(localStorage.getItem("lastList"));

	
	var newsJobsArray = [];
	$.each(lastlistStored, function (index, value) 
	{
		if(value.idNotif=="0")
		{
			newsJobsArray.push(
			{
				idJob : value.idJob
			});
		}
		else
		{
			
		}
	});
	return newsJobsArray;
}


function loadNewJobs()
{
	var lastList = [];
	lastList.push
	({
		idJob : 331,
		idNotif : "0"
	});
	lastList.push
	({
		idJob : 327,
		idNotif : "0"
	});
	
	
	localStorage.setItem("lastList", JSON.stringify(lastList));
	
	var newJobsNotConsulted = notification_CheckNewsJobs();
	if(newJobsNotConsulted.length>0)
	{
		$('#accueil_nb_job_design_picture_data_text').append(newJobsNotConsulted.length);
	}
	else
	{
		$('#accueil_nb_job_design').hide();
	}
	
	
}


function DateFormatRSS(UTCDate) 
{
	var oneDay = 24 * 60 * 60 * 1000; 
	var date = new Date(UTCDate);
	var today = new Date();
	
	var monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
	
	if (date!=today)
	{
		return "Posté le "+date.getDay()+" "+monthNames[date.getMonth()]+" "+date.getFullYear()+"";
	}
	else
	{
		return "Posté aujourd'hui";
	}
}

function getArticleDetails(link)
{
	var url = "http://blog.place-des-talents.com/feed/";
	var ref = window.open(link, '_self', 'location=yes');
	// A REFAIRE
	
	// parseRSS(url, function(callback)
	// {
	// var value = callback.entries[id];
	// console.log(value);
	// var ref = window.open(value.link, '_self', 'location=no');
	// });
}

function shareLink(event, articleTitle, articleLink)
{
	event.preventDefault();
	event.stopPropagation();

	var options = {
		message: articleTitle, // not supported on some apps (Facebook, Instagram)
		subject: articleTitle, // fi. for email
		url: articleLink,
		chooserTitle: 'Partager via :' // Android only, you can override the default share sheet title
	}
	
	var onSuccess = function(result) {
	}
	
	var onError = function(msg) {
	}
	
	window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

function loadDataRadar()
{
	var test = userInfos();
	var radar = test.result.user.INFOS.criterion;
	
	if(test.call)
	{
		if (test.result!=null)
		{
			dataResultArray = $.map(radar, function(value, index) {
				return [value];
			});
			dataResult = {
				label: "Candidat",
				fillColor: "rgba(54,189,221,0.3)",
				strokeColor: "rgba(54,189,221,1)",
				pointHighlightFill: "#ddd",
				pointColor: "rgba(54,189,221,1)",
				data: dataResultArray
			}
			return dataResult;
			
		}
		else
		{
			$('#radar').append('La comparaison entre ces deux profils n\'est pas disponible.');
		}
		
	}
	
}


function radarSolo(data, idParentCanvas, idCanvas)
{
	var ctxComparaison = document.getElementById(idCanvas).getContext("2d");
	var hauteur=document.getElementById(idParentCanvas).clientHeight-5;
	var largeur=document.getElementById(idParentCanvas).clientWidth;
	ctxComparaison.height            =hauteur;
	ctxComparaison.canvas.height    =hauteur+100;
	ctxComparaison.width            =largeur;
	ctxComparaison.canvas.width        =largeur+100;
	var canvas = document.getElementById(idCanvas);
	$(canvas).parents("*").css("overflow", "visible");
	$(canvas).css('opacity', 1);
	
	
	if(typeof data!=='undefined' )
	{
		var resultFinal = {
			labels: ["Flexibilité", "Implication", "Extraverti", "Altruiste", "Contrôle des émotions", "Pragmatisme", "Improvisation", "Introverti", "Individualiste", "Sensibilité"],
			datasets: [data]
		};
	}
	
	if(typeof resultFinal!=='undefined')
	{
		var myRadarChart = new Chart(ctxComparaison).Radar(resultFinal,{responsive: true,
			scaleOverride: true,
			scaleSteps:10,
			scaleStepWidth: 10,
			scaleStartValue: 0,
			scaleFontSize: 50,
			pointLabelFontSize: 12,
			datasetStrokeWidth : 1,
			pointDot : true,
			pointDotRadius : 1,
			scaleLineWidth: 1,
			customTooltips: true,
			tooltipTitleFontColor: "#2E2E2E",
			tooltipFontColor: "#2E2E2E",
			tooltipFillColor: "rgba(255,214,80,0.7)",
			responsive: true,
			maintainAspectRatio: false,
			multiTooltipTemplate: "<%= value %>%",
			options: {
				onClick: {
					// Overrides the global setting
					mode: 'label'
				}
			}
		});
		return myRadarChart;
	}
	
	
}

function profil_changeTab(elem)
{
	var dest = elem;
	var infos = userInfos();
	var applicant = infos.result.user.INFOS.applicant;
	var experiences = infos.result.user.INFOS.experiences.html;

	$('#'+elem).css({
		"border-bottom": "2px solid #f6907a"
		
	});
	$('#'+elem).siblings().css({
		"border-bottom": "0em solid #fff"
		
	});
	
	
	switch (dest)
	{
		case 'radarPersonnaliteTitle' :
		$('#contentProfil').load('modules/profil_radarPersonnalite.html');
		break;
		
		case 'mySearchTitle':
		$('#contentProfil').load('modules/profil_mySearch.html', function()
		{
			
			if(infos.call)
			{
				$('#sousPage').css({'overflow-y':'scroll'});
			}
			else
			{
				$('#corps').load("modules/login.html");
			}
			
			
			var test = userInfos();			
		});
		break;
		
		case 'savoirEtreTitle' :
		$('#contentProfil').load('modules/profil_savoirEtre.html', function()
		{
			
			$('#professional_strengths').append(" "+applicant.professional_strengths);
			$('#personality').append(" "+applicant.personality);
			(applicant.availability==1) ? $('#availability').append("Oui") : $('#availability').append("Non");
			$('#mobility').append(" "+applicant.mobility);
		});
		break;
		
		case 'experiencesTitle' :
		$('#contentProfil').load('modules/profil_experience.html', function()
		{
			
			$('#experiences').after(experiences);
		});
		break;
		
	}
}

function exitPopup()
{
	$('.popup').hide();
}

function notExitPopup(ev)
{
	ev.stopPropagation();
}


function popup(environnement)
{
	$('.popup').show();
	$('#popupCorp').empty();
	
	switch (environnement){
		case 'image' : 
		$('#popupCorp').html('<input type="button" style="width:95%;height:50%;" id="editImage" onClick="editPhoto();" value="Modifier la photo"/>'
		+'<input type="button" style="width:95%;height:50%;" id="deleteImage" onClick="deletePhoto();" value="Supprimer la photo"/>');
		break;
		
		case 'Facture' : 
		$.ajax({
			type: 'POST',
			url: '/mgallois/Dev/CRM/pages/suivi_Entreprise_Action_Facture.php',
			data: {idAction : id},
			dataType: 'html'
		})
		.done(function(htmlValue) 
		{
			
			$('#loadingPicture').hide();
			
			$('#loadingPicture').hide();
			$('#popupCorp').html(htmlValue);
			$('.popupContent').css({"width": "70%", "height":"93%"});
			
			var $response=$(htmlValue);
						
			var title = $response.filter('form#form-upload').children('h2').text();
			
			if (title.length) 
			{
				$(".popupTitle").html(title);
				$('.popupCorp h2').empty();
			}
			else
			{
				var title = $response.filter('h2').first().text();
				$(".popupTitle").html(title);
				$('#popupCorp h2').remove();
			}
			
			$('form#form-upload h2').remove();
			
			
		}).fail(function(data)
		{
			
		});		
		break;
		
	}
}



function photoOptions() 
{
	popup("image");
}


function editPhoto()
{
	$('#popupCorp').empty();
	$('#popupCorp').html('<input type="button" style="width:95%;height:50%;" id="editImageWithCamera" onClick="editImageWithCamera();" value="Prendre avec la camera"/>'
	+'<input type="button" style="width:95%;height:50%;" id="editImageWithFiles" onClick="editImageWithFiles();" value="Choisir dans les fichiers"/>');
}

function confirmPhoto()
{

		var smallImage = document.getElementById('pictureProfil');
		var url = smallImage.src;
		var img = new Image();
		img.src = url;
		img.onload = function()
		{
			var canvas  =  document.getElementById( 'myCanvas' ); 
			
			var context  =  canvas.getContext( '2d' );
			var centerX = canvas.width;
			var centerY = canvas.height ;

			context.save();
			context.beginPath();
			context.arc(100, 100, 100, 0, 2 * Math.PI, true);
			context.stroke();
			context.closePath();
			context.clip();
			
			context.drawImage(img, 0, 0, 200, 200);
			
			context.beginPath();
			context.arc(100, 100, 100, 0, 2 * Math.PI, true);
			context.stroke();
			context.closePath();
			context.restore();
			
			var data = canvas.toDataURL("image/png");
			localStorage.setItem("data", data );
		}
		exitPopup();
	
}


function onSuccessPhoto(imageURI)
{

	$('#popupCorp').empty();
	$('#popupCorp').html('<img style="display:none;border:1px solid red;font-weight:bold; text-align:center; font-size:20px;width: 170px; height: 170px;border-radius: 50%; background-repeat: no-repeat;  background-position: center center; background-size: cover;z-index:2000;left:30%;" id="pictureProfil" src=""/>'
	+'<input type="button" style="width:95%;height:50%;margin-top : 20px;" id="editImageWithCamera" onClick="confirmPhoto();" value="Valider"/>'
	+'<input type="button" style="width:95%;height:50%;margin-top : 20px;" id="editImageWithCamera" onClick="editImageWithCamera();" value="Reprendre avec la camera"/>'
	+'<input type="button" style="width:95%;height:50%;margin-top : 20px;" id="editImageWithCamera" onClick="exitPopup();" value="Annuler"/>');
	var smallImage = document.getElementById('pictureProfil');
	smallImage.style.display = 'block';
	smallImage.src = imageURI;
}	

function onErrorPhoto(message)
{
	alert('Failed because: ' + message);
}

function onSuccessAlbumPhoto(imageURI)
{
	$('#popupCorp').empty();
	$('#popupCorp').html('<img style="display:none;border:1px solid red;font-weight:bold; text-align:center; font-size:20px;width: 170px; height: 170px;border-radius: 50%; background-repeat: no-repeat;  background-position: center center; background-size: cover;z-index:2000;left:30%;" id="pictureProfil" src=""/>'
	+'<input type="button" style="width:95%;height:50%;margin-top : 20px;" id="editImageWithCamera" onClick="confirmPhoto();" value="Valider"/>'
	+'<input type="button" style="width:95%;height:50%;margin-top : 20px;" id="editImageWithCamera" onClick="editImageWithFiles();" value="Choisir une autre photo"/>'
	+'<input type="button" style="width:95%;height:50%;margin-top : 20px;" id="editImageWithCamera" onClick="exitPopup();" value="Annuler"/>');
	var smallImage = document.getElementById('pictureProfil');
	smallImage.style.display = 'block';
	smallImage.src = imageURI;
}	

function onErrorAlbumPhoto(message)
{
	if (message == "Camera cancelled.")
	{
		editPhoto();
	}
	else
	{
		alert('Failed because: ' + message);
	}
	
}

function editImageWithCamera()
{
	$('#popupCorp').empty();
	navigator.camera.getPicture(onSuccessAlbumPhoto, onErrorAlbumPhoto, { quality: 60, 
		targetWidth: 3000,
		correctOrientation: true,
		encodingType: Camera.EncodingType.JPEG,
		destinationType: Camera.DestinationType.FILE_URI,
		allowEdit: false,
		
	});
	
}

function editImageWithFiles()
{
	$('#popupCorp').empty();
	navigator.camera.getPicture(onSuccessPhoto, onErrorPhoto, { quality: 60,
		destinationType: Camera.DestinationType.FILE_URI, 
		sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
	});
}




function loadPhotoProfil()
{	
	
	setInterval(function(){
		if (localStorage.getItem("data") === null)
		{
			
		}
		else
		{
			var img = new Image();
			img.src = localStorage.getItem("data");
			img.onload = function()
			{
				var canvas  =  document.getElementById( 'myCanvas' ); 
				
				var context  =  canvas.getContext( '2d' );
				var centerX = canvas.width / 2;
				var centerY = canvas.height / 2;
				var radius = 70;
				
				context.stroke();
				
				context.drawImage( img, 0, 0 );
				
			}
			exitPopup();
			
		}
	}, 30000);
}

function deletePhoto()
{
	var canvas  =  document.getElementById( 'myCanvas' ); 
	var context = canvas.getContext( '2d' );
	
	localStorage.removeItem("data");
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	exitPopup();
}


function lastJobsList(lastList)
{
	var lastJobsList = "";
	if (!lastJobsList && !lastList)
	{
		return false; //array
	}
	else if (lastJobsList && !lastList)
	{
		return lastJobsList;
	}
	else if (lastJobsList && lastList)
	{
		lastJobsList = lastList;
	}
	
}


function compareArray(arr1, arr2)
{
	return $(arr1).not(arr2).length == 0 && $(arr2).not(arr1).length == 0;
}


function Notifications_CheckAnnonce()
{
	getJobs('ISEARCH', function(data)
	{
		if(data.call)
		{
			localStorage.removeItem("lastList");
			if ( localStorage.getItem("lastList") == null) 
			{
				var lastList = [];
				$.each(data.result.annonces.ISEARCH.liste, function (index, value) 
				{
					if (value.id == "331"||value.id == "327")
					{
						lastList.push({
							idJob : value.id,
							idNotif : "0"
						});
					}
					localStorage.setItem("lastList", JSON.stringify(lastList));
				});
				
				
				var NewsJobs = notification_CheckNewsJobs();
				
				if(!jQuery.isEmptyObject(NewsJobs))
				{
					
					analyzeNotifications(NewsJobs);
				}
				else
				{
					
				}
				
			}
			else
			{
				
			}
		}
		else
		{
		}
	});
}


function analyzeNotifications(data)
{
	
	var nbAnnoncesSend=data.length;
	
	var newNotification = [];
	if (nbAnnoncesSend > "2")
	{
		
		newNotification.push({
			title : "Place des Talents - Nouvelles annonces",
			message : "Vous avez "+ nbAnnoncesSend +" nouvelles offres qui vous correspondent."
		});
		pushNotifications(newNotification);
		$.each(data, function (index, value) 
		{
			value.idNotif = "1";
		});
		
	}
	else
	{
		var token = getLocalStorage("token");
		
		$.each(data, function (index, value) 
		{	
			
			var details = JobDetails(token, value.idJob);
			newNotification.push({	
				title : "Place des Talents - Nouvelle annonce",
				message : details.title + " - " + details.city,
				id : value.idJob
			});
			
			notification_jobNotified(value.idJob);
			
		});
		pushNotifications(newNotification);
	}
	
}

function notification_jobNotified(id)
{
	var lastlistStored = JSON.parse(localStorage.getItem("lastList"));
	$.each(lastlistStored, function (index, value) 
	{
		if(value.idJob==id)
		{
			value.idNotif = "1";
		}
	});
	localStorage.setItem("lastList", JSON.stringify(lastlistStored));
	var checkListStored = JSON.parse(localStorage.getItem("lastList"));
}


function pushNotifications(data)
{
	var idJob;
	$.each(data, function (index, value) 
	{
		if (value.id)
		{
			idJob = value.id;
		}
		else
		{
			idJob = Math.floor((Math.random() * 100) + 1);
			
		}

		cordova.plugins.notification.local.schedule([{
			id: idJob,
			title: value.title,
			text: value.message,
			icon: 'icon',
			smallIcon: 'icon'
		}]);
	});
	
	cordova.plugins.notification.local.on("click", function (notification) {

		if (notification.id<101)
		{
			$('#sousPage').load("modules/jobs.html", 
			function() 
			{
				$('#ISEARCH').click();
			});
		}
		else
		{
			$('#sousPage').load("modules/jobs.html", 
			function() 
			{
				$('#ISEARCH').click();
				
				setTimeout(function() {
					$('#'+notification.id+'').click();
				}, 300);
			});
		}
	}); 
	
}

function getParseJobs(data)
{
	
	$('#listJobsCompat').empty();
	
	$.each(data, function (index, value) 
	{
		var background='#ffffff';
		var jobTitle = value.job_position;
		var company = value.nameCompany;
		var city="Non Renseigné";
		
		if(jobTitle.length > 30) 
		{
			jobTitle=jobTitle.substring(0,29)+"...";
		}
		
		if(company.length > 30) 
		{
			company=company.substring(0,29)+"...";
		}
		
		if(value.city!= null)
		{
			var city = value.city;
			city=city.toLowerCase();
			city=city.charAt(0).toUpperCase() + city.slice(1);
		}
		
		$('#listJobsCompat').append('<div style="background-color:'+background+';" id ="'+value.id+'" class="listJobMaster" onClick="getJobDetails('+value.id+', this)">'+
		
		
		'<div id="top" style="position:relative;float:left;width:60%;height:100%;margin-left:5px;z-index: 99;">'+
		'<div style=" position: absolute;top: 50%;transform: translateY(-50%);">'+
		'<div style="color: #3278ab;font-size: 100%;width:200px;">'+jobTitle+'</div>'+
		'<div style="font-size: 100%;margin-top: 4px;">'+company+'</div>'+
		'<div style="position:relative;top:50%;color: #a5a5a5;font-size: 85%;">'+city+'</div>'+
		'</div>'+
		
		'</div>'+
		'<div style="display: flex; align-items: center;align-content: center; text-align: center; margin: 0; padding: 0; height: 100%;">'+
		'<div class="chartCirclePostulants"  data-percent="'+value.compatibilite_total+'" data-dimension="60" data-bordersize="2" data-fgcolor="#e1581c" style="display: flex;align-items: center;align-content: center;text-align: center;"><div style="position: relative;left: 50%;top:2px">'+value.compatibilite_total+'%</div></div>'+
		
		'</div>'+
		
		'</div>'
		);
		
	});
	
	$(".chartCirclePostulants").circliful();
}

