var poke1="";
var poke2="";
var err="Please enter two pokemon names or ids!";
$(document).ready(function(){
	$('#loading').hide(); // hide loading indicators
    $('#submit').click(function(){
        poke1 = $("#poke1").val(); //get values from input
        poke2 = $("#poke2").val();
        if(!poke1||!poke2){
          $("#error").html(err);
        }else{
			$("#error").hide(); // remove the error messege
			$.when(getPoke(poke1),getPoke(poke2)).done(function(a1,a2){ // call getPoke function, to get two pokemon's data
				var types1 = a1[0].types.slice(0); // get all types of the pokemon
				var types2 = a2[0].types.slice(0);
				var stats1 = a1[0].stats.slice(0); //get all stats of the pokemon
				var stats2 = a2[0].stats.slice(0);
				var pokemon1 = a1[0].name; // get pokemon name
				var pokemon2 = a2[0].name;
				var ads = []; // all types's api url
				for(var i=0;i < types1.length;i++){ //collect urls of all types of first input pokemon
					ads[i] = getTypes(types1[i].type.url);
				}
				$.when.apply(null,ads).then(function(){
					var typeArr = Array.prototype.slice.call(arguments); // fetch the array of all types 
					var doubleDmgFrom = [];
					var doubleDmgTo = [];
					var halfDmgFrom = [];
					var halfDmgTo = [];

					for(var j=0;j < typeArr.length;j++){ //go through all types, fetch the advantages of each type
						doubleDmgFrom.push(fetchNames(typeArr[j][0].damage_relations.double_damage_from));
						doubleDmgTo.push(fetchNames(typeArr[j][0].damage_relations.double_damage_to));
						halfDmgFrom.push(fetchNames(typeArr[j][0].damage_relations.half_damage_from));
						halfDmgTo.push(fetchNames(typeArr[j][0].damage_relations.half_damage_to));		
						
					}
					doubleDmgFrom = flatten(doubleDmgFrom); //flatten it into an array of type names
					doubleDmgTo = flatten(doubleDmgTo);
					halfDmgFrom = flatten(halfDmgFrom);
					halfDmgTo = flatten(halfDmgTo);
						//console.log(doubleDmgFrom);	
						var results=0; // the result of favourable type advantage
						for(var k=0;k<types2.length;k++){ //go through all types of second pokemon
							if((doubleDmgFrom).includes(types2[k].type.name)){ //compare each type with the fetched array of first pokemon 
								results-=2;
							}else if((halfDmgFrom).includes(types2[k].type.name)){
								results-=0.5;
							}
							if((doubleDmgTo).includes(types2[k].type.name)){
								results+=2;
							}else if((halfDmgTo).includes(types2[k].type.name)){
								results+=0.5;
							}
						}
						//console.log(results);
						if(results>0){
							$("#display").html(pokemon1);
						}else if(results<0){
							$("#display").html(pokemon2);
						}else{ // if it is tie, compare their highest base stat
							var stat1 = getHighestStat(stats1); 
							var stat2 = getHighestStat(stats2);
							if(stat1<stat2){
								$("#display").html(pokemon2);
							}else{
								$("#display").html(pokemon1);
							}
						}
				});

			});
        }
    });
	



	function getPoke(poke){

          	return $.ajax({
            	url: 'http://pokeapi.salestock.net/api/v2/pokemon/'+ poke,
            	method: "GET",
            	dataType: "json",
            	success: function(data){
            	},
        		error: function() {
            		alert('The name or id does not exist, please check and enter again');
			}
          });	  
	}

	function getTypes(type){
          	return $.ajax({
            	url: type,
            	method: "GET",
            	dataType: "json",
            	success: function(data){
            },
        	error: function() {
            	alert('Error occured');
			}
          });	  
	}

	
	function fetchNames(types){
		var names = [];
		for(var i=0;i < types.length;i++){
			names.push(types[i].name);
		}
		return names;
		
	}
	
	function flatten(arr){
		return arr.reduce(function(a,b){
			return a.concat(b);
		},[]);

	}

	function getHighestStat(stats){
		var base = 0;
		for(var i=0;i <stats.length;i++){
			base = base < stats[i].base_stat ? stats[i].base_stat: base ;
		}
		return base;
	}

	$(document).ajaxStart(function () {
		$('#loading').show();  // show loading indicator
	});
	
	$(document).ajaxStop(function() 
	{
		$('#loading').hide();  // hide loading indicator
	});

});