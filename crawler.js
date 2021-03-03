const down = require('./download')
const cheerio = require('cheerio')
const urlParser = require('url')
const fetch = require('node-fetch')
const path = require('path')
const fs  = require('fs')
const seenUrls = {};

const getUrl = (link, host, protocol) =>{
    if(link.includes('http')){
        return link;
    }else if (link.startsWith('/')){
        return `${protocol}//${host}${link}`;
    }else{
        return `${protocol}//${host}/${link}`;
    }
};

const crawl = async({url, ignore}) => {
    if(seenUrls[url]){
        return ;
    }

    console.log("crawling the link ",url);
    seenUrls[url] = true;

    const {host, protocol} = urlParser.parse(url);

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    if(response.statusCode == 404){ return ; }
    
    const links = $("a").map((i,link) => link.attribs.href).get()

    const imgUrls = $("img")
    .map((i,link) => link.attribs.src).get();

    imgUrls.forEach((imageUrl) => {
        const URL = getUrl(imageUrl, host, protocol);
        const file_name = path.basename(URL);
        down.download(URL, './images',file_name);
    });

    links
    .filter((link) => link.includes(host) && !link.includes(ignore))
    .forEach((link) => {
        crawl({
            url:getUrl(link, host, protocol),
            ignore,
        });
    });
};

crawl({
    url: "https://collegeinfogeek.com/",
    ignore : '/search'
});