import React, { useState, useRef } from "react";
import { Menubar } from "primereact/menubar";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "react-datepicker/dist/react-datepicker.css";
import { useItsSelector, useItsDispatch } from "@/redux/hooks";
import Link from "next/link";
import { Tree } from "primereact/tree";
import Router from "next/router";

const ItsProjectMenu = () => {
  const selectedMenu = useItsSelector(({ menu }) => menu.selectedMenu);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const nodes = [
    {
      key: "0",
      label: "이슈 관리",
      children: [
        {
          key: "0-0",
          label: "이슈 관리",
          url: "http://localhost:3000/its/test",
        },
      ],
    },
    {
      key: "1",
      label: "NoticeBoard",
      children: [
        {
          key: "1-0",
          label: "공지사항",
          url: "http://localhost:3000/its/noticeboard",
        },
      ],
    },
  ];

  const nodeTemplate = (node, options) => {
    let label = <b>{node.label}</b>;

    if (node.url) {
      label = <a href={node.url}>{node.label}</a>;
    }

    return <span className={options.className}>{label}</span>;
  };

  const start = (
    <Button
      icon="pi pi-arrow-right"
      onClick={() => setVisibleLeft(true)}
      className="mr-2"
    />
  );
  const end = (
    <div>
      <Button
        icon="pi pi-cog"
        onClick={() => {
          Router.push("http://localhost:3000/its/option");
        }}
      />
      <Button
        icon="pi pi-arrow-left"
        onClick={() => setVisibleRight(true)}
        className="mr-2"
      />
    </div>
  );
  return (
    <div className={`fancy-selector-w`}>
      <div className="card">
        <Menubar start={start} end={end} />
      </div>
      <div className="fancy-selector-options ntm-prj__list"></div>
      <Sidebar visible={visibleLeft} onHide={() => setVisibleLeft(false)}>
        <h3>Left Menu</h3>
        <Tree value={nodes} nodeTemplate={nodeTemplate} />
      </Sidebar>
      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
      >
        <h3>Right Sidebar</h3>
      </Sidebar>
    </div>
  );
};

export default ItsProjectMenu;
