import { useEffect, useState } from 'react';

export function useZafClient() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Dynamically add the ZAF SDK script
    const script = document.createElement('script');
    script.src = 'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js';
    script.async = true;
    document.body.appendChild(script);

    // Check for ZAFClient after the script has been loaded
    const checkClient = () => {
      if (window.ZAFClient) {
        const zafClient = window.ZAFClient.init();
        setClient(zafClient);
      } else {
        setTimeout(checkClient, 100); // Retry after 100ms
      }
    };

    script.onload = checkClient; // Trigger the client check once the script is loaded
    return () => {
      // Cleanup: remove script if component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return client;
}
