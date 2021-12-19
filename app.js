const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/NBAPlayersDB", {useNewUrlParser: true});

const playerSchema = {
  Player: String,
  Year: String,
  Ppg: String,
  Rpg: String,
  Apg: String,
  Spg: String,
  Bpg: String
};

const Player = mongoose.model("Player", playerSchema);

//////////////////////////////////////////////Request Targetting all articles////////////////////////////////////

app.route("/players")

.get(function(err, res) {
  Player.find(function(err, foundPlayers){
    if (!err) {
      res.send(foundPlayers);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){
  const newPlayer = new Player({
    Player: req.body.Player,
    Year: req.body.Year,
    Ppg: req.body.Ppg,
    Rpg: req.body.Rpg,
    Apg: req.body.Apg,
    Spg: req.body.Spg,
    Bpg: req.body.Bpg
  });

  newPlayer.save(function(err){
    if (!err){
      res.send("Successfully added a new player")
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Player.deleteMany(function(err){
    if (!err) {
      res.send("Successfully deleted all players")
    } else {
      res.send(err);
    }
  });
});

//////////////////////////////////////////////Request Targetting a specific articles////////////////////////////////////

app.route("/players/:playerTitle")

.get(function(req, res){
  Player.findOne({player: req.params.playerTitle}, function(err, foundPlayer){
    if (foundPlayer){
      res.send(foundPlayer);
    } else {
      res.send("No players matching that name was found");
    }
  });
})

.put(function(req, res){
  Player.replaceOne(
    {Player: req.params.playerTitle},
  {
    Player: req.body.Player,
    Year: req.body.Year,
    Ppg: req.body.Ppg,
    Rpg: req.body.Rpg,
    Apg: req.body.Apg,
    Spg: req.body.Spg,
    Bpg: req.body.Bpg
  },
  function(err){
    if(!err){
      res.send("Successfully updated player.")
    }
  }
);
})

.patch(function(req, res){
  Player.updateOne(
    {Player: req.params.playerTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated player.")
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Player.deleteOne(
    {Player: req.params.playerTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted player.")
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
