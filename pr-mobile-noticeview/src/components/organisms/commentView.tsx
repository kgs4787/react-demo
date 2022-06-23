import React, { useRef, useContext, useEffect } from "react";
import { DataView } from "primereact/dataview";
import CommentButton from "@/components/atoms/commentButton";
import { Toast } from "primereact/toast";
import axios from "axios";
import { GetContext } from "@/contexts/get";
import { Avatar, Image } from "antd";
const CommentView = () => {
  const toast = useRef<any>(null);
  const { getDetailInforms, user, detailInform, getUsers, users } =
    useContext(GetContext);

  useEffect(() => {
    getUsers();
  }, []);

  const deleteComment = async (id, username) => {
    if (!user || user.name === undefined) {
      throw toast.current.show({
        severity: "error",
        summary: "Error Message",
        detail: "로그인 후 이용하시기 바랍니다.",
        life: 3000,
      });
    }

    if (user.email !== "master@master.com" && user.name !== username) {
      throw toast.current.show({
        severity: "error",
        summary: "Error Message",
        detail: "본인이 작성한 댓글만 삭제할 수 있습니다.",
        life: 3000,
      });
    }
    const comments = detailInform.comment.filter(
      (comment) => comment.id !== id
    );
    const length = Number(detailInform.commentlength);
    await axios
      .patch("http://localhost:3001/informs/" + detailInform.id, {
        comment: comments,
        commentlength: length - 1,
      })
      .then(() => {
        getDetailInforms(detailInform.id);
      });

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Comment Deleted",
      life: 3000,
    });
  };

  const renderListItem = (data) => {
    const userid = users.find((user) => user.id === data.commentuserid);
    return (
      <div className="col-12">
        <div className="comment-list-item">
          <Avatar
            icon={
              userid.image === undefined || userid.image === null ? (
                <Image
                  src={"https://joeschmoe.io/api/v1/random"}
                  style={{ width: 30 }}
                  preview={false}
                />
              ) : (
                <Image
                  src={userid.image}
                  style={{ width: 30 }}
                  preview={false}
                />
              )
            }
            size={30}
            className="comment-list-photo"
          />
          <div className="comment-list-username">{userid.name}</div>
          <span className="comment-list-date">{data.commentdate}</span>
          <div
            className="comment-list-comment"
            dangerouslySetInnerHTML={{ __html: data.comment }}
          ></div>
          <i
            className="pi pi-times"
            onClick={() => deleteComment(data.id, userid.name)}
          />
        </div>
      </div>
    );
  };

  const itemTemplate = (inform, layout) => {
    if (!inform) {
      return;
    }

    if (layout === "list") return renderListItem(inform);
  };

  const renderHeader = () => {
    return (
      <div className="grid grid-nogutter">
        <div className="col-6" style={{ textAlign: "left" }}>
          <div>댓글 {detailInform.commentlength}</div>
        </div>
        <div className="col-6" style={{ textAlign: "right" }}>
          <CommentButton />
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div>
      <Toast ref={toast} />
      <DataView
        paginatorClassName="paginator"
        value={detailInform.comment}
        layout={"list"}
        header={header}
        itemTemplate={itemTemplate}
        paginator
        alwaysShowPaginator={false}
        rows={5}
      />
    </div>
  );
};

export default CommentView;
