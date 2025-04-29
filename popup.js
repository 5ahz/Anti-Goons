document.addEventListener('DOMContentLoaded', () => {
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  const body = document.body;
  const religionSelect = document.getElementById('religion-select');
  const saveBtn = document.getElementById('save-btn');

  
  chrome.storage.sync.get(['theme', 'religion'], (data) => {
    if (data.theme) {
      body.classList.toggle('dark', data.theme === 'dark');
      document.querySelector(`input[value="${data.theme}"]`).checked = true;
    }
    
    if (data.religion) {
      religionSelect.value = data.religion;
    }
  });

  
  themeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      body.classList.toggle('dark', e.target.value === 'dark');
      chrome.storage.sync.set({ theme: e.target.value });
    });
  });

  
  saveBtn.addEventListener('click', () => {
    const religion = religionSelect.value;
    if (religion) {
      chrome.storage.sync.set({ religion }, () => {
        window.close();
      });
    }
  });
});