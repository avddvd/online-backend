import * as language from '@google-cloud/language'

const features = {
  "extractSyntax": true,
  "extractEntities": true,
  "extractDocumentSentiment": true,
  "extractEntitySentiment": true,
  "classifyText": true
}

export const analyzeText = async (text) => {
  const client = new language.v1beta2.LanguageServiceClient();
  const nlpRes = {"documentSentiment":{},
    "categories": []
  }
  const doc = {
    "type": "PLAIN_TEXT",
    "language": "EN",
    "content": text,
  }
  const request = {
    "document": doc,
    "features": features,
    "encodingType":"UTF8"
  }
  try {
    const results = await client.annotateText(request); 
    nlpRes["documentSentiment"] = results[0].documentSentiment;
  }
  catch (err){
    console.log(`ERROR: error annotating text ${err}`);
  }
  try {
    const classifyResp = await client.classifyText(request);
    nlpRes["categories"] = classifyResp[0].categories; 
  }
  catch (err){
    console.log(`ERROR: error classifying text ${err}`);
  }
  return nlpRes;
}
