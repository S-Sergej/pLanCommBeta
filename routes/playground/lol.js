const express = require('express');
const router  = express.Router();
const LeagueJs = require('leaguejs/lib/LeagueJS.js');


router.get('dev_playground', (req, res, next) =>{
  res.render('authorized/dev_playground');
})

router.post('authorized_main', (req, res, next) =>{
  const {name} = req.body;
  const leagueJs = new LeagueJs(process.env.LOL_API_KEY);
  leagueJs.Summoner
    .gettingByName(`${name}`)
    .then(data => {
        console.log("Name: ", data.name +"\n" + "Level: ", data.summonerLevel + "\n" + "AccountID: ", data.id);
        res.render('authorized/dev_playground', data);
    })
    .catch(err => {
        console.log(err);
        res.redirect('/dev_playground');
    });
})

module.exports = router;