import React from 'react';
import * as MaterialUI from '../components/MaterialUI';

function ContactPage() {
  return (
    <React.Fragment>
    <div><MaterialUI.SideBar></MaterialUI.SideBar></div> 
    <div className="contact-container">
      <div className="contact-us">
        <h1>Contact Us</h1>
        <p>Questions or concerns? Fill out the form to get in touch with us.</p>
      </div>
      <div className="feedback-form">
        <h2>Contact Us</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="feedback">What can we help you with?</label>
            <textarea id="feedback" name="feedback" rows="4" required></textarea>
          </div>
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
    </React.Fragment>

  );
}

export default ContactPage;