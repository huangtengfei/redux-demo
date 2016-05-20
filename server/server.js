
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

const COMMENTS_FILE = './comments.json';

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 
		'GET,POST,PUT,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 
		'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
	next();
})

app.get('/api/comments', (req, res) => {
	fs.readFile(COMMENTS_FILE, (err, data) => {
		if(err){
			console.log(err);
			process.exit(1);
		}
		res.json(JSON.parse(data));
	})
})

app.post('/api/comments', function(req, res) {
	fs.readFile(COMMENTS_FILE, (err, data) => {
		if(err){
			console.log(err);
			process.exit(1);
		}
		let comments = JSON.parse(data);
		let newComment = {
			id: Date.now(),
			author: req.body.author,
			text: req.body.text,
	    };
	    comments.push(newComment);
	    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), (err, data) => {
	    	if(err){
				console.log(err);
				process.exit(1);
			}
			res.json(newComment);
	    });
	});
});

app.listen(3000, () => {
	console.log('server started at 3000...')
})
