// import { useEffect, useState } from "react";
import "./LandingPage.css";
export default function LandingPage() {

  // const postCards = [
  //   { title: "प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-1 संस्कृत", adv: "कुल पद - 187" },
  //   { title: "प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-1 सामान्य", adv: "कुल पद - 449" },
  //   { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 संस्कृत", adv: "कुल पद - 389" },
  //   { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 अंग्रेजी", adv: "कुल पद - 221" },
  //   { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 हिन्दी", adv: "कुल पद - 174" },
  //   { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 गणित-विज्ञान", adv: "कुल पद - 1043" },
  //   { title: "उच्च प्राथमिक विद्यालय अध्यापक भर्ती परीक्षा 2025", sub: "लेवल-2 सामजिक विज्ञान", adv: "कुल पद - 296" }
  // ]
  // const [index, setIndex] = useState(0);
  // const extendedCards = [...postCards, ...postCards];
  // const [isTransition, setIsTransition] = useState(true);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // setIndex((prev) =>
  //     //   prev === postCards.length - 1 ? 0 : prev + 1);
  //     setIndex((prev) => prev + 1);
  //   }, 2000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   if (index >= postCards.length) {

  //     setTimeout(() => {
  //       setIsTransition(false); // transition OFF
  //       setIndex(0);            // jump silently
  //     }, 600); // CSS transition time

  //     setTimeout(() => {
  //       setIsTransition(true);  // transition ON again
  //     }, 650);

  //   }
  // }, [index, postCards.length]);






  return (
    <>
      <div className="all-main" style={{ textAlign: "center" }}>

        <h1>चतुर्थ श्रेणी सीधी भर्ती 2024 के अन्तर्गत चयनित अभ्यर्थियों के लिए पदस्थापन काउंसलिग फाॅर्म</h1>

        {/* <div className="all-main-content" >
          <h2>प्राथमिक/उच्च प्राथमिक-विद्यालय-अध्यापक-सीधी भर्ती-2025 अन्तर्गते विज्ञापितपदानां विवरणम्</h2>

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
        </div> */}
        <div className="instruction-container">
          <h2> Instructions for Candidates</h2>
            <div className="first">
              <ol className="inst-list">
                <li>Login करने के लिए अभ्यर्थी को Login बटन पर Click करना होगा। </li>
                <li>फिर अपनी Gmail Id एवं Password से लाॅगिन करना होगा।</li>
                <li>अभ्यर्थी का लाॅगिन पासवर्ड अभ्यर्थी के नाम के प्रथम चार अल्फाबेट(केपिटल लेटर्स) तथा # का चिह्न, जन्म वर्ष एवं मोबाईल नम्बर के प्रथम चार अंक होगा।</li>
                <li>उदाहरण के लिए अभ्यर्थी का नाम OM PRAKASH, जन्मतिथि 01.01.2000 है एवं मोबाईल नम्बर 1234567890 है तो अभ्यर्थी का पासवर्ड OMPR#20001234 होगा।</li>
                <li>From Login होने पर Personal detail Form Open होगा जिसमें अभ्यर्थी के व्यक्तिगत विवरण जैसे मेरिट नम्बर, नाम, पिता का नाम, मोबाईल नम्बर व ईमेल का विवरण भरा हुआ मिलेगा। यदि अपेक्षित हो तो इसमें अभ्यर्थी केवल वैवाहिक स्थिति, गृह जिला व अन्य विवरण में परिवर्तन कर सकेगा।</li>
                <li>जो अभ्यर्थी पति-पत्नी प्रकरण, शहीद परिवार का आश्रित, असाध्य रोग से ग्रस्त या अन्य किसी स्थिति का उल्लेख करना चाहते हैं तो पोर्टल पर बने "If Other" में स्पष्ट रूप से वर्णित करें तथा संबंधित दस्तावेज संलग्न करें। अभ्यर्थी पति-पत्नी प्रकरण (राज्य कर्मचारी  होने पर पदस्थापित जिले का उल्लेख करें साथ ही पदस्थापित जिले में कार्यरत का प्रमाण भी संलग्न कर पीडीएफ के साथ भेजें) "If Other" में उल्लेख करने पर Submitted Counselling Form Download कर हस्ताक्षर कर मय प्रमाण विभागीय मेल आईडी पर मेल किया जाना अनिवार्य है।</li>
                <li>सभी अभ्यर्थियों को भरे गये प्रपत्र को Download कर हस्ताक्षर कर विभागीय <strong className="mailid">Mail Id- sans.grade4.2024@gmail.com</strong> पर प्रपत्र की पीडीएफ और आवश्यक हो तो संलग्न दस्तावेज भेजें।</li>
                <li>अभ्यर्थी एक बार ही प्रपत्र Submit कर सकता है अतः सावधानीपूर्वक जांच कर प्रपत्र भरे।</li>
              </ol>
            </div>
        </div>
      </div>
    </>
  );
}
