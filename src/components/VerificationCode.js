import React from "react";
import "./VerificationCode.css"; // Import your CSS file for styling

const VerificationCode = () => {
  
    const handleSubmit = () =>{
        
    }

  return (
    <div className="main-container">
      <input className="otp" type="text" maxLength="1" />
      <input className="otp" type="text" maxLength="1" />
      <input className="otp" type="text" maxLength="1" />
      <input className="otp" type="text" maxLength="1" />
      <input className="otp" type="text" maxLength="1" />
      <input className="otp" type="text" maxLength="1" />
      <button className="submit-btn" type="submit" onClick={handleSubmit}>
        Submit
      </button>
    
    </div>
  );
};

export default VerificationCode;
