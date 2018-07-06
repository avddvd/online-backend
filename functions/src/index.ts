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
	res.status(200).end();
	try {
		await publishEvent(data);
	}
	catch(err) {
		console.log('error publishing event');
	}
});

exports.online = functions.https.onRequest(app);

//export const views = functions.https.onRequest(async (request, response) => {
//  if (request.method === 'POST') {
//    try {
//		  // TOMOVE: start
//
//		  // collect important event data
//      const body = request.body;
//      const headers = request.headers;
//      const data = {}
//      for (const key in body) {
//        data[key] = body[key];
//      }
//      data['x-forwarded-for'] = headers['x-forwarded-for'];
//      data['user-agent'] = headers['user-agent'];
//
//		  // normalize url
//      data['normalizedUrl'] = normalizeUrl(data['url']);
//		  // set md5 hash of url 
//		  const urlMD5Hash = crypto.createHash('md5').update(data['normalizedUrl']).digest("hex");
//		  data['urlMD5Hash'] = urlMD5Hash;
//
//		  // set data to Cloud Firestore
//		  const addDoc = await db.collection('views').add(data);
//      return corsWithOptions(request, response, () => {
//        response.status(200).send();
//      });
//    } catch (error) { 
//      console.log(error);
//      return corsWithOptions(request, response, () => {
//        response.status(500).send();
//      }); 
//    }
//		// TOMOVE: end
//  } else {
//		return corsWithOptions(request, response, () => {
//			response.status(405).send();
//		});
//  }
//});
