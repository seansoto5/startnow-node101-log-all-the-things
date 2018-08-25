const express =  require('express');
const fs =       require('fs');
const app =      express();

// write your logging code here
app.use((req, res, next) => {
    //Logging all info into individual variables and concat them into loggedData
    var agent = req.headers['user-agent'] + ',';
    var date = new Date().toISOString() + ',';
    var method = req.method + ',';
    var resource = req.url + ',';
    var version = 'HTTP/' + req.httpVersion + ',';
    var status = res.statusCode + ',' + '\n';
    var loggedData = agent + date + method + resource + version + status;
    //Appends the csv file with the new loggedData
    fs.appendFile('server/log.csv', loggedData, (err) => {
        if (err) throw err;
        console.log(loggedData);
    next()
    });
});

app.get('/', (req, res) => {
    res.status(200).send('Ok');
});

// write your code to return a json object containing the log data here
app.get('/logs', (req, res) => {
    //Reads the csv file, function inside converts csv data to JSON
    fs.readFile('server/log.csv', 'utf8', (err, data) => {
        function csvJSON(csv) {
            var lines = csv.split('\n');
            var result = [];
            var headers = lines[0].split(',');
            for (var i = 0; i < lines.length; i++) {
                var obj = {};
                var currentLine = lines[i].split(',');
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentLine[j];
                }
                result.push(obj);
            }
            return result;
        }
        res.json(csvJSON(data));
        res.end;
    });
});

module.exports = app;
