/**
 * Mock Audio Consent Placeholder
 * In production, replace these with actual audio files
 * Audio files should be stored in public/audio/ directory
 */

// Placeholder consent text (used for subtitle/transcript)
export const consentTexts = {
  English: `
    This monitoring system has been designed to help improve patient safety and 
    prevent infections related to central lines. 
    
    We will be capturing images and recording clinical data every 12 hours to 
    assess the safety and integrity of your central line.
    
    Your privacy is our top priority. No personal identifying information will be stored.
    
    You have the right to withdraw consent at any time.
    
    Do you understand and consent to this monitoring?
  `,
  Hindi: `
    यह निगरानी प्रणाली रोगी की सुरक्षा में सुधार लाने के लिए डिज़ाइन की गई है।
    
    हम हर 12 घंटे में आपकी सेंट्रल लाइन की सुरक्षा का आकलन करने के लिए 
    चित्र लेंगे और नैदानिक डेटा रिकॉर्ड करेंगे।
    
    आपकी गोपनीयता हमारी प्राथमिकता है।
    
    क्या आप इस निगरानी के लिए सहमत हैं?
  `,
  Tamil: `
    இந்த கண்காணிப்பு முறை நோயாளির பாதுகாப்பை மேம்படுத்த வடிவமைக்கப்பட்டுள்ளது.
    
    உங்கள் மைய வரியின் பாதுகாப்பை மதிப்பிடுவதற்கு நாம் 12 மணிநேரத்திற்கு 
    ஒரு முறை படங்களை எடுத்து மருத்துவ தரவுகளை பதிவு செய்வோம்.
    
    உங்கள் தனியுரிமை எங்களின் முதன்மை குறிக்கோள்.
    
    இந்த கண்காணிப்புக்கு நீங்கள் சம்மதிக்கிறீர்களா?
  `,
  Telugu: `
    ఈ పర్యవేక్షణ వ్యవస్థ రోగి సុരక్షను మెరుగుపరచడానికి రూపొందించబడింది.
    
    మీ సెంట్రల్ లైన్ సురక్షను అంచనా వేయడానికి ప్రతి 12 గంటలకు 
    చిత్రాలు తీసుకొని క్లినికల్ డేటా నమోదు చేస్తాము.
    
    మీ గోపనీయత మా ప్రధాన ఆগ్రహం.
    
    ఈ పర్యవేక్షణకు మీరు సమ్మతిస్తున్నారా?
  `,
};

// Mock audio file URLs (replace with actual audio files)
export const mockAudioUrls = {
  English: '/audio/consent-english.mp3',
  Hindi: '/audio/consent-hindi.mp3',
  Tamil: '/audio/consent-tamil.mp3',
  Telugu: '/audio/consent-telugu.mp3',
};

// Note: To create actual audio files:
// 1. Use text-to-speech tools (Google Cloud TTS, AWS Polly, etc.)
// 2. Record nurse-approved scripts
// 3. Convert to MP3 format
// 4. Place in public/audio/ directory
// 5. Update mockAudioUrls to point to actual files
