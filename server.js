const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
let path = require('path');

const app = express();
const port = 3000;

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

function checkIdExists(req, res, next) {
    fs.readFile('./dev-data/feedbacks.json', 'utf-8', (err, data) => {
        if (err) {
            res.send(401).json({ message: "Bad Request" });
        }
        let feedbacks = JSON.parse(data);
        // Initial for req.feedback and req.check
        req.feedback = [];
        req.check = 0;
        req.index = -1;
        req.id = -1;
        req.feedbacks = feedbacks;
        // Filter request in data
        req.id = feedbacks[feedbacks.length - 1].id + 1;
        req.feedback = feedbacks.reduce((obj, item, _index) => {
            if (item.id == Number(req.params.idq)) {
                obj.push(item);
                req.index = _index;
            }
            return obj;
        }, []);
        if (req.feedback.length != 0) {
            req.check = 1;
        }
        next();
    })
}

function checkTitleExists(req, res, next) {
    fs.readFile('./dev-data/feedbacks.json', 'utf-8', (err, data) => {
        if (err) {
            res.send(401).json({ message: "Bad Request" });
        }
        let feedbacks = JSON.parse(data);
        // Initial for req.feedback and req.check
        req.feedback = [];
        req.feedbacks = feedbacks;
        // Filter request in data
        req.feedback = feedbacks[0].feedback;
        next();
    })

}

let updateReviews = (data, id, newObj) => {
    return data.reduce((obj, item) => {
        if (id == item.id) {
            let updateOpj = {
                ...item
            }
            updateOpj.feedback.push(newObj);
            obj.push(updateOpj);
        }
        else {
            obj.push(item)
        }
        return obj
    }, [])
};

app.get('/api/v1/feedbacks', (req, res) => {
    fs.readFile('./dev-data/feedbacks.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(401).json({ message: "Bad Request" });
        }
        let feedbacks = JSON.parse(data);
        res.status(200).json(feedbacks);
    })
});
app.get('/api/v1/feedbacks/:id', checkIdExists, (req, res) => {
    if (req.check == 1) {
        res.status(200).json(req.feedback);
    }
    else {
        res.status(201).json({ message: "Data not found" });
    }
});

app.post('/api/v1/feedbacks', checkTitleExists, (req, res) => {

    req.feedback.push(req.body);
    let newFeedBack = [{
        "id": req.feedbacks[0].id,
        "title": req.feedbacks[0].title,
        "feedback": req.feedback
    }]
    fs.writeFile('./dev-data/feedbacks.json', JSON.stringify(newFeedBack), (err) => {
        if (err) {
            res.status(401).json({ message: "Bad Request" });
        }
        res.status(200).json({ message: "Create successfully" });
    })

});

app.put('/api/v1/question/:idq/feedbacks/:idf', checkIdExists, (req, res) => {
    if (req.check == 1) {
        req.feedbacks[0].feedback.splice(Number(req.params.idf),1,req.body)
        fs.writeFile('./dev-data/feedbacks.json', JSON.stringify(req.feedbacks), (err) => {
            if (err) {
                res.status(401).json({ message: "Bad Request" });
            }
            res.status(200).json({ message: "Update successfully" });
        });
    }
    else {
        res.status(201).json({ message: "Question not found" });
    }
});

app.delete('/api/v1/question/:idq/feedbacks/:idf', checkIdExists, (req, res) => {
    if (req.check == 1) {
        req.feedbacks[req.index].feedback.splice(Number(req.params.idf), 1);
        fs.writeFile('./dev-data/feedbacks.json', JSON.stringify(req.feedbacks), (err) => {
            if (err) {
                res.status(401).json({ message: "Bad Request" });
            }
            res.status(200).json({ message: "Delete successfully" });
        })
    }
    else {
        res.status(201).json({ message: "Feedback not found" });
    }
});

app.get('/', (req, res) => {
    var options = {
        root: path.join(__dirname, './public')
    };
    res.sendFile('index.html', options);
});

app.listen(port, () => {
    console.log(`Example app listening on port http://127.0.0.1:${port}`);
});
