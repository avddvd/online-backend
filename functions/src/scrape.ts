import * as rp from 'request-promise-native'

export const crawlUrl = async (url) => {
  console.log(`requesting url: ${url}`);
  try {
    const responseBody = await rp(url)
    console.log(`response is : ${responseBody}`);
  }
  catch(err) {
    console.log(`ERROR: error when calling url: ${url}, ${err}`);
  }
}

crawlUrl('https://www.google.com')
  .then(() => {
    console.log('got response');
  })
  .catch(() => 'obligatory catch')
