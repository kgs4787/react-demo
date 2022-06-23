import React, { useContext } from "react";
import { Sidebar } from "primereact/sidebar";
import Router from "next/router";
import UserProfile from "@/components/atoms/userProfile";
import useDarkMode from "use-dark-mode";
import DarkModeToggle from "react-dark-mode-toggle";
import { GetContext } from "@/contexts/get";

const LeftSidebar = () => {
  const darkMode = useDarkMode(false);
  const { visibleLeft, setVisible } = useContext(GetContext);

  return (
    <div className={`fancy-selector-w`}>
      <Sidebar
        className="left-sidebar"
        visible={visibleLeft}
        onHide={() => setVisible(false, "left")}
      >
        <h3>Left Menu</h3>
        <UserProfile />
        <h5
          onClick={() => {
            setVisible(false, "left");
            Router.push("http://localhost:3000/its/noticeboard");
          }}
        >
          공지 사항
        </h5>
        <h5
          onClick={() => {
            setVisible(false, "left");
            Router.push("http://localhost:3000/its/virtualboard");
          }}
        >
          Virtual Scroll
        </h5>
        <DarkModeToggle
          onChange={darkMode.toggle}
          checked={darkMode.value}
          size={80}
        />
      </Sidebar>
    </div>
  );
};

export default LeftSidebar;
