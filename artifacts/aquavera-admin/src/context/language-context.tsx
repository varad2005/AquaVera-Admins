import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi" | "mr";

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", hi: "होम", mr: "होम" },
  "nav.about": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
  "nav.feedback": { en: "Feedback", hi: "प्रतिक्रिया", mr: "प्रतिक्रिया" },
  "nav.contact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" },
  "nav.faqs": { en: "FAQs", hi: "पूछे जाने वाले प्रश्न", mr: "वारंवार विचारले जाणारे प्रश्न" },
  "nav.login": { en: "Log In", hi: "लॉग इन", mr: "लॉग इन" },
  "nav.signup": { en: "Sign Up", hi: "साइन अप", mr: "साइन अप" },

  // Dashboard
  "dashboard.title": { en: "Operational Dashboard", hi: "संचालन डैशबोर्ड", mr: "ऑपरेशनल डॅशबोर्ड" },
  "dashboard.subtitle": { en: "Real-time overview of irrigation requests and system health.", hi: "सिंचाई अनुरोधों और सिस्टम स्वास्थ्य का वास्तविक समय अवलोकन।", mr: "सिंचन विनंत्या आणि प्रणाली आरोग्याचे रिअल-टाइम विहंगावलोकन." },
  "stat.total_requests": { en: "Total Requests (7d)", hi: "कुल अनुरोध (7 दिन)", mr: "एकूण विनंत्या (7 दिवस)" },
  "stat.pending_approvals": { en: "Pending Approvals", hi: "लंबित अनुमोदन", mr: "प्रलंबित मंजूरी" },
  "stat.volume_allocated": { en: "Volume Allocated (m³)", hi: "आवंटित मात्रा (m³)", mr: "वाटप केलेले प्रमाण (m³)" },
  "stat.flagged_anomalies": { en: "Flagged Anomalies", hi: "चिह्नित विसंगतियां", mr: "चिन्हांकित विसंगती" },
  "chart.request_trends": { en: "Request Volume Trends", hi: "अनुरोध मात्रा रुझान", mr: "विनंती प्रमाण ट्रेंड" },
  "chart.last_7_days": { en: "Last 7 Days", hi: "पिछले 7 दिन", mr: "मागील 7 दिवस" },
  "chart.last_30_days": { en: "Last 30 Days", hi: "पिछले 30 दिन", mr: "मागील 30 दिवस" },
  "chart.crop_distribution": { en: "Crop Distribution", hi: "फसल वितरण", mr: "पीक वितरण" },
  "recent_requests.title": { en: "Recent Requests", hi: "हाल के अनुरोध", mr: "अलीकडील विनंत्या" },
  "recent_requests.view_all": { en: "View All", hi: "सभी देखें", mr: "सर्व पहा" },
  "recent_requests.loading": { en: "Loading requests...", hi: "अनुरोध लोड हो रहे हैं...", mr: "विनंत्या लोड होत आहेत..." },
  "audit_log.title": { en: "System Audit Log", hi: "सिस्टम ऑडिट लॉग", mr: "सिस्टम ऑडिट लॉग" },
  "audit_log.full_log": { en: "Full Log", hi: "पूरा लॉग", mr: "पूर्ण लॉग" },
  "audit_log.loading": { en: "Loading logs...", hi: "लॉग लोड हो रहे हैं...", mr: "लॉग लोड होत आहेत..." },

  // Header & Global Header
  "header.search_placeholder": { en: "Search Request ID, Farmer Name, or Land ID...", hi: "अनुरोध आईडी, किसान का नाम, या भूमि आईडी खोजें...", mr: "विनंती आयडी, शेतकऱ्याचे नाव किंवा जमीन आयडी शोधा..." },
  "header.alerts_insights": { en: "Alerts & Insights", hi: "अलर्ट और अंतर्दृष्टि", mr: "अलर्ट आणि इनसाइट्स" },
  "header.recent": { en: "Recent", hi: "हाल के", mr: "अलीकडील" },
  "header.profile_summary": { en: "Profile Summary", hi: "प्रोफ़ाइल सारांश", mr: "प्रोफाइल सारांश" },
  "header.platform_settings": { en: "Platform Settings", hi: "प्लेटफ़ॉर्म सेटिंग्स", mr: "प्लॅटफॉर्म सेटिंग्ज" },
  "header.sign_out": { en: "Sign Out", hi: "साइन आउट", mr: "साइन आउट" },
  "header.gov_india": { en: "Govt. of India | MoA&FW", hi: "भारत सरकार | कृषि एवं किसान कल्याण मंत्रालय", mr: "भारत सरकार | कृषी आणि शेतकरी कल्याण मंत्रालय" },
  "header.smart_portal": { en: "Smart Irrigation Portal", hi: "स्मार्ट सिंचाई पोर्टल", mr: "स्मार्ट सिंचन पोर्टल" },
  "header.portal": { en: "Portal", hi: "पोर्टल", mr: "पोर्टल" },

  // Sidebar
  "sidebar.dashboard": { en: "Dashboard", hi: "डैशबोर्ड", mr: "डॅशबोर्ड" },
  "sidebar.requests": { en: "Water Requests", hi: "सिंचाई अनुरोध", mr: "सिंचन विनंत्या" },
  "sidebar.farmers": { en: "Registered Farmers", hi: "पंजीकृत किसान", mr: "नोंदणीकृत शेतकरी" },
  "sidebar.users": { en: "User Management", hi: "उपयोगकर्ता प्रबंधन", mr: "वापरकर्ता व्यवस्थापन" },
  "sidebar.logs": { en: "Activity Logs", hi: "गतिविधि लॉग", mr: "क्रियाकलाप लॉग" },
  "sidebar.logged_in_as": { en: "Logged in as", hi: "लॉग इन किया है के रूप में", mr: "म्हणून लॉग इन केले" },
  "sidebar.secure_logout": { en: "Secure Logout", hi: "सुरक्षित लॉगआउट", mr: "सुरक्षित लॉगआउट" },
  "sidebar.gov_portal": { en: "Government Portal", hi: "सरकारी पोर्टल", mr: "शासकीय पोर्टल" },

  // Auth Layout & Subtitles
  "auth.admin_portal": { en: "LOGIN PORTAL", hi: "लॉगिन पोर्टल", mr: "लॉगिन पोर्टल" },
  "auth.farmer_registration": { en: "FARMER REGISTRATION", hi: "किसान पंजीकरण", mr: "शेतकरी नोंदणी" },
  "auth.farmer_portal": { en: "FARMER PORTAL", hi: "किसान पोर्टल", mr: "शेतकरी पोर्टल" },
  "auth.recovery": { en: "RECOVERY", hi: "रिकवरी", mr: "रिकव्हरी" },
  "auth.verification": { en: "VERIFICATION", hi: "सत्यापन", mr: "पडताळणी" },

  // Login Page
  "login.email_placeholder": { en: "Email Address", hi: "ईमेल पता", mr: "ईमेल पत्ता" },
  "login.password_placeholder": { en: "Password", hi: "पासवर्ड", mr: "पासवर्ड" },
  "login.button": { en: "Log In", hi: "लॉग इन", mr: "लॉग इन" },
  "login.no_account": { en: "Don't have an account?", hi: "क्या आपका खाता नहीं है?", mr: "तुमचे खाते नाही का?" },
  "login.signup_link": { en: "Sign Up", hi: "साइन अप", mr: "साइन अप" },
  "login.forgot_password": { en: "Forgot Password?", hi: "पासवर्ड भूल गए?", mr: "पासवर्ड विसरलात?" },
  "login.success_title": { en: "Login Successful", hi: "लॉगिन सफल", mr: "लॉगिन यशस्वी" },
  "login.welcome_admin": { en: "Welcome back, Admin.", hi: "वापसी पर स्वागत है, एडमिन।", mr: "पुन्हा स्वागत आहे, अ‍ॅडमिन." },
  "login.welcome_subadmin": { en: "Welcome back, Sub-Admin.", hi: "वापसी पर स्वागत है, सब-एडमिन।", mr: "पुन्हा स्वागत आहे, सब-अ‍ॅडमिन." },
  "login.welcome_farmer": { en: "Welcome, Farmer.", hi: "स्वागत है, किसान।", mr: "स्वागत आहे, शेतकरी." },
  "login.failed_title": { en: "Login Failed", hi: "लॉगिन विफल", mr: "लॉगिन अयशस्वी" },
  "login.failed_desc": { en: "Invalid email or password. Use the provided demo credentials.", hi: "अमान्य ईमेल या पासवर्ड। दिए गए डेमो क्रेडेंशियल का उपयोग करें।", mr: "अवैध ईमेल किंवा पासवर्ड. प्रदान केलेली डेमो क्रेडेन्शियल्स वापरा." },

  // SignUp Page
  "signup.fullname_placeholder": { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  "signup.phone_placeholder": { en: "Phone Number", hi: "फ़ोन नंबर", mr: "फोन नंबर" },
  "signup.confirm_password": { en: "Confirm Password", hi: "पासवर्ड की पुष्टि करें", mr: "पासवर्डची पुष्टी करा" },
  "signup.button": { en: "Create Account", hi: "खाता बनाएं", mr: "खाते तयार करा" },
  "signup.already_account": { en: "Already have an account?", hi: "क्या आपके पास पहले से खाता है?", mr: "आधीच खाते आहे का?" },

  // Forgot Password Page
  "forgot.check_email": { en: "Check your email", hi: "अपना ईमेल जांचें", mr: "तुमचा ईमेल तपासा" },
  "forgot.instructions_sent": { en: "We've sent password recovery instructions to your email address.", hi: "हमने आपके ईमेल पते पर पासवर्ड रिकवरी निर्देश भेजे हैं।", mr: "आम्ही तुमच्या ईमेल पत्त्यावर पासवर्ड रिकव्हरी सूचना पाठवल्या आहेत." },
  "forgot.back_to_login": { en: "Back to Login", hi: "लॉगिन पर वापस जाएं", mr: "लॉगिनवर परत जा" },
  "forgot.enter_email": { en: "Enter your email address and we'll send you instructions to reset your password.", hi: "अपना ईमेल पता दर्ज करें और हम आपको अपना पासवर्ड रीसेट करने के लिए निर्देश भेजेंगे।", mr: "तुमचा ईमेल पत्ता प्रविष्ट करा आणि आम्ही तुम्हाला तुमचा पासवर्ड रीसेट करण्यासाठी सूचना पाठवू." },
  "forgot.send_button": { en: "Send Instructions", hi: "निर्देश भेजें", mr: "सूचना पाठवा" },

  // OTP Page
  "otp.instructions": { en: "We've sent a 6-digit code to your phone number.", hi: "हमने आपके फ़ोन नंबर पर 6-अंकों का कोड भेजा है।", mr: "आम्ही तुमच्या फोन नंबरवर ६ अंकी कोड पाठवला आहे." },
  "otp.verify_button": { en: "Verify OTP", hi: "ओटीपी सत्यापित करें", mr: "ओटीपी सत्यापित करा" },
  "otp.resend": { en: "Resend Code", hi: "कोड पुनः भेजें", mr: "कोड पुन्हा पाठवा" },

  // Common UI
  "common.search": { en: "Search", hi: "खोज", mr: "शोधा" },
  "common.filter": { en: "Filter", hi: "फ़िल्टर", mr: "फिल्टर" },
  "common.actions": { en: "Actions", hi: "कार्य", mr: "कृती" },
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है...", mr: "लोड होत आहे..." },
  "common.no_results": { en: "No results found matching criteria.", hi: "मानदंड से मेल खाता कोई परिणाम नहीं मिला।", mr: "निकषांशी जुळणारे कोणतेही परिणाम आढळले नाहीत." },
  "common.page": { en: "Page", hi: "पृष्ठ", mr: "पृष्ठ" },
  "common.of": { en: "of", hi: "का", mr: "पैकी" },
  "common.showing": { en: "Showing", hi: "दिखा रहा है", mr: "दाखवत आहे" },
  "common.results": { en: "results", hi: "परिणाम", mr: "निकाल" },
  "common.previous": { en: "Previous", hi: "पिछला", mr: "मागील" },
  "common.next": { en: "Next", hi: "अगला", mr: "पुढील" },

  // Statuses
  "status.all": { en: "All", hi: "सभी", mr: "सर्व" },
  "status.pending": { en: "Pending", hi: "लंबित", mr: "प्रलंबित" },
  "status.flagged": { en: "Flagged", hi: "चिह्नित", mr: "चिन्हांकित" },
  "status.approved": { en: "Approved", hi: "अनुमोदित", mr: "मंजूर" },
  "status.rejected": { en: "Rejected", hi: "अस्वीकृत", mr: "नाकारले" },

  // Requests Page
  "requests.title": { en: "Water Requests", hi: "सिंचाई अनुरोध", mr: "सिंचन विनंत्या" },
  "requests.subtitle": { en: "Manage and verify irrigation allocations.", hi: "सिंचाई आवंटन प्रबंधित और सत्यापित करें।", mr: "सिंचन वाटप व्यवस्थापित आणि सत्यापित करा." },
  "requests.id": { en: "Request ID", hi: "अनुरोध आईडी", mr: "विनंती आयडी" },
  "requests.farmer_location": { en: "Farmer & Location", hi: "किसान और स्थान", mr: "शेतकरी आणि स्थान" },
  "requests.crop_details": { en: "Crop Details", hi: "फसल विवरण", mr: "पीक तपशील" },
  "requests.geo_status": { en: "Geo-Status", hi: "भू-स्थिति", mr: "जिओ-स्थिती" },
  "requests.status": { en: "Status", hi: "स्थिति", mr: "स्थिती" },
  "requests.date": { en: "Date", hi: "तारीख", mr: "तारीख" },
  "requests.hrs_requested": { en: "hrs requested", hi: "घंटे अनुरोधित", mr: "तास विनंती केली" },
  "requests.search_placeholder": { en: "Search ID, Farmer...", hi: "आईडी, किसान खोजें...", mr: "आयडी, शेतकरी शोधा..." },

  // Farmers Page
  "farmers.title": { en: "Registered Farmers", hi: "पंजीकृत किसान", mr: "नोंदणीकृत शेतकरी" },
  "farmers.subtitle": { en: "Directory of registered land owners using AquaVera smart connections.", hi: "एक्वावेरा स्मार्ट कनेक्शन का उपयोग करने वाले पंजीकृत भूमि मालिकों की निर्देशिका।", mr: "एक्वावेरा स्मार्ट कनेक्शन वापरणाऱ्या नोंदणीकृत जमीन मालकांची निर्देशिका." },
  "farmers.search_placeholder": { en: "Search by name, ID or village...", hi: "नाम, आईडी या गांव से खोजें...", mr: "नाव, आयडी किंवा गावावरून शोधा..." },
  "farmers.export_button": { en: "Export Data", hi: "डेटा निर्यात करें", mr: "डेटा निर्यात करा" },
  "farmers.total_enrollment": { en: "Total Enrollment", hi: "कुल नामांकन", mr: "एकूण नोंदणी" },
  "farmers.active_connections": { en: "Active Connections", hi: "सक्रिय कनेक्शन", mr: "सक्रिय कनेक्शन" },
  "farmers.regional_coverage": { en: "Regional Coverage", hi: "क्षेत्रीय कवरेज", mr: "प्रादेशिक व्याप्ती" },
  "farmers.active": { en: "Active", hi: "सक्रिय", mr: "सक्रिय" },
  "farmers.inactive": { en: "Inactive", hi: "निष्क्रिय", mr: "निष्क्रिय" },
  "farmers.connection_requests": { en: "Connection Requests", hi: "कनेक्शन अनुरोध", mr: "कनेक्शन विनंत्या" },
  "farmers.last_sync": { en: "Last Sync", hi: "पिछला सिंक", mr: "शेवटचा सिंक" },
  "farmers.districts_reached": { en: "Districts reached", hi: "जिलों तक पहुँच", mr: "जिल्हे पोहोचले" },

  // Activity Logs Page
  "logs.title": { en: "System Audit Logs", hi: "सिस्टम ऑडिट लॉग", mr: "सिस्टम ऑडिट लॉग" },
  "logs.subtitle": { en: "Immutable record of all system and user actions.", hi: "सभी सिस्टम और उपयोगकर्ता कार्यों का अपरिवर्तनीय रिकॉर्ड।", mr: "सर्व सिस्टम आणि वापरकर्ता क्रियांचा अपरिवर्तनीय रेकॉर्ड." },
  "logs.last_7_days": { en: "Last 7 Days", hi: "पिछले 7 दिन", mr: "शेवटचे ७ दिवस" },
  "logs.export_csv": { en: "Export CSV", hi: "सीएसवी निर्यात करें", mr: "CSV निर्यात करा" },
  "logs.timestamp": { en: "Timestamp", hi: "समय-चिह्न", mr: "वेळ-चिन्ह" },
  "logs.user_role": { en: "User & Role", hi: "उपयोगकर्ता और भूमिका", mr: "वापरकर्ता आणि भूमिका" },
  "logs.action_event": { en: "Action Event", hi: "कार्य घटना", mr: "कृती घटना" },
  "logs.ip_address": { en: "IP Address", hi: "आईपी पता", mr: "आयपी पत्ता" },
  "logs.access_denied": { en: "Pahunch Asveekrt", hi: "पहुँच अस्वीकृत", mr: "प्रवेश नाकारला" },
  "logs.restricted": { en: "Audit logs are restricted to Administrator roles only.", hi: "ऑडिट लॉग केवल प्रशासक भूमिकाओं तक ही सीमित हैं।", mr: "ऑडिट लॉग केवळ प्रशासक भूमिकांसाठी मर्यादित आहेत।" },

  // Log Actions
  "log.action.approved": { en: "Approved Request {id}", hi: "अनुरोध {id} स्वीकृत किया गया", mr: "अनुरोध {id} मंजूर केला" },
  "log.action.auto_flagged": { en: "Auto-flagged Request {id} (Low Confidence)", hi: "ऑटो-फ्लैग्ड अनुरोध {id} (कम विश्वास)", mr: "ऑटो-फ्लॅग्ड विनंती {id} (कमी विश्वास)" },
  "log.action.assigned": { en: "Assigned to self: Request {id}", hi: "स्वयं को सौंपा: अनुरोध {id}", mr: "स्वतःला नियुक्त केले: विनंती {id}" },
  "log.action.updated_settings": { en: "Updated System Settings", hi: "सिस्टम सेटिंग्स अपडेट की गई", mr: "सिस्टम सेटिंग्ज अपडेट केल्या" },
  "log.action.deactivated_user": { en: "Deactivated User {id}", hi: "उपयोगकर्ता {id} को निष्क्रिय किया गया", mr: "वापरकर्ता {id} निष्क्रिय केला" },

  // Request Detail Page
  "detail.title": { en: "Request", hi: "अनुरोध", mr: "विनंती" },
  "detail.submitted_on": { en: "Submitted on", hi: "जमा किया गया", mr: "सादर केले" },
  "detail.farmer_profile": { en: "Farmer Profile", hi: "किसान प्रोफ़ाइल", mr: "शेतकरी प्रोफाइल" },
  "detail.fullname": { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  "detail.aadhaar": { en: "Aadhaar (Masked)", hi: "आधार (नकाबपोश)", mr: "आधार (मास्क केलेले)" },
  "detail.land_record_id": { en: "Land Record ID", hi: "भूमि रिकॉर्ड आईडी", mr: "जमीन रेकॉर्ड आयडी" },
  "detail.location": { en: "Location", hi: "स्थान", mr: "स्थान" },
  "detail.allocation_request": { en: "Allocation Request", hi: "आवंटन अनुरोध", mr: "वाटप विनंती" },
  "detail.declared_crop": { en: "Declared Crop", hi: "घोषित फसल", mr: "घोषित पीक" },
  "detail.duration": { en: "Duration", hi: "अवधि", mr: "कालावधी" },
  "detail.expected_start": { en: "Expected Start", hi: "अपेक्षित शुरुआत", mr: "अपेक्षित सुरुवात" },
  "detail.calculated_billing": { en: "Calculated Billing", hi: "परिकलित बिलिंग", mr: "गणना केलेले बिलिंग" },
  "detail.hours": { en: "Hours", hi: "घंटे", mr: "तास" },
  "detail.ai_analysis": { en: "AI Analysis & Verification", hi: "एआई विश्लेषण और सत्यापन", mr: "AI विश्लेषण आणि प्रमाणीकरण" },
  "detail.confidence_score": { en: "Claim vs Reality Confidence", hi: "दावा बनाम वास्तविकता विश्वास", mr: "दावा विरुद्ध वास्तव विश्वास" },
  "detail.geofence_match": { en: "Geofence Match", hi: "जियोफेंस मिलान", mr: "जिओफेन्स मॅच" },
  "detail.geofence_desc": { en: "Location verified against land registry.", hi: "भूमि रजिस्ट्री के विरुद्ध स्थान सत्यापित।", mr: "जमीन नोंदणी विरूद्ध स्थान सत्यापित." },
  "detail.ndvi_index": { en: "NDVI Index", hi: "एनडीवीआई इंडेक्स", mr: "NDVI निर्देशांक" },
  "detail.ndvi_desc": { en: "Vegetation density score.", hi: "वनस्पति घनत्व स्कोर।", mr: "वनस्पती घनता स्कोअर." },
  "detail.anomaly_detected": { en: "Anomaly Detected: Crop signature in satellite imagery does not strongly correlate with the declared crop type ({crop}). Manual review required.", hi: "विसंगति का पता चला: उपग्रह इमेजरी में फसल हस्ताक्षर घोषित फसल प्रकार ({crop}) के साथ दृढ़ता से सहसंबंधित नहीं होते हैं। मैनुअल समीक्षा की आवश्यकता है।", mr: "विसंगती आढळली: सॅटेलाइट इमेजरीमधील पीक स्वाक्षरी घोषित पीक प्रकाराशी ({crop}) जोरदारपणे संबंधित नाही. मॅन्युअल पुनरावलोकन आवश्यक आहे." },
  "detail.satellite_map": { en: "Satellite Map", hi: "सैटेलाइट मानचित्र", mr: "सॅटेलाइट मॅप" },
  "detail.drone_scan": { en: "Farmer Upload", hi: "किसान अपलोड", mr: "शेतकरी अपलोड" },
  "detail.plot_id": { en: "Plot ID", hi: "प्लॉट आईडी", mr: "प्लॉट आयडी" },
  "detail.last_pass": { en: "Last pass", hi: "पिछली पास", mr: "शेवटची पास" },
  "detail.ai_prediction": { en: "AI Prediction", hi: "एआई भविष्यवाणी", mr: "AI भविष्यवाणी" },
  "detail.decision_required": { en: "Decision Required", hi: "निर्णय आवश्यक", mr: "निर्णय आवश्यक" },
  "detail.action_notify": { en: "Action will notify the farmer via SMS.", hi: "कार्रवाई किसान को एसएमएस के माध्यम से सूचित करेगी।", mr: "कृती शेतकऱ्याला एसएमएसद्वारे सूचित करेल." },
  "detail.flag_button": { en: "Flag for Review", hi: "समीक्षा के लिए चिह्नित करें", mr: "पुनरावलोकनासाठी चिन्हांकित करा" },
  "detail.reject_button": { en: "Reject Request", hi: "अनुरोध अस्वीकार करें", mr: "विनंती नाकारा" },
  "detail.approve_button": { en: "Approve Allocation", hi: "आवंटन स्वीकृत करें", mr: "वाटप मंजूर करा" },
  "detail.back_to_requests": { en: "Back to Requests", hi: "अनुरोधों पर वापस जाएँ", mr: "विनंत्यांकडे परत" },
  "detail.not_found": { en: "Request Not Found", hi: "अनुरोध नहीं मिला", mr: "विनंती सापडली नाही" },
  "detail.not_found_desc": { en: "The requested ID {id} does not exist in the system.", hi: "अनुरोधित आईडी {id} सिस्टम में मौजूद नहीं है।", mr: "विनंती केलेला आयडी {id} सिस्टममध्ये अस्तित्वात नाही." },

  // Notifications
  "notif.new_request": { en: "New Irrigation Request", hi: "नया सिंचाई अनुरोध", mr: "नवीन सिंचन विनंती" },
  "notif.new_request_desc": { en: "Farmer: {name} ({id})", hi: "किसान: {name} ({id})", mr: "शेतकरी: {name} ({id})" },
  "notif.land_verified": { en: "Land Match Verified", hi: "भूमि मिलान सत्यापित", mr: "जमीन जुळणी सत्यापित" },
  "notif.land_verified_desc": { en: "Cadastral ID {id} matched", hi: "कैडस्ट्रल आईडी {id} मिलान हुआ", mr: "कॅडस्ट्रल आयडी {id} जुळला" },
  "notif.system_alert": { en: "System Alert", hi: "सिस्टम अलर्ट", mr: "सिस्टम अलर्ट" },
  "notif.unusual_flow": { en: "Unusual water flow: Sector {sector}", hi: "असामान्य पानी का प्रवाह: सेक्टर {sector}", mr: "असामान्य पाणी प्रवाह: क्षेत्र {sector}" },
  "notif.mins_ago": { en: "mins ago", hi: "मिनट पहले", mr: "मिनिटांपूर्वी" },
  "notif.hour_ago": { en: "hour ago", hi: "घंटा पहले", mr: "तासापूर्वी" },
  "notif.hours_ago": { en: "hours ago", hi: "घंटे पहले", mr: "तासांपूर्वी" },

  // Settings Page
  "settings.title": { en: "Platform Settings", hi: "प्लेटफ़ॉर्म सेटिंग्स", mr: "प्लॅटफॉर्म सेटिंग्ज" },
  "settings.subtitle": { en: "Manage preferences and platform configuration.", hi: "प्राथमिकताएं और प्लेटफ़ॉर्म कॉन्फ़िगरेशन प्रबंधित करें।", mr: "प्राधान्ये आणि प्लॅटफॉर्म कॉन्फिगरेशन व्यवस्थापित करा." },
  "settings.personal_profile": { en: "Personal Profile", hi: "व्यक्तिगत प्रोफ़ाइल", mr: "वैयक्तिक प्रोफाइल" },
  "settings.fullname": { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  "settings.department": { en: "Department", hi: "विभाग", mr: "विभाग" },
  "settings.email": { en: "Official Email", hi: "आधिकारिक ईमेल", mr: "अधिकृत ईमेल" },
  "settings.phone": { en: "Phone Number", hi: "फ़ोन नंबर", mr: "फोन नंबर" },
  "settings.officer_id": { en: "Officer ID", hi: "अधिकारी आईडी", mr: "अधिकारी आयडी" },
  "settings.notifications": { en: "Notification Preferences", hi: "अधिसूचना प्राथमिकताएँ", mr: "अधिसूचना प्राधान्ये" },
  "settings.new_requests": { en: "New Allocation Requests", hi: "नए आवंटन अनुरोध", mr: "नवीन वाटप विनंत्या" },
  "settings.new_requests_desc": { en: "Receive alerts when new requests enter the queue", hi: "कतार में नए अनुरोध आने पर अलर्ट प्राप्त करें", mr: "रांगेत नवीन विनंत्या आल्यावर अलर्ट मिळवा" },
  "settings.anomaly_flags": { en: "Anomaly Flags (Urgent)", hi: "विसंगति झंडे (अति आवश्यक)", mr: "विसंगती ध्वज (तातडीचे)" },
  "settings.anomaly_flags_desc": { en: "Alerts for AI confidence score mismatches", hi: "एआई विश्वास स्कोर बेमेल के लिए अलर्ट", mr: "AI विश्वासार्हता स्कोअर जुळत नसल्याबद्दल अलर्ट" },
  "settings.session_type": { en: "Session", hi: "सत्र", mr: "सत्र" },
  "settings.auth_via": { en: "Authenticated via", hi: "इसके माध्यम से प्रमाणित", mr: "द्वारे प्रमाणित" },
  "settings.gov_cloud": { en: "AquaVera Govt Cloud", hi: "एक्वावेरा सरकारी क्लाउड", mr: "एक्वावेरा सरकारी क्लाउड" },
  "settings.system_info": { en: "System Info", hi: "सिस्टम विवरण", mr: "सिस्टम माहिती" },
  "settings.version": { en: "Version", hi: "संस्करण", mr: "आवृत्ती" },
  "settings.environment": { en: "Environment", hi: "पर्यावरण", mr: "पर्यावरण" },
  "settings.last_sync": { en: "Last Sync", hi: "पिछला सिंक", mr: "शेवटचा सिंक" },
  "settings.production": { en: "Production", hi: "उत्पादन", mr: "उत्पादन" },
  "settings.mins_ago": { en: "mins ago", hi: "मिनट पहले", mr: "मिनिटांपूर्वी" },

  // User Management Page
  "users.title": { en: "User Management", hi: "उपयोगकर्ता प्रबंधन", mr: "वापरकर्ता व्यवस्थापन" },
  "users.subtitle": { en: "Control access, roles, and view system users.", hi: "पहुँच, भूमिकाएँ नियंत्रित करें और सिस्टम उपयोगकर्ता देखें।", mr: "प्रवेश, भूमिका नियंत्रित करा आणि सिस्टम वापरकर्ते पहा." },
  "users.search_placeholder": { en: "Search users...", hi: "उपयोगकर्ताओं को खोजें...", mr: "वापरकर्ते शोधा..." },
  "users.add_user": { en: "Add User", hi: "उपयोगकर्ता जोड़ें", mr: "वापरकर्ता जोडा" },
  "users.add_new_title": { en: "Add New System User", hi: "नया सिस्टम उपयोगकर्ता जोड़ें", mr: "नवीन सिस्टम वापरकर्ता जोडा" },
  "users.fullname": { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  "users.email": { en: "Email Address", hi: "ईमेल पता", mr: "ईमेल पत्ता" },
  "users.phone": { en: "Phone Number", hi: "फ़ोन नंबर", mr: "फोन नंबर" },
  "users.password": { en: "Password", hi: "पासवर्ड", mr: "पासवर्ड" },
  "users.system_role": { en: "System Role", hi: "सिस्टम भूमिका", mr: "सिस्टम भूमिका" },
  "users.create_button": { en: "Create User", hi: "उपयोगकर्ता बनाएँ", mr: "वापरकर्ता तयार करा" },
  "users.creating": { en: "Creating...", hi: "बना रहा है...", mr: "तयार करत आहे..." },
  "users.tab_farmers": { en: "Farmers", hi: "किसान", mr: "शेतकरी" },
  "users.tab_subadmins": { en: "Sub-Admins", hi: "उप-प्रशासक", mr: "उप-प्रशासक" },
  "users.tab_admins": { en: "Admins", hi: "प्रशासक", mr: "प्रशासक" },
  "users.col_user_id": { en: "User / ID", hi: "उपयोगकर्ता / आईडी", mr: "वापरकर्ता / आयडी" },
  "users.col_location": { en: "Location", hi: "स्थान", mr: "स्थान" },
  "users.col_connections": { en: "Connections", hi: "कनेक्शन", mr: "कनेक्शन" },
  "users.col_last_sync": { en: "Last Sync", hi: "पिछला सिंक", mr: "शेवटचा सिंक" },
  "users.col_role": { en: "Role", hi: "भूमिका", mr: "भूमिका" },
  "users.col_status": { en: "Status", hi: "स्थिति", mr: "स्थिती" },
  "users.col_last_login": { en: "Last Login", hi: "पिछला लॉगिन", mr: "शेवटचे लॉगिन" },
  "users.col_actions": { en: "Actions", hi: "कार्रवाई", mr: "कृती" },
  "users.delete_confirm": { en: "Are you sure you want to delete this user?", hi: "क्या आप वाकई इस उपयोगकर्ता को हटाना चाहते हैं?", mr: "तुम्हाला नक्कीच हा वापरकर्ता हटवायचा आहे का?" },
  "users.delete_user": { en: "Delete User", hi: "उपयोगकर्ता हटाएँ", mr: "वापरकर्ता हटवा" },
  "users.delete_farmer": { en: "Delete Farmer", hi: "किसान को हटाएँ", mr: "शेतकरी हटवा" },

  // Not Found Page
  "notfound.title": { en: "404 Page Not Found", hi: "404 पृष्ठ नहीं मिला", mr: "404 पृष्ठ सापडले नाही" },
  "notfound.desc": { en: "The page you are looking for does not exist or has been moved.", hi: "आप जो पेज ढूंढ रहे हैं वह मौजूद नहीं है या उसे हटा दिया गया है।", mr: "तुम्ही शोधत असलेले पृष्ठ अस्तित्वात नाही किंवा हलवले गेले आहे." },

  // Global Footer
  "footer.agricultural_portal": { en: "Agricultural Portal", hi: "कृषि पोर्टल", mr: "कृषी पोर्टल" },
  "footer.about_desc": { en: "An official digital initiative to optimize water resources for sustainable agriculture and farmer empowerment.", hi: "स्थायी कृषि और किसान सशक्तिकरण के लिए जल संसाधनों को अनुकूलित करने के लिए एक आधिकारिक डिजिटल पहल।", mr: "शाश्वत शेती आणि शेतकरी सक्षमीकरणासाठी जलस्त्रोत अनुकूल करण्यासाठी अधिकृत डिजिटल उपक्रम." },
  "footer.quick_links": { en: "Quick Links", hi: "त्वरित लिंक", mr: "क्विक लिंक्स" },
  "footer.resources": { en: "Resources", hi: "संसाधन", mr: "संसाधने" },
  "footer.privacy_policy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
  "footer.terms_service": { en: "Terms of Service", hi: "सेवा की शर्तें", mr: "सेवा अटी" },
  "footer.help_support": { en: "Help & Support", hi: "सहायता और समर्थन", mr: "मदत आणि समर्थन" },
  "footer.official_contact": { en: "Official Contact", hi: "आधिकारिक संपर्क", mr: "अधिकृत संपर्क" },
  "footer.address": { en: "Krishi Bhawan, New Delhi - 110001", hi: "कृषि भवन, नई दिल्ली - 110001", mr: "कृषी भवन, नवी दिल्ली - 110001" },
  "footer.website_policies": { en: "Website Policies", hi: "वेबसाइट नीतियां", mr: "वेबसाइट धोरणे" },
  "footer.last_updated": { en: "Last Updated", hi: "अंतिम अद्यतन", mr: "शेवटचे अपडेट" },
  "footer.policy": { en: "Policy", hi: "नीति", mr: "धोरण" },
  "footer.help": { en: "Help", hi: "सहायता", mr: "मदत" },

  // Hero Section
  "hero.badge": { en: "AI-Powered Water Governance", hi: "एआई-संचालित जल शासन", mr: "एआय-चालित जल प्रशासन" },
  "hero.title": { en: "AI-Driven Irrigation Billing & 7/12 Recognition", hi: "एआई-चालित सिंचाई बिलिंग और 7/12 पहचान", mr: "एआय-चालित सिंचन बिलिंग आणि 7/12 ओळख" },
  "hero.subtitle": { en: "Automated water auditing through satellite verification and 7/12 land record synchronization for a transparent and efficient agricultural ecosystem.", hi: "एक पारदर्शी और कुशल कृषि पारिस्थितिकी तंत्र के लिए उपग्रह सत्यापन और 7/12 भूमि रिकॉर्ड सिंक्रनाइज़ेशन के माध्यम से स्वचालित जल ऑडिटिंग।", mr: "पारदर्शक आणि कार्यक्षम कृषी परिसंस्थेसाठी सॅटेलाइट पडताळणी आणि 7/12 जमीन रेकॉर्ड सिंक्रोनाइझेशनद्वारे स्वयम्मत जल ऑडिटिंग." },
  "hero.cta": { en: "Onboard Your Farm", hi: "अपने खेत को ऑनबोर्ड करें", mr: "तुमची शेती ऑनबोर्ड करा" },
  "hero.live": { en: "Live Verification", hi: "लाइव सत्यापन", mr: "लाइव्ह पडताळणी" },
  "hero.matched": { en: "Matched", hi: "मिलान हुआ", mr: "जुळले" },
  "hero.billing": { en: "Billing Transparency", hi: "बिलिंग पारदर्शिता", mr: "बिलिंग पारदर्शकता" },
  "hero.usage": { en: "Verified Water Usage", hi: "सत्यापित पानी का उपयोग", mr: "सत्यापित पाण्याचा वापर" },
  "hero.dues": { en: "Current Dues", hi: "वर्तमान बकाया", mr: "चालू थकबाकी" },

  // Features Section
  "features.title": { en: "Verified Records. Fair Billing.", hi: "सत्यापित रिकॉर्ड। उचित बिलिंग।", mr: "सत्यापित रेकॉर्ड. रास्त बिलिंग." },
  "features.desc": { en: "We bridge the gap between traditional land records and modern billing through advanced computer vision and GIS integration.", hi: "हम उन्नत कंप्यूटर विजन और जीआईएस एकीकरण के माध्यम से पारंपरिक भूमि रिकॉर्ड और आधुनिक बिलिंग के बीच की खाई को पाटते हैं।", mr: "आम्ही प्रगत कॉम्प्युटर व्हिजन आणि जीआयएस इंटिग्रेशनद्वारे पारंपारिक जमीन रेकॉर्ड आणि आधुनिक बिलिंगमधील अंतर कमी करतो." },
  "feature.1.title": { en: "Automated 7/12 Recognition", hi: "स्वचालित 7/12 पहचान", mr: "स्वयंचलित 7/12 ओळख" },
  "feature.1.desc": { en: "Instantly parse and verify digital land records against cadastral maps.", hi: "कैडस्ट्रल मानचित्रों के विरुद्ध डिजिटल भूमि रिकॉर्ड को तुरंत पार्स और सत्यापित करें।", mr: "कॅडस्ट्रल मॅप्सच्या विरूद्ध डिजिटल जमीन रेकॉर्ड त्वरित पार्स आणि सत्यापित करा." },
  "feature.2.title": { en: "Satellite Water Audit", hi: "सैटेलाइट वॉटर ऑडिट", mr: "सॅटेलाइट वॉटर ऑडिट" },
  "feature.2.desc": { en: "Verify actual irrigation consumption via high-precision remote sensing telemetry.", hi: "उच्च-सटीक रिमोट सेंसिंग टेलीमेट्री के माध्यम से वास्तविक सिंचाई खपत को सत्यापित करें।", mr: "उच्च-अचूक रिमोट सेन्सिंग टेलिमेट्रीद्वारे वास्तविक सिंचन वापराची पडताळणी करा." },
  "feature.3.title": { en: "AI Invoicing", hi: "एआई इनवॉइसिंग", mr: "एआय इनवॉइसिंग" },
  "feature.3.desc": { en: "Automated billing engine that eliminates manual errors and potential disputes.", hi: "स्वचालित बिलिंग इंजन जो मैन्युअल त्रुटियों और संभावित विवादों को समाप्त करता है।", mr: "स्वयंचलित बिलिंग इंजिन जे मॅन्युअल त्रुटी आणि संभावित विवाद दूर करते." },

  // Billing Flow
  "flow.title": { en: "How We Calculate Transparent Billing", hi: "हम पारदर्शी बिलिंग की गणना कैसे करते हैं", mr: "आम्ही पारदर्शक बिलिंगची गणना कशी करतो" },
  "flow.1.title": { en: "Data Collection", hi: "डेटा संग्रह", mr: "डेटा संकलन" },
  "flow.1.desc": { en: "Satellite and field sensor data are collected every 6 hours.", hi: "सैटेलाइट और फील्ड सेंसर डेटा हर 6 घंटे में एकत्र किया जाता है।", mr: "सॅटेलाइट आणि फील्ड सेन्सर डेटा दर 6 तासांनी गोळा केला जातो." },
  "flow.2.title": { en: "AI Verification", hi: "एआई सत्यापन", mr: "एआय पडताळणी" },
  "flow.2.desc": { en: "AI verifies water flow against 7/12 land size and crop type.", hi: "एआई 7/12 भूमि आकार और फसल के प्रकार के विरुद्ध पानी के प्रवाह को सत्यापित करता है।", mr: "एआय 7/12 जमिनीचा आकार आणि पिकाच्या प्रकारानुसार पाणी प्रवाहाची पडताळणी करते." },
  "flow.3.title": { en: "Invoice Issued", hi: "इनवॉइस जारी", mr: "इनवॉइस जारी" },
  "flow.3.desc": { en: "Transparent billing is pushed to the farmer portal instantly.", hi: "पारदर्शी बिलिंग तुरंत किसान पोर्टल पर भेज दी जाती है।", mr: "पारदर्शक बिलिंग त्वरित शेतकरी पोर्टलवर पाठविले जाते." },

  // Call to Action Section
  "cta.title": { en: "Ready for the future of Water Governance?", hi: "जल शासन के भविष्य के लिए तैयार हैं?", mr: "जल प्रशासनाच्या भविष्यासाठी तयार आहात का?" },
  "cta.main": { en: "Get Started Now", hi: "अभी शुरू करें", mr: "आता सुरू करा" },
  "cta.secondary": { en: "Speak to Admin", hi: "एडमिन से बात करें", mr: "अ‍ॅडमिनशी बोला" },

  // Legacy Sections
  "about.title": { en: "About AquaVera", hi: "एक्वावेरा के बारे में", mr: "एक्वावेरा बद्दल" },
  "about.desc": { en: "We are dedicated to optimizing water usage in agriculture through innovative technology and data-driven solutions.", hi: "हम नवीन तकनीक और डेटा-संचालित समाधानों के माध्यम से कृषि में पानी के उपयोग को अनुकूलित करने के लिए समर्पित हैं।", mr: "आम्ही नाविन्यपूर्ण तंत्रज्ञान आणि डेटा-चालित उपायांद्वारे कृषीमध्ये पाण्याचा वापर इष्टतम करण्यासाठी समर्पित आहोत." },
  "contact.title": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" },
  "contact.name": { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  "contact.email": { en: "Email Address", hi: "ईमेल पता", mr: "ईमेल पत्ता" },
  "contact.message": { en: "Your Message", hi: "आपका संदेश", mr: "तुमचा संदेश" },
  "contact.send": { en: "Send Message", hi: "संदेश भेजें", mr: "संदेश पाठवा" },
  "feedback.title": { en: "Farmer Feedback", hi: "किसान प्रतिक्रिया", mr: "शेतकरी प्रतिक्रिया" },
  "feedback.1.text": { en: "AquaVera has transformed the way I manage my crops. The water savings are incredible!", hi: "एक्वावेरा ने मेरी फसलों के प्रबंधन के तरीके को बदल दिया है। पानी की बचत अविश्वसनीय है!", mr: "एक्वावेरामुळे माझ्या पिकांचे व्यवस्थापन करण्याच्या पद्धतीत बदल झाला आहे. पाण्याची बचत अविश्वसनीय आहे!" },
  "feedback.1.author": { en: "Rajesh Kumar", hi: "राजेश कुमार", mr: "राजेश कुमार" },
  "faqs.title": { en: "Frequently Asked Questions", hi: "अक्सर पूछे जाने वाले प्रश्न", mr: "सतत विचारले जाणारे प्रश्न" },
  "faqs.1.q": { en: "How does AquaVera track water usage?", hi: "एक्वावेरा पानी के उपयोग को कैसे ट्रैक करता है?", mr: "एक्वावेरा पाण्याचा वापर कसा ट्रॅक करतो?" },
  "faqs.1.a": { en: "We use IoT sensors and smart meters to provide real-time data.", hi: "हम वास्तविक समय डेटा प्रदान करने के लिए IoT सेंसर और स्मार्ट मीटर का उपयोग करते हैं।", mr: "आम्ही रिअल-टाइम डेटा प्रदान करण्यासाठी IoT सेन्सर्स आणि स्मार्ट मीटर्स वापरतो." },
  "faqs.2.q": { en: "Can I use it on my mobile phone?", hi: "क्या मैं इसे अपने मोबाइल फोन पर उपयोग कर सकता हूँ?", mr: "मी ते माझ्या मोबाईल फोनवर वापरू शकतो का?" },
  "faqs.2.a": { en: "Yes, our portal is fully responsive and works on all devices.", hi: "हाँ, हमारा पोर्टल पूरी तरह से उत्तरदायी है और सभी उपकरणों पर काम करता है।", mr: "होय, आमचे पोर्टल पूर्णपणे प्रतिसादात्मक आहे आणि सर्व उपकरणांवर कार्य करते।" },

  // Crops
  "crop.wheat": { en: "Wheat", hi: "गेहूं", mr: "गहू" },
  "crop.sugarcane": { en: "Sugarcane", hi: "गन्ना", mr: "ऊस" },
  "crop.rice": { en: "Rice", hi: "चावल", mr: "भात" },
  "crop.cotton": { en: "Cotton", hi: "कपास", mr: "कापूस" },
  "crop.soybean": { en: "Soybean", hi: "सोयाबीन", mr: "सोयाबीन" },

  // Days
  "day.mon": { en: "Mon", hi: "सोम", mr: "सोम" },
  "day.tue": { en: "Tue", hi: "मंगल", mr: "मंगळ" },
  "day.wed": { en: "Wed", hi: "बुध", mr: "बुध" },
  "day.thu": { en: "Thu", hi: "गुरु", mr: "गुरु" },
  "day.fri": { en: "Fri", hi: "शुक्र", mr: "शुक्र" },
  "day.sat": { en: "Sat", hi: "शनि", mr: "शनि" },
  "day.sun": { en: "Sun", hi: "रवि", mr: "रवि" },

  // Footer Branding
  "footer.tagline": { en: "AQUAVERA — THE NEXT GEN IRRIGATION SYSTEM", hi: "एक्वावेरा — अगली पीढ़ी की सिंचाई प्रणाली", mr: "एक्वावेरा — पुढच्या पिढीतील सिंचन प्रणाली" },
  "footer.rights": { en: "All rights reserved", hi: "सर्वाधिकार सुरक्षित", mr: "सर्व हक्क राखीव" },

  // Landing Page Hero Overlays
  "hero.current_dues": { en: "Current Dues", hi: "वर्तमान बकाया", mr: "चालू थकबाकी" },
  "about.verified_desc": { en: "7/12 Record verified via satellite map.", hi: "सैटेलाइट मैप के माध्यम से 7/12 रिकॉर्ड सत्यापित।", mr: "सॅटेलाइट मॅपद्वारे 7/12 रेकॉर्ड सत्यापित." },
  "about.security_first": { en: "Security First Architecture", hi: "सुरक्षा प्रथम आर्किटेक्चर", mr: "सुरक्षा प्रथम आर्किटेक्चर" },
  "about.cadastral_sync": { en: "Cadastral Sync", hi: "कैडस्ट्रल सिंक", mr: "कॅडस्ट्रल सिंक" },

  // Styled Titles (using pipe | as separator for styling)
  "hero.title.styled": { 
    en: "AI-Driven Irrigation Billing & 7/12 Recognition", 
    hi: "एआई-चालित सिंचाई बिलिंग और | 7/12 पहचान", 
    mr: "एआय-चालित सिंचन बिलिंग आणि | 7/12 ओळख" 
  },
  "features.title.styled": {
    en: "Verified Records. | Fair Billing.",
    hi: "सत्यापित रिकॉर्ड। | उचित बिलिंग।",
    mr: "सत्यापित रेकॉर्ड. रास्त बिलिंग."
  },
  "flow.title.styled": {
    en: "How We Calculate | Transparent Billing",
    hi: "हम पारदर्शी बिलिंग की | गणना कैसे करते हैं",
    mr: "आम्ही पारदर्शक बिलिंगची | गणना कशी करतो"
  },
  "cta.title.styled": {
    en: "Ready for the | future | of Water Governance?",
    hi: "क्या आप जल शासन के | भविष्य | के लिए तैयार हैं?",
    mr: "तुम्ही जल प्रशासनाच्या | भविष्यासाठी | तयार आहात का?"
  },

  // Professional Overlays & New Sections
  "billing.invoice_no": { en: "Invoice", hi: "इनवॉइस", mr: "इनवॉइस" },
  "billing.farmer_name": { en: "Farmer", hi: "किसान", mr: "शेतकरी" },
  "billing.location": { en: "Location", hi: "स्थान", mr: "स्थान" },
  "billing.water_usage": { en: "Water Usage", hi: "पानी का उपयोग", mr: "पाण्याचा वापर" },
  "billing.bill_amount": { en: "Bill Amount", hi: "बिल राशि", mr: "बिल रक्कम" },
  "billing.verified_satellite": { en: "Verified by Satellite", hi: "सैटेलाइट द्वारा सत्यापित", mr: "सॅटेलाइटद्वारे सत्यापित" },
  "billing.unpaid": { en: "UNPAID", hi: "अदत्त", mr: "थकित" },
  "billing.pay_now": { en: "Pay Now", hi: "अभी भुगतान करें", mr: "आता द्या" },

  "land_record.title": { en: "7/12 LAND RECORD DOCUMENT", hi: "7/12 भूमि रिकॉर्ड दस्तावेज", mr: "7/12 जमीन महसूल दस्तऐवज" },
  "land_record.village": { en: "VILLAGE", hi: "गाँव", mr: "गाव" },
  "land_record.parcel_id": { en: "PARCEL ID", hi: "पार्सल आईडी", mr: "पार्सल आयडी" },
  "land_record.owner": { en: "OWNER", hi: "मालिक", mr: "मालक" },
  "land_record.crop": { en: "CROP", hi: "फसल", mr: "पीक" },
  "land_record.area": { en: "AREA", hi: "क्षेत्र", mr: "क्षेत्र" },

  "feedback.sect_title": { en: "Farmer Voices", hi: "किसानों की आवाज", mr: "शेतकऱ्यांचे आवाज" },
  "feedback.1.quote": { en: "AquaVera has brought transparency to our water billing. Now we pay exactly for what we use.", hi: "एक्वावेरा ने हमारी जल बिलिंग में पारदर्शिता लाई है। अब हम उसी के लिए भुगतान करते हैं जो हम उपयोग करते हैं।", mr: "एक्वावेरामुळे आमच्या पाणी बिलिंगमध्ये पारदर्शकता आली आहे. आता आम्ही जेवढे वापरतो तेवढेच पैसे देतो." },
  "feedback.2.quote": { en: "The 7/12 integration is a game changer. No more manual verification delays.", hi: "7/12 एकीकरण एक गेम चेंजर है। अब मैन्युअल सत्यापन में देरी नहीं होगी।", mr: "7/12 एकत्रीकरण हे गेम चेंजर आहे. आता मॅन्युअल पडताळणीमध्ये विलंब होणार नाही." },

  "faqs.sect_title": { en: "Common Inquiries", hi: "सामान्य पूछताछ", mr: "सामान्य विचारणा" },
  "faq.1.q": { en: "How is the water billing calculated?", hi: "जल बिलिंग की गणना कैसे की जाती है?", mr: "पाणी बिलिंगची गणना कशी केली जाते?" },
  "faq.1.a": { en: "Billing is calculated based on real-time flow sensor data and verified against satellite imagery of the crop health and land size.", hi: "बिलिंग की गणना रीयल-टाइम फ्लो सेंसर डेटा के आधार पर की जाती है और फसल स्वास्थ्य और भूमि के आकार की सैटेलाइट इमेजरी के विरुद्ध सत्यापित की जाती है।", mr: "रिअल-टाइम फ्लो सेन्सर डेटाच्या आधारे बिलिंगची गणना केली जाते आणि पीक आरोग्य आणि जमिनीच्या आकाराच्या सॅटेलाइट इमेजरीच्या विरूद्ध सत्यापित केली जाते." },
  "faq.2.q": { en: "Is my land data secure?", hi: "क्या मेरा भूमि डेटा सुरक्षित है?", mr: "माझा जमीन डेटा सुरक्षित आहे का?" },
  "faq.2.a": { en: "Yes, we use government-grade encryption and only sync with official records for 7/12 verification.", hi: "हां, हम सरकारी स्तर के एन्क्रिप्शन का उपयोग करते हैं और केवल 7/12 सत्यापन के लिए आधिकारिक रिकॉर्ड के साथ सिंक करते हैं।", mr: "होय, आम्ही सरकारी-ग्रेड एनक्रिप्शन वापरतो आणि केवळ 7/12 पडताळणीसाठी अधिकृत रेकॉर्डसह सिंक करतो." },

  "contact.sect_title": { en: "Get in Touch", hi: "संपर्क में रहें", mr: "संपर्कात रहा" },
  "contact.office": { en: "Official Headquarters", hi: "आधिकारिक मुख्यालय", mr: "अधिकृत मुख्यालय" },
  "contact.support": { en: "Technical Support", hi: "तकनीकी सहायता", mr: "तांत्रिक सहाय्य" }
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
