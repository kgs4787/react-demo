import React from "react";
import { AiTwotoneSound } from "react-icons/ai";
import ImportButton from "@/components/atoms/importButton";
import LeftSidebarButton from "@/components/atoms/leftSidebarButton";
import ExportButton from "@/components/atoms/exportButton";
import Router from "next/router";
import axios from "axios";
const testData = () => {
  axios
    .get("https://pims.skcc.com/comm/all/menus")
    .then((res) => console.log(res));
};

const ItsProjectMenu = () => {
  return (
    <div className={`fancy-selector-w`}>
      <div className="top-bar-content">
        <div className="mr-2">
          <LeftSidebarButton />
        </div>
        <div className="title">
          <AiTwotoneSound />
          <div
            onClick={() => {
              Router.push("http://localhost:3000/its/noticeboard");
            }}
          >
            공지 사항
          </div>
        </div>
        <button onClick={testData}>테스트</button>
        <div className="reg">
          <ImportButton />
          <ExportButton />
        </div>
      </div>
    </div>
  );
};

export default ItsProjectMenu;
