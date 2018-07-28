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
const language = require("@google-cloud/language");
const features = {
    "extractSyntax": true,
    "extractEntities": true,
    "extractDocumentSentiment": true,
    "extractEntitySentiment": true,
    "classifyText": true
};
exports.analyzeText = (text) => __awaiter(this, void 0, void 0, function* () {
    const client = new language.v1beta2.LanguageServiceClient();
    const nlpRes = { "documentSentiment": {},
        "categories": []
    };
    const doc = {
        "type": "PLAIN_TEXT",
        "language": "EN",
        "content": text,
    };
    const request = {
        "document": doc,
        "features": features,
        "encodingType": "UTF8"
    };
    try {
        const results = yield client.annotateText(request);
        nlpRes["documentSentiment"] = results[0].documentSentiment;
    }
    catch (err) {
        console.log(`ERROR: error annotating text ${err}`);
    }
    try {
        const classifyResp = yield client.classifyText(request);
        nlpRes["categories"] = classifyResp[0].categories;
    }
    catch (err) {
        console.log(`ERROR: error classifying text ${err}`);
    }
    return nlpRes;
});
//# sourceMappingURL=nlp.js.map