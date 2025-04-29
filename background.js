const religiousResources = {
  christian: "https://www.bible.com/fr/bible/1/GEN.39.9.LSG",
  muslim: "https://quran.com/17/32",
  jewish: "https://www.sefaria.org/Proverbs.6.25-29",
  buddhist: "https://www.accesstoinsight.org/tipitaka/an/an05/an05.053.than.html",
  atheist: [
    "https://www.youtube.com/embed/xr9FQ9Z8gl4",
    "https://www.youtube.com/embed/tnqp3ee2QLY"
  ]
};

function isAdultContent(url) {
  try {
    const dangerousPatterns = [
      /(\W|^)(porn|pornhub|adult|onlyfans|hentai|sex|xxx|cam|nsfw|vulgar|Brazzers|xhamster|beurette.com|vid\d+|live)(\W|$)/i,
      /\/video\d*(\/|$)/i,
      /\/live[_-]?stream/i,
      /\/[a-z]{3,}\d{3,}\//i,
      /\/[a-z]+-[a-z]+-[a-z]+(\/|$)/i,
      /webcam|private|hidden|restricted/i
    ];
    return dangerousPatterns.some(p => p.test(url));
  } catch {
    return false;
  }
}

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  console.log('🔎 Analyzing URL:', details.url);
  
  if (!isAdultContent(details.url)) {
    console.log('✅ Authorized URL');
    return;
  }

  console.log('🚫 Blocked content detected');
  const data = await chrome.storage.sync.get('religion');
  
  if (!data?.religion) {
    console.warn('No religion configured');
    return;
  }

  const religion = data.religion.toLowerCase();
  console.log('🛐 Selected religion:', religion);

  let redirectUrl;
  if (religion === 'atheist') {
    redirectUrl = religiousResources.atheist[
      Math.floor(Math.random() * religiousResources.atheist.length)
    ];
  } else {
    redirectUrl = religiousResources[religion];
  }

  if (redirectUrl) {
    console.log('↪️ Redirecting to:', redirectUrl);
    await chrome.tabs.update(details.tabId, { url: redirectUrl });
  } else {
    console.error('Redirect URL not found');
  }
}, {
  url: [{ schemes: ['http', 'https'] }]
});


chrome.runtime.onInstalled.addListener(() => {
  console.log('🟢 Extension successfully installed');
  chrome.storage.sync.get('religion', data => {
    console.log('⚙️ Current config:', data);
  });
});