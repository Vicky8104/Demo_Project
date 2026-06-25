import { useEffect, useState } from "react";
import "./OtpModal.css";

export default function OtpModal({
  otp,
  setOtp,
  verifyOtpHandler,
  resendOtp,
  onClose
}) {

  const [timer, setTimer] = useState(15);
  

  useEffect (()=>{
    if(timer === 0) return;
    const interval = setInterval (()=>{
      setTimer ((prev)=> prev-1);
    },1000);
    return ()=>clearInterval(interval);
  },[timer]);


  const handleResend= ()=>{
    resendOtp();
    setTimer(15);
  };

  
  return (
    <div className="otp-overlay">
      <div className="otp-box">
        <h3>Enter OTP</h3>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />

        <div className="otp-buttons">
          <button onClick={verifyOtpHandler}>Verify</button>
          <button onClick={handleResend} disabled = {timer>0}  > {timer > 0 ? `Resend in  ${timer}s`:"Resend"}</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}