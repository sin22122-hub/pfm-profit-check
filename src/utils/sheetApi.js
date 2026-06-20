const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxddc6ekNXyyJNxtjAB-4F6ANol7pK21P8Jm0mWgBls9i_CBAUBGkeoVydiDokkWA/exec';

export function fetchDashboardData(submissionId) {
  return new Promise((resolve, reject) => {
    const callbackName = `pfmSheetCallback_${Date.now()}`;

    const script = document.createElement('script');

    const params = new URLSearchParams({
      callback: callbackName,
    });

    if (submissionId) {
      params.set('submissionId', submissionId);
    }

    script.src = `${SCRIPT_URL}?${params.toString()}`;
    script.async = true;

    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    window[callbackName] = (response) => {
      cleanup();

      console.log('PFM Apps Script response:', response);

      if (!response || response.ok !== true) {
        reject(new Error(response?.message || '讀取 Dashboard_Data 失敗'));
        return;
      }

      resolve(response.data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('無法連線到 Apps Script'));
    };

    document.body.appendChild(script);
  });
}
