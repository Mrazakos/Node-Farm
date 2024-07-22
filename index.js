
const fs = require('fs');
const http = require('http');
const { dirname } = require('path');
const url = require('url');
const templateCard = fs.readFileSync(__dirname + '/templates/template-card.html', 'utf-8')
const templateProduct = fs.readFileSync(__dirname + '/templates/template-product.html', 'utf-8')
const templateOverview = fs.readFileSync(__dirname + '/templates/template-overview.html', 'utf-8')
const data = fs.readFileSync(__dirname + '/dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);



const server = http.createServer((request, response) => {
    const { query, pathname } = url.parse(request.url, true);
    switch(pathname){
        //overview page
        case '/':
        case '/overview':
            const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join('');

            const overview = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
            response.end(overview);
            break;
        
        //Product page
        case '/product':
            const product = dataObj[query.id];
            const output = replaceTemplate(templateProduct, product);
            response.end(output);
            break;
        //API
        case '/api':
            response.writeHead(200 ,{
                'Content-type': 'application/json'
            });
            
            response.end(data);

            break;
        default:
            response.writeHead(404, {
                'Content-type': 'text/html',
                'my-own-header': 'hello world'
            });
            response.end("<h1>Page not found!</h1>");
    }
    
});

function replaceTemplate(temp, product){
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    } else{
        output = output.replace(/{%NOT_ORGANIC%}/g, '');
    }
    return output
}


server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});


