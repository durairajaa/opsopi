$(document).ready(function() {


	chrome.runtime.sendMessage({
		method:"get_site_name"
	},function(response){
		if(response.hostname){
			var hostname = response.hostname;
			console.log(response.hostname);
			chrome.storage.local.get({"request_sent_sites":[]},function(storage_response){
				console.log(storage_response);
				if(storage_response.request_sent_sites.length>0 && storage_response.request_sent_sites.indexOf(response.hostname)>-1){
					// hide the add sites button
					$("#add_sites").hide();
				}else if(response.hostname == "not_found"){
					$("#add_sites").hide();
				}else{
					//display the button
					$("#add_sites").show();
				}
			});
		}
	});

	$(document).on("click","#add_sites",function(e){

		if(!$("#add_sites").hasClass("request-sent")){

			$("#add_sites").addClass("request-sent");

			chrome.runtime.sendMessage({"method":"add_site_click"},function(resopnse){

			});
			$.toast({
				"text":"Request sent to add sites",
				"position":"mid-center"
			});
		}

		$("#add_sites").hide();
	});


	$(document).on("click","#settings",function(e){
        chrome.runtime.sendMessage({
            method: "showOptionsPage"
        });
	});
});

