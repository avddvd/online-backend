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
const rp = require("request-promise-native");
exports.crawlUrl = (url) => __awaiter(this, void 0, void 0, function* () {
    console.log(`requesting url: ${url}`);
    try {
        const responseBody = yield rp(url);
        console.log(`response is : ${responseBody}`);
    }
    catch (err) {
        console.log(`ERROR: error when calling url: ${url}, ${err}`);
    }
});
exports.crawlUrl('https://www.google.com')
    .then(() => {
    console.log('got response');
})
    .catch(() => 'obligatory catch');
//# sourceMappingURL=scrape.js.map