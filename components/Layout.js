import React from "react";
import NavBar from "./NavBar";
import Notify from "./Notify";
import Modal from "./Modal";
import Footer from "./Footer/Footer";

function Layout({ children }) {
  return (
    <div>
      <NavBar />
      <Notify />
      <Modal />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
