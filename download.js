const axios = require('axios')
const Fs = require('fs')
const Path = require('path')

async function download(URL, folder, name) {
    const url = URL
    const path = Path.resolve(__dirname, folder, name);

    const response =axios({
        method:'GET',
        url:url,
        responseType: 'stream'
    }).then(function(response){
        response.data.pipe(Fs.createWriteStream(path));
        console.log('download Finished');
        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                resolve();
            })

            response.data.on('error',(err) =>{
                reject(err);
            })
        }).catch();
    })   
}

// download("https://unsplash.com/photos/d6Eyz_B1PtQ/download?force=true", './images', "waterfall.jpg");

module.exports.download = download;