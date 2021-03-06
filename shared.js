var RP = require('request-promise');
var $ = require('cheerio');

var POSITION_LOOKUP = {
  'pos1' : 'Goalkeeper',
  'pos2' : 'Fullback',
  'pos3' : 'Centre Back',
  'pos4' : 'Midfielder',
  'pos5' : 'Defender',
  'pos6' : 'Striker'
}

function PL(){}

PL.prototype = {

  getHTMLContent : function (url) {

    // do some code
    var options = {
      url : url
    }
    
    return RP.get(options)
    .catch(function(e){
      console.log(e);
      throw e;
    })
    .then(function(response){
      var players = [];
      $('.player-list-table tr', response).each(function(index, value) {
        if(index === 0){
          return true; //skip iteration
        }
        var v = value;
        var positionClass = $('td', $(v)).eq(0).find('div').attr('class') || null;
        var playerPosition = (positionClass) ? POSITION_LOOKUP[positionClass.replace(/((pos)([^0-9]{1}))/ig,'')] : null;
        var playerName = $('td', $(v)).eq(1).find('a').text();
        var teamClass = $('td', $(v)).eq(3).find('div').attr('class') || null;
        //console.log(teamClass);
        var playerTeam = (teamClass) ? teamClass.match(/(club-tiny-(.*))/g)[0].replace('club-tiny-', '') : null;
        playerTeam = (playerTeam) ? playerTeam.replace('-', ' ') : playerTeam;
        var playerCost = $('td', $(v)).eq(5).text();

        var player = {
          name : playerName,
          team : playerTeam,
          //points : playerPoints,
          price : playerCost,
          position : playerPosition
        }
        players.push(player);
      });
      //players = this.lastPlayer(players);
      return players;
    });

},
playerSearchName : function(array, name) {
  console.log('playerSearchName');
  var players = [];
  $(array).each(function(index, value){

    var playerName = value.name.toLowerCase().replace(/\s/g,'');

    if(playerName.indexOf(name.toLowerCase()) > -1){
      var player = {
        name : value.name,
        team : value.team,
        points : value.points,
        price : value.price,
        position : value.position
      }
      players.push(player);
    }
  });

  players = this.lastPlayer(players);
  return players;
},
teamsOnly : function(array){
  var teams = [];
  var arrayObject = [];

  $(array).each(function(index, value){
    var playerTeam = value.team.trim();
    if(teams.indexOf(playerTeam) === -1){
      teams.push(playerTeam);
      var t = {
        name : false,
        team : playerTeam,
        points : false,
        price : false,
        position: false
      }
      arrayObject.push(t);
    }
  });
  arrayObject = this.lastPlayer(arrayObject);
  return arrayObject;

},
teamSearch : function(array, name){
  console.log('teamSearch');
  var players = [];
  $(array).each(function(index, value){
    var playerTeam = value.team.toLowerCase().trim();
    if(playerTeam.indexOf(name.toLowerCase()) > -1){
      var player = {
        name : value.name,
        team : value.team,
        points : value.points,
        price : value.price,
        position : value.position
      }
      players.push(player);
    }
  });
  players = this.lastPlayer(players);
  return players;
},
teamSort : function(array){
  array.sort(function(a, b){
    if(a.team < b.team) return -1;
    if(a.team > b.team) return 1;
    return 0;
  });
  return array;
},
lastPlayer : function(array){
    //this determines the last item of the array and applies the last identifier 
    //to the json request for us to display
    if(array.length){
      array[array.length - 1].last = true;
    }
    return array;
  }

}

module.exports = PL;

// function lastPlayer (array) {
//   //this determines the last item of the array and applies the last identifier 
//   //to the json request for us to display
//   if(array.length){
//     array[array.length - 1].last = true;
//   }
//   return array;
// }