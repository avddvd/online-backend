import * as functions from 'firebase-functions';
import * as BigQuery from '@google-cloud/bigquery';

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
    console.log('message type: ', typeof(JSON.parse(messageBody)));
    console.log(JSON.parse(messageBody));
    const inserted = await table.insert(JSON.parse(messageBody));
    console.log('inserted doc: ', inserted);
    return true;
  }
  catch(err) {
    console.log('ERROR: error consuming/inserting message');
    return false;
  }
};
