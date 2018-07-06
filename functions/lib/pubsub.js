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
const PubSub = require("@google-cloud/pubsub");
const functions = require("firebase-functions");
// config
const config = functions.config();
const pubsub = new PubSub();
const topicName = config.pubsubtopic.name;
exports.publishMessage = (data) => __awaiter(this, void 0, void 0, function* () {
    const dataBuffer = Buffer.from(JSON.stringify(data));
    try {
        const message = yield pubsub.topic(topicName).publisher().publish(dataBuffer);
        console.log(`Message ${message} published`);
    }
    catch (err) {
        console.log('ERROR: error publishing message', err);
    }
});
//# sourceMappingURL=pubsub.js.map