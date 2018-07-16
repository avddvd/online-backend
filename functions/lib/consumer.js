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
// import * as BigQuery from '@google-cloud/bigquery';
const admin = require("firebase-admin");
const nlp = require("./nlp");
// import * as scrape from './scrape';
// Cloud Firestore db initialization
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
// config
// const config = functions.config();
// const datasetName = config.bigquery.dataset;
// const tableName = config.bigquery.table;
// bigquery
// const bigquery = new BigQuery();
// const dataset = bigquery.dataset(datasetName);
// const table = dataset.table(tableName);
// pubsub trigger function
exports.consumeMessage = (message) => __awaiter(this, void 0, void 0, function* () {
    try {
        // Decode the PubSub Message body.
        const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
        const messageJson = JSON.parse(messageBody);
        console.log(messageJson);
        if (messageJson.textLength > 100) {
            const nlpRes = yield nlp.analyzeText(messageJson.textContent);
            messageJson["documentSentiment"] = nlpRes.documentSentiment;
            messageJson["categories"] = nlpRes.categories;
        }
        //await table.insert(messageJson);
        yield db.collection('visits').add(messageJson);
        return true;
    }
    catch (err) {
        console.log('ERROR: error consuming/inserting message', err);
        return false;
    }
});
//# sourceMappingURL=consumer.js.map