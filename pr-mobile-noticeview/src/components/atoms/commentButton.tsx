import React, { useRef, useContext } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { GetContext } from "@/contexts/get";
import CommentModal from "@/components/molecules/commentModal";

const CommentButton = () => {
  const toast = useRef<any>(null);
  const { user, setVisible } = useContext(GetContext);

  return (
    <div className={`fancy-selector-w`}>
      <Button
        onClick={() => {
          if (!user || user.name === undefined) {
            throw toast.current.show({
              severity: "error",
              summary: "Error Message",
              detail: "로그인 후 이용하시기 바랍니다.",
              life: 3000,
            });
          }
          setVisible(true, "comment");
        }}
      >
        댓글 등록
      </Button>
      <Toast ref={toast} />
      <CommentModal />
    </div>
  );
};

export default CommentButton;
