const TITLE_APPLY = "Lurker's luck";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];
const PATH_ICON = "icons/bigR.svg";

/**
 * The code is taken from [apply-css] example over on [webextensions-examples] repo.
 */

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
Argument url must be a valid URL string.
*/
function protocolIsApplicable(url) {
    const protocol = (new URL(url)).protocol;
    return APPLICABLE_PROTOCOLS.includes(protocol);
}
/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
    if (protocolIsApplicable(tab.url)) {
        browser.pageAction.setIcon({tabId: tab.id, path: PATH_ICON});
        browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
        browser.pageAction.show(tab.id);
    }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
    for (let tab of tabs) {
        initializePageAction(tab);
    }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    initializePageAction(tab);
});

function redirect(requestDetails) {
    console.debug("Redirecting from: " + requestDetails.url);

    let targetUrl = requestDetails.url.replace("www.reddit.com", "libredd.it")
    console.debug("Redirecting to: " + targetUrl);

    browser.tabs.update({url: targetUrl});
}

browser.pageAction.onClicked.addListener(redirect);