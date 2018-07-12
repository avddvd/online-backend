import * as rp from 'request-promise-native'
import * as jsdom from 'jsdom'
import * as Readability from './Readability'
import * as htmlToText from 'html-to-text';

const { JSDOM } = jsdom;

export const fetchPageContent = async (url) => {
  console.log(`requesting url: ${url}`);
  try {
    const responseBody = await rp(url)
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
  catch(err) {
    console.log(`ERROR: error when calling url: ${url}, ${err}`);
  }
}

fetchPageContent('https://www.npr.org/2018/07/11/627932769/trump-unloads-on-nato-secretary-general-over-defense-spending')
  .then((text) => {
    console.log(text);
  })
  .catch(() => 'obligatory catch')
