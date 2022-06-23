import React, { useContext, useEffect, useRef } from "react";
import { GetContext } from "@/contexts/get";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const MasterDelete = () => {
  const { deleteInforms, inform, users, getUsers, deleteUsers } =
    useContext(GetContext);
  const toast = useRef<any>(null);

  useEffect(() => {
    getUsers();
  }, []);

  const informDelete = () => {
    for (let i = 0; i < inform.length; i++) {
      setTimeout(() => {
        const array = [];
        array.push(inform[i]);
        array.map((id) => deleteInforms(id.id));
        if (i === inform.length - 1) {
          toast.current.show({
            severity: "success",
            summary: "성공",
            detail: "전체 삭제되었습니다.",
            life: 3000,
          });
        }
      }, i * 100);
    }
  };

  const userDelete = () => {
    for (let i = 0; i < users.length; i++) {
      setTimeout(() => {
        const array = [];
        array.push(users[i]);
        array.map((id) => {
          if (
            id.email !== "master@master.com" &&
            id.email !== "demo@demo.com" &&
            id.email !== "demo1@demo1.com" &&
            id.email !== "demo2@demo2.com" &&
            id.email !== "demo3@demo3.com"
          ) {
            deleteUsers(id.id);
          }
        });
        if (i === users.length - 1) {
          toast.current.show({
            severity: "success",
            summary: "성공",
            detail: "전체 삭제되었습니다.",
            life: 3000,
          });
        }
      }, i * 100);
    }
  };
  return (
    <div>
      <h5>관리자 메뉴</h5>
      <Toast ref={toast} />
      <span className="p-buttonset">
        <Button
          label="게시물 전체 삭제"
          icon="pi pi-trash"
          onClick={informDelete}
        />
        <Button
          label="유저 전체 삭제"
          icon="pi pi-trash"
          onClick={userDelete}
        />
      </span>
    </div>
  );
};

export default MasterDelete;
