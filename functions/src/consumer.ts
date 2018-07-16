import * as functions from 'firebase-functions';
// import * as BigQuery from '@google-cloud/bigquery';
import * as admin from 'firebase-admin';
import * as nlp from './nlp'

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
export const consumeMessage = async (message) => {
  try {

    // Decode the PubSub Message body.
    const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
    const messageJson = JSON.parse(messageBody);
    console.log(messageJson);
    if (messageJson.textLength > 100) {
      const nlpRes = await nlp.analyzeText(messageJson.textContent);
      messageJson["documentSentiment"] = nlpRes.documentSentiment;
      messageJson["categories"] = nlpRes.categories;
    }
    //await table.insert(messageJson);
    await db.collection('visits').add(messageJson);
    return true;
  }
  catch(err) {
    console.log('ERROR: error consuming/inserting message', err);
    return false;
  }
};
