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
const jsdom = require("jsdom");
const Readability = require("./Readability");
const htmlToText = require("html-to-text");
const { JSDOM } = jsdom;
exports.fetchPageContent = (url) => __awaiter(this, void 0, void 0, function* () {
    console.log(`requesting url: ${url}`);
    try {
        const responseBody = yield rp(url);
        const window = (new JSDOM(responseBody, { pretendToBeVisual: true })).window;
        const location = window.document.location;
        const uri = {
            spec: location.href,
            host: location.host,
            prePath: location.protocol + "//" + location.host,
            scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
            pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
        };
        const article = new Readability(uri, window.document).parse();
        const text = htmlToText.fromString(article.content, {
            ignoreHref: true,
            ignoreImage: true
        });
        return text;
    }
    catch (err) {
        console.log(`ERROR: error when calling url: ${url}, ${err}`);
    }
});
exports.fetchPageContent('https://www.npr.org/2018/07/11/627932769/trump-unloads-on-nato-secretary-general-over-defense-spending')
    .then((text) => {
    console.log(text);
})
    .catch(() => 'obligatory catch');
//# sourceMappingURL=scrape.js.map