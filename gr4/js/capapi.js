var CaseLaw = {};

CaseLaw.getCase = function(citation){

	var url = "https://api.case.law/v1/cases/?"+
		"cite="+encodeURIComponent(citation)+
		"&name_abbreviation="+
		"&jurisdiction="+
		"&reporter="+
		"&decision_date_min="+
		"&decision_date_max="+
		"&docket_number="+
		"&court="+
		"&court_id="+
		"&search="+
		"&full_case=true"+
		"&body_format=";

	return fetch(url)
		.then(function(response){
			return response.json();
		})
		.then(function(response){
			if(response.count == 1){
				return new CaseLaw.Case(response.results[0]);
			}
			else{
				console.error("recieved "+response.count+" responses from server");
				return null;
			}

		})

};

CaseLaw.Case = function(data){
	this.data = data;
};

CaseLaw.Case.prototype.getMajorityOpinion = function(){
	var majorityOpinion = null;
	this.data.casebody.data.opinions.forEach(function(opinion){
		console.log(opinion,opinion.type);
		if(opinion.type == "majority"){
			majorityOpinion = opinion.text;
		};
	});
	
	if (!majorityOpinion){
		console.error("No majority opinion found");
	}

	return majorityOpinion;
};

CaseLaw.Case.prototype.getCaseHeader = function(){
	var title = this.data.name_abbreviation;
	var court = this.data.court.name;
	var date = this.data.decision_date;
	var reporter = this.data.reporter.full_name;
	
	if (title&&court&&date&&reporter){
		return {
			title,
			court,
			date,
			reporter
		};
	}
	else{
		console.error("Missing info");
	}

};



