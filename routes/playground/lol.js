const express = require('express');
const router  = express.Router();
const LeagueJs = require('leaguejs/lib/LeagueJS.js');


router.get('/', (req, res, next) =>{
  res.render('dev_playground');
})

router.post('/', (req, res, next) =>{
  const {name} = req.body;
  const leagueJs = new LeagueJs(process.env.LOL_API_KEY);
  console.log("something happens here")
  leagueJs.Summoner
    .gettingByName(`${name}`)
    .then(data => {
        console.log("Name: ", data.name +"\n" + "Level: ", data.summonerLevel + "\n" + "AccountID: ", data.id);
        res.render('dev_playground', data);
    })
    .catch(err => {
        console.log(err);
        res.redirect('/lol');
    });
})

module.exports = router;