const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

var returnNull = {
    unix: null,
    natural: null
}

function getNaturalDate(date) {
    let month = date.getMonth() + 1;
    switch (month) {
        case 1:
            month = 'January';
            break;
        case 2:
            month = 'February';
            break;
        case 3:
            month = 'March';
            break;
        case 4:
            month = 'April';
            break;
        case 5:
            month = 'May';
            break;
        case 6:
            month = 'June';
            break;
        case 7:
            month = 'July';
            break;
        case 8:
            month = 'August';
            break;
        case 9:
            month = 'September';
            break;
        case 10:
            month = 'October';
            break;
        case 11:
            month = 'November';
            break;
        case 12:
            month = 'December';
            break;
    }
    let day = date.getDate();
    let year = date.getFullYear();
    // console.log(year);
    return month + ' ' + day + ', ' + year;
}

app.use(express.static(__dirname + '/public'))

app.use('/:date', function(req, res, next) {
    let date = req.params.date;

    // Check Unix
    var re = new RegExp(/\d{5,10}/g);
    var digit = re.test(date);

    //Check Date
    var re1 = new RegExp(/[a-zA-Z]/g);
    var alphabet = re1.test(date);


    if((digit && alphabet) || (digit && date.length > 10)) {
        req.body = returnNull;
        next();
    }

    if(digit) {
        date = parseFloat(date);
        var unixValue = (date + 19800) * 1000;
        var d = new Date(unixValue);
        let finalDate = getNaturalDate(d);
        req.body = {
            unix: date,
            natural: finalDate
        }
        next();
    }
    
    if(alphabet) {
        var d = new Date(date);
        if(d == 'Invalid Date') {
            req.body = returnNull;
            next();
        }
    
        //Convert milliseconds to seconds and adjust for timezone
        let unix = d.getTime();
        unix = (unix/1000) + 19800;
    
        let finalDate = getNaturalDate(d);
    
        req.body = {
            unix: unix,
            natural: finalDate,
        }
        next();
    }
})

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

app.get('/:date', function(req, res) {
    var time = req.body;
    res.json(time);
})

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
})

app.listen(3000, function() {
    console.log('Server running on 3000');
})