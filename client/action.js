  var currentData;
  var id = -1;
  var color = "";
  var pvc = false;
  var test = false;
function action(){


  // Action event for button "New Game"
  $("#newGameButton").click(function(){
          test = true;
          $.post("/player/pvc/b",
            function(data,status){
             color = data.player;
             id = data.id;
             
                    newBoard();
                    update(true,data);
            });
          });
  $("#MCButton").click(function(){
          var simulation = document.getElementById('simulation').value;
          $.post("/game/"+id+"/aiplay/montecarlo/"+simulation,
            function(data,status){
              //if(data.isValid == "True"){
                //change the board information
                    update(false,data);
            });
          });
  $("#AIButton").click(function(){
    var evaluation = jQuery( 'input[name=evaluation]:checked' ).val();
    var search = jQuery('input[name=search]:checked').val();
    var depth = document.getElementById('depth').value;
          //alert($(this).attr('id'));
          $.post("/game/"+id+"/aiplay/"+evaluation+"/"+search+"/"+depth,
            function(data,status){
              //if(data.isValid == "True"){
                    
                //change the board information
                   update(false,data);
            });
          });
  $("canvas").click(function(){
    if(test){
      color = currentData.player;
    }

    if(color == currentData.player){
      $.post("/game/"+id+"/validmove/"+$(this).attr("id"),
        function(data,status){
          update(false,data);
          //alert(currentData.player);
        
          if(pvc && color != currentData.player){// computer move
            setTimeout(function(){
            $.post("/game/"+id+"/aiplay/greedy/alphabeta/3",
              function(data,status){
                update(false,data);
              });
            },1000);
          }
        });
      // nested inside, if write function in here, they will call at the same
    }
  });
  $("canvas").mouseenter(function(){
    updateBoardS("on",currentData.board,currentData.moves,currentData.player);
  });
  $("canvas").mouseleave(function(){
    updateBoardS("off",currentData.board,currentData.moves,currentData.player);
  });


  $("#joinButton").click(function(){
          
    $.post("/player/pvp/0",
      function(data,status){
        color = data.color;
        id = data.id;
        //alert(id);
        newBoard();
        update(true,data);
        scolor = "White";
        if(color == 'b'){
          scolor = "Black";
        }
        $("#idP").text("You are "+scolor+".");
      });
  });
  $("#playButton").click(function(){
    pvc = true;
    $.post("/player/pvc/b",
      function(data,status){
        color = data.color;
        id = data.id;
        //alert(id);
        newBoard();
        update(true,data);
        scolor = "White";
        if(color == 'b'){
          scolor = "Black";
        }
        $("#idP").text("You are "+scolor+".");
      });
  });
} 

function updataGame(){
  setInterval(function(){
  $.get("/game/"+id+"/get",
      function(data,status){
        if(data.board != currentData.board){
          update(false,data);
        }
      });
  },1000);
}


function update(ini,data){
  currentData = data;
  updateBoardS("on",data.board,data.moves,data.player);
  //change the board title
  updateBoardTitle(data.player,data.serror,data.count,data.end);
  //update Game Logger
  updateLogger(ini,data.player,data.move,data.lboard,data.moves);
}

