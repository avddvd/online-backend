import * as PubSub from '@google-cloud/pubsub';
import * as functions from 'firebase-functions';

// config
const config = functions.config();
const topicName = config.pubsubtopic.name;

// pubsub
const pubsub = new PubSub();

export const publishMessage = async (data) => {
  const dataBuffer = Buffer.from(JSON.stringify(data));
  try {
    await pubsub.topic(topicName).publisher().publish(dataBuffer);
  }
  catch(err){
    console.log('ERROR: error publishing message', err);	
  }
}
