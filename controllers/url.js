const Shortid=require('shortid')
const URL=require('../model/url')
const shortid = require('shortid')
async function generateNewShortURL(req,res) {
    const shortid=Shortid()
    const body=req.body
    if (!req.user) {
        return res.redirect('/login');
    }
    if(!body.url) 
        return res.status(400).json({error:"url is required"})
    await URL.create({
        shortId:shortid,
        redirectURL:body.url,
        visitHistory:[],
        createdBy:req.user._id,
    })
    return res.render('home',{
        id: shortid,
    })
}
async function getAnalytics(req,res) {
    const shortId=req.params.shortId
    const result=await URL.findOne({shortId})
    return res.json({totalClicks:result.visitHistory.length,
        analytics:result.visitHistory})
}
module.exports={
    generateNewShortURL,getAnalytics
}