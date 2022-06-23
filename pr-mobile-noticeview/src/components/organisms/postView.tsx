import React, { useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import FileList from "@/components/atoms/fileList";
import CommentView from "@/components/organisms/commentView";
import { GetContext } from "@/contexts/get";
import { Toast } from "primereact/toast";
import axios from "axios";
import Router from "next/router";
import { AiOutlineEye } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import EditModal from "@/components/molecules/editModal";
import { Avatar, Image } from "antd";

const PostView = () => {
  const router = useRouter();
  const { detailInform, getDetailInforms, user, setVisible, detailUser } =
    useContext(GetContext);
  const toast = useRef<any>(null);
  useEffect(() => {
    getDetailInforms(router.query.id);
  }, []);

  const onSubmit = async () => {
    detailInform.heartcount = Number(detailInform.heartcount);

    await axios
      .patch("http://localhost:3001/informs/" + router.query.id, {
        heartcount: detailInform.heartcount + 1,
      })
      .then(() => {
        getDetailInforms(router.query.id);
      });
  };

  const deleteProduct = () => {
    axios.delete("http://localhost:3001/informs/" + detailInform.id);
    Router.push("http://localhost:3000/its/noticeboard");
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  return (
    <div className="postview">
      <Toast ref={toast} />
      <div className="postview-top">
        <div className="postview-title">{detailInform.title}</div>
        <div className="postview-button">
          {!user ? null : user.name === detailUser.name ||
            user.name === "master" ? (
            <Button
              className="postview-edit"
              onClick={() => setVisible(true, "edit")}
            >
              수정
            </Button>
          ) : null}
          {!user ? null : user.name === detailUser.name ||
            user.name === "master" ? (
            <Button className="postview-delete" onClick={deleteProduct}>
              삭제
            </Button>
          ) : null}
        </div>
      </div>
      <div className="postview-user">
        <Avatar
          icon={
            detailUser.image === undefined || detailUser.image === null ? (
              <Image
                src={"https://joeschmoe.io/api/v1/random"}
                style={{ width: 30 }}
                preview={false}
              />
            ) : (
              <Image
                src={detailUser.image}
                style={{ width: 30, height: 30 }}
                preview={false}
              />
            )
          }
          size={30}
          className="photo"
        />
        <div>{detailUser.name}</div>
      </div>
      <FileList />
      <div
        className="postview-content"
        dangerouslySetInnerHTML={{ __html: detailInform.inform }}
      ></div>
      <div className="postview-state">
        <div>
          <FcLike
            onClick={() => {
              if (!user || user.name === undefined) {
                throw toast.current.show({
                  severity: "error",
                  summary: "Error Message",
                  detail: "로그인 후 이용하시기 바랍니다.",
                  life: 3000,
                });
              }
              onSubmit();
            }}
          />
          {detailInform.heartcount}
        </div>
        <div className="postivew-view">
          <AiOutlineEye />
          {detailInform.view}
        </div>
      </div>
      <div className="postview-date">{detailInform.date}</div>
      <div className="postview-comment">
        <CommentView />
      </div>
      <EditModal />
    </div>
  );
};

export default PostView;
