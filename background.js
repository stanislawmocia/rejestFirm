function searchIn(selectionText){
  document.querySelector('#registry > div > div > div > form > input').value = selectionText;
  document.querySelector('#registry > div > div > div > form').submit();
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'rejestIo',
    title: "Search rejest.io",
    type: 'normal',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((item) => {
  if (item.menuItemId === 'rejestIo') {
    const url = new URL('https://rejestr.io/');
    chrome.tabs.create({ url: url.href },
      function (tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (info.status === 'complete' && tabId === tab.id) {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting
              .executeScript({
                target: { tabId: tabId },
                func : searchIn,
                args: [item.selectionText]
              })
              .then(() => console.log("Inserted text"));
          }
        })
      }
    );
  }
});