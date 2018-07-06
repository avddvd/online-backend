import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as pubsubHelper from './pubsub';

// Cloud Firestore db initialization
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();


//get router
const app = express();

//options for cors midddleware
const options:cors.CorsOptions = {
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: true,
  preflightContinue: false
};

//use cors middleware
app.use(cors(options));

// use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//enable pre-flight
app.options("*", cors(options));
app.all('*', (req, res, next) => {
  const origin = req.get('origin'); 
  res.header('Access-Control-Allow-Origin', origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }
});

//add your routes
app.get('/health', (req, res) => {
	console.log('called views endpoint');
	res.send('OK');
});

const publishEvent = async (data) => {
	try {
		await db.collection('views').add(data);
		await pubsubHelper.publishMessage(data);
	}
	catch(err) {
		console.log('error writing to firebase CloudStore', err);	
	}
}

app.get('/views', async (req, res) => {
	const data = req.query;
	const headers = req.headers;		
  data['x-forwarded-for'] = headers['x-forwarded-for'];
  data['user-agent'] = headers['user-agent'];
	res.status(201).send();
	try {
		await publishEvent(data);
	}
	catch(err) {
		console.log('error publishing event');
	}
});

exports.online = functions.https.onRequest(app);
