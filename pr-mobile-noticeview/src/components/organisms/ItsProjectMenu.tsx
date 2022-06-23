import React from "react";
import { AiTwotoneSound } from "react-icons/ai";
import RegButton from "@/components/atoms/regButton";
import LeftSidebarButton from "@/components/atoms/leftSidebarButton";
import Router from "next/router";

const ItsProjectMenu = () => {
  return (
    <div className={`fancy-selector-w`}>
      <div className="top-bar-content">
        <div className="mr-2">
          <LeftSidebarButton />
        </div>
        <div className="title">
          <AiTwotoneSound />
          <div>공지 사항</div>
        </div>
        <div className="reg">
          <i
            className="pi pi-list"
            onClick={() => {
              Router.push("http://localhost:3000/its/noticeboard");
            }}
            style={{ fontSize: "30px" }}
          ></i>
          <RegButton />
        </div>
      </div>
    </div>
  );
};

export default ItsProjectMenu;
