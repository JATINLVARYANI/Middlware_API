// console.log("hii");

var express = require('express'); // requre the express framework
var app = express();
var fs = require('fs'); //require file system object
const xml2js = require('xml2js');
const builder = new xml2js.Builder();
const js2xmlparser = require("js2xmlparser");
const axios = require('axios');
const bodyParser = require('body-parser');
const xmlData = '<Students><student><roll>20211002</roll></student></Students>';
const options = {
    explicitArray: false,
  };
  const options2 = {
    declaration: {
      encoding: "UTF-8",
    },
  };
const config = {
    headers: {
      'Content-Type': 'application/xml'
    }
  };
var jsonData;

// Endpoint to Get a list of users
app.get('/getStuCivil', function(req, res){
    fs.readFile(__dirname + "/" + "stu.json", 'utf8', function(err, data){
        const DetailXml = builder.buildObject({Students: {student: JSON.parse(data)}});
        // console.log(DetailXml);
        res.end(DetailXml); // you can also use res.send()
    });
})



 app.use(bodyParser.text({ type: 'application/xml' }));
 app.use(bodyParser.json());

 app.post('/CvId', function (req, res) {
    // First retrieve existing user list
     const indta = req.body;
    //  const injs = JSON.stringify(indta);
    xml2js.parseString(indta, options, (err, result) => {
        if (err) {
          console.error(err);
        } else {
           jsonData = result;
          console.log(jsonData.Students.student.roll);
        }
      });
     fs.readFile( __dirname + "/" + "stu.json", 'utf8', function (err, data) {
        
        var users = JSON.parse(data);
      
         const element = users.find(item => item.roll_no === jsonData.Students.student.roll);
         res.type('application/xml');
         const r = js2xmlparser.parse("Students", element, options2);
         console.log(r);
         res.send(r);
        //  console.log(typeof(jsonData.Students.student.roll));
    //    console.log(injs);
        //  res.end( JSON.stringify(element));
        //  res.setHeader('Content-Type', 'text/xml');
        //  res.type('application/xml');
        //  res.send(JSON.stringify({ element }));
    });
    // console.log(req.body);
    // console.log(r);
    // res.setHeader('Content-Type', 'text/xml');
     res.type('application/json');
    //  console.log(element);
    // res.end(element);
    
 })

// Create a server to listen at port 8080
var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("REST API demo app listening at http://%s:%s", host, port)
})