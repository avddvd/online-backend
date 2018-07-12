import * as functions from 'firebase-functions';
import * as BigQuery from '@google-cloud/bigquery';
// import * as scrape from './scrape';

// config
const config = functions.config();
const datasetName = config.bigquery.dataset;
const tableName = config.bigquery.table;

// bigquery
const bigquery = new BigQuery();
const dataset = bigquery.dataset(datasetName);
const table = dataset.table(tableName);

// pubsub trigger function
export const consumeMessage = async (message) => {
  try {

    // Decode the PubSub Message body.
    const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
    const messageJson = JSON.parse(messageBody);
    console.log(messageJson);
    await table.insert(messageJson);
    return true;
  }
  catch(err) {
    console.log('ERROR: error consuming/inserting message', err);
    return false;
  }
};
