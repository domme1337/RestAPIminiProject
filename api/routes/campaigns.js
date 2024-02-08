const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { response } = require('../../app');

const Campaign = require('../models/campaign');
const Player = require('../models/player');

router.get('/', (req, res, next)=>{

    Campaign.find()
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            campaigns: docs.map(doc=>{
              return {
                    _id: doc._id,
                    campaignName: doc.campaignName,
                    worldSetting: doc.worldSetting, 
                    player1: doc.player1,
                    player2: doc.player2,
                    player3: doc.player3,
                    player4: doc.player4,
                    getCampaign: {
                        type: 'GET',
                        url: 'http://localhost:3000/campaigns/' + doc._id,
                    },
                    getPlayer1: {

                      type: 'GET',
                      url: 'http://localhost:3000/players/' + doc.player1,

                    },
                    getPlayer2: {

                      type: 'GET',
                      url: 'http://localhost:3000/players/' + doc.player2,

                    },
                    getPlayer3: {

                      type: 'GET',
                      url: 'http://localhost:3000/players/' + doc.player3,

                    },
                    getPlayer4: {

                      type: 'GET',
                      url: 'http://localhost:3000/players/' + doc.player4,

                    }

                }
            })       
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
});

router.post("/", (req, res, next) => {
    Player.findById(req.body.playerId)
      .then(player => {
        // if (!player) {
        //   return res.status(404).json({
        //     message: "Player not found"
        //   }).send();
        // }
        const campaign = new Campaign({
          _id: new mongoose.Types.ObjectId(),
          campaignName: req.body.campaignName,
          worldSetting: req.body.worldSetting,
          player1: req.body.player1,
          player2: req.body.player2,
          player3: req.body.player3,
          player4: req.body.player4
        });
        return campaign.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Campaign stored",
          createdCampaign: {
            _id: result._id,
            campaignName: result.campaignName,
            worldSetting: result.worldSetting,
            player1: result.player1,
            player2: result.player2,
            player3: result.player3,
            player4: result.player4
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/campaigns/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.get('/:campaignId', (req, res, next)=>{
    Campaign.findById(req.params.campaignId)
    .exec()
    .then(campaign=>{
        if(!campaign){
            return res.status(404).json({
                message: 'Campaign not found'
            })
        }
        res.status(200).json({
            campaign: campaign,
            request: {
                type: 'GET',
                url:  'http://localhost:3000/campaigns'
            }
        })
    })
    .catch((err)=> {
        res.status(500).json({
            error : err
        })
    })
});

router.delete("/:campaignId", (req, res, next) => {
    Campaign.deleteOne({ _id: req.params.campaignId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Campaign deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/campaigns",
            body: { playerId: "ID", quantity: "Number" }
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });

module.exports  = router;