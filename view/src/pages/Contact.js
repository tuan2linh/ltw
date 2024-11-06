import ContactForm from "../components/Contact/ContactForm";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { scrollToTop } from "../helper/scrollToTop";
import { useEffect } from "react";
const Contact = () => {
  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <div className="contact-page">
      <Header />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Contact;
