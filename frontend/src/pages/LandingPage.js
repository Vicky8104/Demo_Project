import { useEffect, useState } from "react";
export default function LandingPage() {

  const postCards = [
   /* { title: "प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-1 संस्कृत", adv: "कुल पद - 187" },
    { title: "प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-1 सामान्य", adv: "कुल पद - 449" },
    { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 संस्कृत", adv: "कुल पद - 389" },
    { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 अंग्रेजी", adv: "कुल पद - 221" },
    { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 हिन्दी", adv: "कुल पद - 174" },
    { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 गणित-विज्ञान", adv: "कुल पद - 1043" },
    { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 सामजिक विज्ञान", adv: "कुल पद - 296" }*/
    {title: "चतुर्थ श्रेणी सीधी भर्ती 2024 (नान टीएसपी)", sub: "-", adv: "कुल पद - 387"},
    {title: "चतुर्थ श्रेणी सीधी भर्ती 2024 (टीएसपी)", sub: "-", adv: "कुल पद - 34"}
  ]
  const [index, setIndex] = useState(0);
  const extendedCards = [...postCards, ...postCards];
  const [isTransition, setIsTransition] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // setIndex((prev) =>
      //   prev === postCards.length - 1 ? 0 : prev + 1);
      setIndex((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index >= postCards.length) {

      setTimeout(() => {
        setIsTransition(false); // transition OFF
        setIndex(0);            // jump silently
      }, 600); // CSS transition time

      setTimeout(() => {
        setIsTransition(true);  // transition ON again
      }, 650);

    }
  }, [index, postCards.length]);






  return (
    <>
    <div className="all-main" style={{ textAlign: "center" }}>
       {/* <h2>-: संदेश :-</h2>
      <div className="officer-msg-container">
       
        <div className="officer-msg">
          <div className="greeting">
            <p>हमारे विभाग में आपका हार्दिक स्वागत है! विभाग का नाम, की पूरी टीम की ओर से, हम आपके उज्ज्वल भविष्य और सीखने की यात्रा की कामना करते हैं। हमें आपकी क्षमताओं पर पूरा भरोसा है, और हम एक साथ मिलकर बेहतरीन कार्य करेंगे।
              आपके कुशल नेतृत्व और निरंतर सहयोग के लिए आपका बहुत.बहुत धन्यवाद। आपके मार्गदर्शन में काम करना हमारे लिए बेहद प्रेरणादायक है। हम आपके दृष्टिकोण के अनुरूप विभाग को नई ऊंचाइयों पर ले जाने के लिए पूरी तरह प्रतिबद्ध हैं।
              आपके नेतृत्व में काम करना एक अद्भुत अनुभव रहा है। आपके द्वारा दिए गए ज्ञान और सहयोग के लिए हम हमेशा आभारी रहेंगे। आपके नए सफर और भविष्य के लिए आपको हमारी ओर से ढेर सारी शुभकामनाएं।
            </p>
          </div>
          <div className="officer-post">
            <p>Priynka Jodhwart</p>
            <p>commissioner</p>
            <p>sanskrit education department </p>
          </div>
        </div>
        <div className="officer-msg">
          <div className="greeting">
            <p>हमारे विभाग में आपका हार्दिक स्वागत है! विभाग का नाम, की पूरी टीम की ओर से, हम आपके उज्ज्वल भविष्य और सीखने की यात्रा की कामना करते हैं। हमें आपकी क्षमताओं पर पूरा भरोसा है, और हम एक साथ मिलकर बेहतरीन कार्य करेंगे।
              आपके कुशल नेतृत्व और निरंतर सहयोग के लिए आपका बहुत.बहुत धन्यवाद। आपके मार्गदर्शन में काम करना हमारे लिए बेहद प्रेरणादायक है। हम आपके दृष्टिकोण के अनुरूप विभाग को नई ऊंचाइयों पर ले जाने के लिए पूरी तरह प्रतिबद्ध हैं।
              आपके नेतृत्व में काम करना एक अद्भुत अनुभव रहा है। आपके द्वारा दिए गए ज्ञान और सहयोग के लिए हम हमेशा आभारी रहेंगे। आपके नए सफर और भविष्य के लिए आपको हमारी ओर से ढेर सारी शुभकामनाएं।
            </p>
          </div>
          <div className="officer-post">
            <p>Dr. Bhaskar Sharma</p>
            <p>Joint Director</p>
            <p>sanskrit education department </p>
          </div>
        </div>
        <div className="officer-msg">
          <div className="greeting">
            <p>हमारे विभाग में आपका हार्दिक स्वागत है! विभाग का नाम, की पूरी टीम की ओर से, हम आपके उज्ज्वल भविष्य और सीखने की यात्रा की कामना करते हैं। हमें आपकी क्षमताओं पर पूरा भरोसा है, और हम एक साथ मिलकर बेहतरीन कार्य करेंगे।
              आपके कुशल नेतृत्व और निरंतर सहयोग के लिए आपका बहुत.बहुत धन्यवाद। आपके मार्गदर्शन में काम करना हमारे लिए बेहद प्रेरणादायक है। हम आपके दृष्टिकोण के अनुरूप विभाग को नई ऊंचाइयों पर ले जाने के लिए पूरी तरह प्रतिबद्ध हैं।
              आपके नेतृत्व में काम करना एक अद्भुत अनुभव रहा है। आपके द्वारा दिए गए ज्ञान और सहयोग के लिए हम हमेशा आभारी रहेंगे। आपके नए सफर और भविष्य के लिए आपको हमारी ओर से ढेर सारी शुभकामनाएं।
            </p>
          </div>
          <div className="officer-post">
            <p>Dr. Mahendra Kumar Sharma</p>
            <p>Deputy Director</p>
            <p>sanskrit education department </p>
          </div>
        </div>
      </div> */}

      
      <h1>COUNSELLING PORTAL</h1>

      <div className="all-main-content" >
        <h2>चतुर्थ श्रेणी सीधी भर्ती-2025</h2>

        <div className="all-main-container" >
          <div
            className="scroll-track"
            style={{
              transform: `translateX(-${index * 350}px)`,
              transition: isTransition ? "transform 0.6s ease-in-out" : "none"
            }}
          >

            {extendedCards.map((item, i) => (
              <div className="post-detail-card" key={i}>
                <h3>{item.title} </h3>
                <h4>{item.sub}</h4>
                <h4>{item.adv}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
