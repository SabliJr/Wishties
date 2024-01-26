import React, { useEffect } from "react";
import "./Hero.css";

import { useNavigate } from "react-router-dom";
import { iLocalUser } from "../../Types/creatorStuffTypes";

const Index = () => {
  const [user_info, setUser_info] = React.useState<iLocalUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let role = localStorage.getItem("user_info");
    if (role) setUser_info(JSON.parse(role));
    else setUser_info(null);
  }, [navigate]);

  const handleGetStarted = () => {
    user_info?.role === "creator"
      ? navigate(`/edit-profile/${user_info?.username}`)
      : navigate(`/signUp`);
  };

  return (
    <section className='hero'>
      <h2>
        Your fan's <span>wish links</span> and your <span>wishlist </span>
        all in one place.
      </h2>
      <p>
        Stop confusing your fans, make it easier for them to support you! Create
        a wishlist and link in bio in one hub {"  "}
        <span> All for free.</span>
      </p>
      <div className='emailDiv'>
        <button onClick={handleGetStarted}>Get Started</button>
      </div>
    </section>
  );
};

export default Index;
