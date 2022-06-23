import React, { useRef, useContext } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { GetContext } from "@/contexts/get";
import RegModal from "@/components/molecules/regModal";
import Router from "next/router";

const RegButton = () => {
  const toast = useRef<any>(null);
  const { user, setVisible } = useContext(GetContext);

  return (
    <div className={`fancy-selector-w`}>
      <i
        className="pi pi-download"
        onClick={() => {
          if (!user || user.name === undefined) {
            Router.push("http://localhost:3000/its/login");
            throw toast.current.show({
              severity: "error",
              summary: "Error Message",
              detail: "로그인 후 이용하시기 바랍니다.",
              life: 3000,
            });
          }
          setVisible(true, "Reg");
        }}
        style={{ fontSize: "30px" }}
      ></i>
      <Toast ref={toast} />
      <RegModal />
    </div>
  );
};
export default RegButton;
