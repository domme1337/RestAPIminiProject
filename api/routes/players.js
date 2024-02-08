const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Player = require('../models/player');

router.get('/', (req, res, next) =>{
    Player.find()
    .select('name level _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            players: docs.map(doc=>{
                return {
                    name: doc.name,
                    class:  doc.class,
                    level: doc.level,
                    backround: doc.backround,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        name: doc.name,
                        url: 'http://localhost:3000/players/' + doc._id
                    }
                }
            })
        };

         res.status(200).json(response);

    })
    .catch(err=>{
        console.error(err);
        res.status(500).json({
            error: err
        })
    })
});

router.post('/', (req, res, next) =>{

    const player = new Player({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        class: req.body.class,
        level: req.body.level,
        backround:  req.body.backround
    });
    player
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Handling POST requests to /player",
            createdPlayer : {
                name: req.body.name,
                class: req.body.class,
                level: req.body.level,
                backround:  req.body.backround,
                request:{
                    type: 'GET',
                    name: result.name,
                    url: 'http://localhost:3000/players/' + result._id
                }
            }
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
        error: err
        });
    });
});

router.get('/:playerId', (req, res, next)=>{
    const id = req.params.playerId;
    Player.findById(id)
    .select('name level class _id')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
        res.status(200).json({
            player: doc,
            request:{
                type: 'GET',
                description: 'GET all Players',
                url: 'http://localhost:3000/players/'
            }
        })
        } else {
            res.status(404).json({message: 'No valid entry found for provided ID'})
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
        });
    });

router.patch('/:playerId', (req, res, next)=>{
    const id =  req.params.playerId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Player.updateOne({_id:id},{$set: updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Player updated',
            request:{
                type: 'GET',
                url: 'http://localhost:3000/players/' + id
            }
        });
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});    

router.delete('/:playerId', (req, res, next)=>{
    const id = req.params.playerId
    Player.deleteOne({_id:id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message:'Deleted player',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/players',
                body: {name: 'String', level: 'Number'}
            }
        });
    }).catch(err=>{
        console.log('really', err);
        res.status(500).json({
            error: err
        });
    });
});    

module.exports  = router;