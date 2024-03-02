import React from "react";
import "./Pages.css";
import Skeleton from "../utils/Skeleton";

import { BsInstagram } from "react-icons/bs";
import { RiTwitterXLine } from "react-icons/ri";

const Contact = () => {
  return (
    <Skeleton>
      <div className='_contact_help'>
        <div>
          <h3 className='_contact_title'>Contact us.</h3>
          <p className='_contact_p'>
            We are here to help you with any questions you may have. Please feel
            free to contact us.
          </p>
        </div>

        <ul className='_contact_list'>
          <li>
            <a href='mailto:info.wishties@gmail.com'>info.wishties@gmail.com</a>
          </li>{" "}
          <li>
            <a
              href='https://www.instagram.com/wishties_/'
              target='_blank'
              rel='noopener noreferrer'>
              <span>
                <BsInstagram />
              </span>
              Instagram
            </a>
          </li>
          <li>
            <a
              href='https://twitter.com/wishties_'
              target='_blank'
              rel='noopener noreferrer'>
              <span>
                <RiTwitterXLine />
              </span>
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </Skeleton>
  );
};

export default Contact;
