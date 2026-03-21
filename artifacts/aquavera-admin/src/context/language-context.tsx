import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi" | "mr";

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // Common
  "nav.home": { en: "Home", hi: "होम", mr: "होम" },
  "nav.about": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
  "nav.feedback": { en: "Feedback", hi: "प्रतिक्रिया", mr: "प्रतिक्रिया" },
  "nav.contact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" },
  "nav.faqs": { en: "FAQs", hi: "पूछे जाने वाले प्रश्न", mr: "वारंवार विचारले जाणारे प्रश्न" },
  "nav.login": { en: "Log In", hi: "लॉग इन", mr: "लॉग इन" },
  "nav.signup": { en: "Sign Up", hi: "साइन अप", mr: "साइन अप" },

  // Hero
  "hero.title": { en: "Smart Water Management for Sustainable Farming", hi: "स्थायी खेती के लिए स्मार्ट जल प्रबंधन", mr: "शाश्वत शेतीसाठी स्मार्ट जल व्यवस्थापन" },
  "hero.subtitle": { en: "AquaVera empowers farmers with real-time irrigation insights and efficient resource allocation.", hi: "एक्वावेरा किसानों को रीयल-टाइम सिंचाई अंतर्दृष्टि और कुशल संसाधन आवंटन के साथ सशक्त बनाता है।", mr: "एक्वावेरा शेतकऱ्यांना रिअल-टाइम सिंचन अंतर्दृष्टी आणि कार्यक्षम संसाधन वाटपासह सक्षम करते." },
  "hero.cta": { en: "Get Started", hi: "शुरू करें", mr: "सुरु करा" },

  // About
  "about.title": { en: "About AquaVera", hi: "एक्वावेरा के बारे में", mr: "एक्वावेरा बद्दल" },
  "about.desc": { en: "We are dedicated to optimizing water usage in agriculture through innovative technology and data-driven solutions.", hi: "हम नवीन तकनीक और डेटा-संचालित समाधानों के माध्यम से कृषि में पानी के उपयोग को अनुकूलित करने के लिए समर्पित हैं।", mr: "आम्ही नाविन्यपूर्ण तंत्रज्ञान आणि डेटा-चालित उपायांद्वारे कृषीमध्ये पाण्याचा वापर इष्टतम करण्यासाठी समर्पित आहोत." },

  // Contact
  "contact.title": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" },
  "contact.name": { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  "contact.email": { en: "Email Address", hi: "ईमेल पता", mr: "ईमेल पत्ता" },
  "contact.message": { en: "Your Message", hi: "आपका संदेश", mr: "तुमचा संदेश" },
  "contact.send": { en: "Send Message", hi: "संदेश भेजें", mr: "संदेश पाठवा" },

  // Feedback
  "feedback.title": { en: "Farmer Feedback", hi: "किसान प्रतिक्रिया", mr: "शेतकरी प्रतिक्रिया" },
  "feedback.1.text": { en: "AquaVera has transformed the way I manage my crops. The water savings are incredible!", hi: "एक्वावेरा ने मेरी फसलों के प्रबंधन के तरीके को बदल दिया है। पानी की बचत अविश्वसनीय है!", mr: "एक्वावेरामुळे माझ्या पिकांचे व्यवस्थापन करण्याच्या पद्धतीत बदल झाला आहे. पाण्याची बचत अविश्वसनीय आहे!" },
  "feedback.1.author": { en: "Rajesh Kumar", hi: "राजेश कुमार", mr: "राजेश कुमार" },

  // FAQs
  "faqs.title": { en: "Frequently Asked Questions", hi: "अक्सर पूछे जाने वाले प्रश्न", mr: "सतत विचारले जाणारे प्रश्न" },
  "faqs.1.q": { en: "How does AquaVera track water usage?", hi: "एक्वावेरा पानी के उपयोग को कैसे ट्रैक करता है?", mr: "एक्वावेरा पाण्याचा वापर कसा ट्रॅक करतो?" },
  "faqs.1.a": { en: "We use IoT sensors and smart meters to provide real-time data.", hi: "हम वास्तविक समय डेटा प्रदान करने के लिए IoT सेंसर और स्मार्ट मीटर का उपयोग करते हैं।", mr: "आम्ही रिअल-टाइम डेटा प्रदान करण्यासाठी IoT सेन्सर्स आणि स्मार्ट मीटर्स वापरतो." },
  "faqs.2.q": { en: "Can I use it on my mobile phone?", hi: "क्या मैं इसे अपने मोबाइल फोन पर उपयोग कर सकता हूँ?", mr: "मी ते माझ्या मोबाईल फोनवर वापरू शकतो का?" },
  "faqs.2.a": { en: "Yes, our portal is fully responsive and works on all devices.", hi: "हाँ, हमारा पोर्टल पूरी तरह से उत्तरदायी है और सभी उपकरणों पर काम करता है।", mr: "होय, आमचे पोर्टल पूर्णपणे प्रतिसादात्मक आहे आणि सर्व उपकरणांवर कार्य करते." },

  // Footer
  "footer.rights": { en: "All rights reserved", hi: "सर्वाधिकार सुरक्षित", mr: "सर्व हक्क राखीव" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
