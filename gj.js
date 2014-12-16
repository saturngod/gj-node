var random_quote = function(callback) {


  var http = require("http");

  var options = {
    host: 'www.geeksjargon.com',
    port: 80,
    path: '/quote/refresh',
    method: 'GET'
  };

  var req = http.request(options, function(res) {

    var data = "";
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      data +=chunk;

    });

    res.on('end', function(){
      var json = JSON.parse(data.toString());
      var template = json["template"];
      template = template.replace(/(\r|\n|\t)*/g,"");//why why ... need to clean first

      get_all_info(template,callback);//time to get the data


    })
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });


  req.end();

}


//extra function , but dirty code for now

function get_all_info(template,callback)
{
  var api_response = {};
  api_response["quote"] = getRegexData(template,'<div class="quote">(.*?)<\/div>',0);
  api_response["author_name"] = getRegexData(template,'<div class="author_name">(.*?)<\/div>',0);
  api_response["author_info"] = getRegexData(template,'<div class="author_info">(.*?)<\/div>',0);

  var tags_links =  getRegexData(template,'<div class="tags">(.*?)<\/div>',0);
  api_response["tags"] = getTextFromLinks(tags_links);

  var reference_link = getRegexData(template,'<div class="reference_link">(.*?)<\/div>',0);
  api_response["ref_link"] = getReferenceLink(reference_link);

  callback(api_response);

}

function getRegexData(string,expression,index) {

  var myRegexp = new RegExp(expression,"ig");
  var match = myRegexp.exec(string);

  if(match && match.length >= index+1) {
    return unescape(match[index+1]);
  }
  else {
    return "";
  }


}

function getTextFromLinks(links) {
  var matches = [];
  var search = links.replace(/<a(.*?)>(.*?)<\/a>/g, function () {
    matches.push(unescape(arguments[2]));
  });

  return matches;
}

function getReferenceLink(html) {

  myRegexp = new RegExp('href="([^\'\"]+)',"ig");
  match = myRegexp.exec(html);
  if(match && match.length > 0) {
    return unescape(match[1]);
  }
  return "";

}


exports.random_quote = random_quote;
