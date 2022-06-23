import React, { useContext } from "react";
import { Button } from "primereact/button";
import { GetContext } from "@/contexts/get";
import LeftSidebar from "@/components/molecules/leftSidebar";

const LeftSidebarButton = () => {
  const { setVisible } = useContext(GetContext);

  return (
    <div className={`fancy-selector-w`}>
      <Button
        icon="pi pi-arrow-right"
        onClick={() => setVisible(true, "left")}
        className="mr-2"
        style={{ justifySelf: "flex-start" }}
      />
      <LeftSidebar />
    </div>
  );
};

export default LeftSidebarButton;
