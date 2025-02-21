import { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src =
      "https://files.bpcontent.cloud/2025/02/21/07/20250221075756-NXOF8ERD.js";
    script2.async = true;
    document.body.appendChild(script2);
  }, []);

  return null;
};

export default Chatbot;
