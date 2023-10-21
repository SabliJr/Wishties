import React from "react";
import "./YourData.css";

const Index = () => {
  return (
    <section className='dataSection'>
      <h2>Your data?</h2>
      <p>
        🔒 All the creator and fan information stays <span>private</span> and is
        not shared between parties.
      </p>
      <p>
        🔒 All of your data on WishLinks is secured by <span>TLS (SSL)</span>{" "}
        256-bit encryption.
      </p>
      <p>
        🔒 All of your data are protected with the{" "}
        <span>European data protection low</span> GDPR.
      </p>
      <button>Get early access</button>
    </section>
  );
};

export default Index;
