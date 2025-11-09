// A simple function to check if a URL is valid (not internal pages)
function isValidUrl(url) {
  return url && 
         !url.startsWith("about:") && 
         !url.startsWith("chrome:") && 
         !url.startsWith("edge:") && 
         !url.startsWith("file:");
}

// Listen for when any tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  
  // Check if the tab has finished loading and has a valid URL
  if (changeInfo.status === "complete" && isValidUrl(tab.url)) {
    
    // Query all tabs for the same URL
    // Use callback syntax for chrome.* namespace
    chrome.tabs.query({ url: tab.url }, (duplicateTabs) => {
      
      // If more than one tab has this URL
      if (duplicateTabs.length > 1) {
        
        // Sort by ID to find the "original" tab (the one with the lowest ID)
        const originalTab = duplicateTabs.sort((a, b) => a.id - b.id)[0];
        
        // If the tab that just loaded is NOT the original one, it's a new duplicate
        if (tabId !== originalTab.id) {
          
          // Switch to the original tab
          chrome.tabs.update(originalTab.id, { active: true });
          
          // Close the new duplicate tab
          chrome.tabs.remove(tabId);
        }
      }
    });
  }
});

console.log("Close New Duplicate Tabs extension loaded (MV3 for Edge).");