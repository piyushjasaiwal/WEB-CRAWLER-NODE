const crawl = require('./crawler')

function handleSubmit(e){
    e.preventDefault();

    const data = new FormData(e.target);

    const value = data.get('url');
    crawl.crawl({
        url:value,
        ignore:"./search"
    })
    // console.log({value});
}

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);