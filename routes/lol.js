const express = require('express');
const router  = express.Router();
const LeagueJs = require('leaguejs/lib/LeagueJS.js');


router.get('authorized_main', (req, res, next) =>{
  res.render('auth/authorized_main');
})

router.post('authorized_main', (req, res, next) =>{
  const {name} = req.body;
  const leagueJs = new LeagueJs(process.env.LOL_API_KEY);
  leagueJs.Summoner
    .gettingByName(`${name}`)
    .then(data => {
        console.log("Name: ", data.name +"\n" + "Level: ", data.summonerLevel + "\n" + "AccountID: ", data.id);
        res.render('auth/authorized_main', data);
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    });
})

module.exports = router;