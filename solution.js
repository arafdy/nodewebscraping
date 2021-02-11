const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');



const url = 'https://www.cermati.com/artikel';

request(url).then(function(html){
  const $ = cheerio.load(html);
  
  $('div.article-list-item a').each((index, elem) => {
    var result = $(elem).attr('href').replace('/artikel','');
      //console.log(index,result);

      request(url+result).then(function(body){
        const $ = cheerio.load(body)


        var title = $('h1.post-title').contents().first().text().trim()
        var author_name = $('span.author-name').contents().first().text().trim()
        var posting_date = $('span.post-date span').contents().first().text().trim()
        
        var related = [];
        var urls = [];
        var related_tittle = [];
        
        $('div.margin-bottom-30 ul.panel-items-list li a').each((index,elem)=>{
          urls.push(url + $(elem).attr('href').replace('/artikel',''))
        });

        $('div.margin-bottom-30 ul.panel-items-list h5.item-title').each((index,elem)=>{
          related_tittle.push($(elem).text())
        });

        // urls = urls.slice(1, 6);
        // related = related.slice(1 ,6);

        for (var i = 0 ; i <= 5 ; i++){
          related.push(
            {
              "url": urls[i],
              "title": related_tittle[i]
            }
          )

        }
        


        var jsondata = {
          'url': url+result,
          'title': title,
          'author': author_name,
          'postingDate': posting_date,
          'related_article': related,

        }
        console.log(jsondata);
        var data = JSON.stringify(jsondata,null,4);
        fs.writeFileSync('article-data.json',data);
      })
    })
})
