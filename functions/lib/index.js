"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// import * as admin from 'firebase-admin';
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const pubsubHelper = require("./pubsub");
const consumer = require("./consumer");
// config
const config = functions.config();
const topicName = config.pubsubtopic.name;
//get router
const app = express();
//options for cors midddleware
const options = {
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
const publishEvent = (data) => __awaiter(this, void 0, void 0, function* () {
    try {
        // await db.collection('views').add(data);
        yield pubsubHelper.publishMessage(data);
    }
    catch (err) {
        console.log('error writing to firebase CloudStore', err);
    }
});
app.get('/views', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.query;
    const headers = req.headers;
    data['xForwardedFor'] = headers['x-forwarded-for'];
    data['userAgent'] = headers['user-agent'];
    res.status(201).send();
    try {
        yield publishEvent(data);
    }
    catch (err) {
        console.log('error publishing event');
    }
}));
app.post('/visits', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = req.body;
    data['xForwardedFor'] = req.headers['x-forwarded-for'];
    data['userAgent'] = req.headers['user-agent'];
    try {
        yield publishEvent(data);
    }
    catch (err) {
        console.log(`ERROR: error saving data: ${err}`);
    }
    res.status(201).send();
}));
exports.online = functions.https.onRequest(app);
exports.consumeViews = functions.pubsub.topic(topicName).onPublish(consumer.consumeMessage);
//# sourceMappingURL=index.js.map