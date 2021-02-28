const rp = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table')


const options = {
    url:`https://forum.freecodecamp.org/directory_items?period=weekly&order=likes_received&_=1518604435748`,
    json:true
}
let table = new Table({
    head : ['username', 'likes', 'challanges'],
    colWidths :[15,5,10]
});


rp(options)
.then((data) => {
    let userdata = [];
    for (let user of data.directory_items){
        userdata.push({name : user.user.username, likes_received:user.likes_received});
    }

    process.stdout.write('loading');
    getChallangesCompletedPushToUserArray(userdata);  
})
.catch((err)=>{
    console.log(err);
});

function getChallangesCompletedPushToUserArray(userData){
    var i = 0;
    function next() {
        if(i < userData.length){
            var options = {
                url:'https://www.freecodecamp.org/' + userData[i].name,
                transform:body => cheerio.load(body)
            }
            rp(options)
            .then(function($){
                proces.stdout.write(".");
                const fccAccount = $('h1.landing-heading').length == 0;
                const challangePassed = fccAccount ? $('tbody tr').length : 'unknown';
                table.push([userData[i].name, userData[i].likes_received, challangePassed]);
                ++i;
                return next();
            })
        }else{
            printData();
        }
    }
    return next();
}

function printData(){
    console.log("done");
    console.log(table.toString());
}