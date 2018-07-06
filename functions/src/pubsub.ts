import * as PubSub from '@google-cloud/pubsub';
import * as functions from 'firebase-functions';

// config
const config = functions.config();
const pubsub = new PubSub();
const topicName = config.pubsubtopic.name;

export const publishMessage = async (data) => {
  const dataBuffer = Buffer.from(JSON.stringify(data));
  try {
    const message = await pubsub.topic(topicName).publisher().publish(dataBuffer);
    console.log(`Message ${message} published`);
  }
  catch(err){
    console.log('ERROR: error publishing message', err);	
  }
}
