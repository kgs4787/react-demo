import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import moment from "moment";
import { Editor } from "primereact/editor";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Row } from "react-bootstrap";
import { Calendar } from "primereact/calendar";
import { Sidebar } from "primereact/sidebar";
import { GetContext } from "@/contexts/get";

const CommentButton = () => {
  const [text1, setText1] = useState<any>("");
  const [regDate, setRegDate] = useState<any>(new Date());
  const toast = useRef<any>(null);
  const reg_date = moment(regDate).format("YYYY-MM-DD");
  const { getDetailInforms, user, visibleComment, setVisible, detailInform } =
    useContext(GetContext);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (detailInform.comment === undefined) {
      const length = Number(detailInform.commentlength);
      await axios
        .patch("http://localhost:3001/informs/" + detailInform.id, {
          comment: [
            {
              comment: text1,
              commentdate: reg_date,
              commentuserid: user.id,
              id: length,
            },
          ],
          commentlength: length + 1,
        })
        .then(() => {
          getDetailInforms(detailInform.id);
          toast.current.show({
            severity: "success",
            summary: "성공",
            detail: "저장되었습니다.",
            life: 3000,
          });
        });
    } else {
      const length = Number(detailInform.commentlength);
      detailInform.comment.push({
        comment: text1,
        commentdate: reg_date,
        commentuserid: user.id,
        id: length,
      });
      await axios
        .patch("http://localhost:3001/informs/" + detailInform.id, {
          comment: detailInform.comment,
          commentlength: length + 1,
        })
        .then(() => {
          getDetailInforms(detailInform.id);
          toast.current.show({
            severity: "success",
            summary: "성공",
            detail: "저장되었습니다.",
            life: 3000,
          });
        });
    }
    onReset();
  };

  const onReset = () => {
    setVisible(false, "comment");
    setText1("");
  };

  return (
    <div className={`fancy-selector-w`}>
      <Toast ref={toast} />
      <Sidebar
        className="reg-sidebar"
        visible={visibleComment}
        fullScreen
        onHide={() => onReset()}
      >
        <Form className="form_react" onSubmit={onSubmit}>
          <h1 style={{ textAlign: "center" }}>댓글 등록</h1>
          <Form.Group as={Col} controlId="formInform">
            <Form.Label>댓글 내용</Form.Label>
            <Editor
              style={{ height: "200px" }}
              value={text1}
              onTextChange={(e) => setText1(e.htmlValue)}
            />
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="formDate"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Form.Label>등록일</Form.Label>
            <Calendar
              id="icon"
              value={regDate}
              onChange={(e) => setRegDate(e.value)}
              showIcon
              appendTo="self"
              inputClassName="calendar-input"
              panelClassName="calendar-panel"
            />
          </Form.Group>
          <Row>
            <Form.Group
              as={Col}
              controlId="Button"
              style={{ textAlign: "center" }}
            >
              <Button
                label="취소"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => onReset()}
                type="reset"
              ></Button>
              <Button
                label="저장"
                icon="pi pi-save"
                className="p-button-text"
                type="submit"
              ></Button>
            </Form.Group>
          </Row>
        </Form>
      </Sidebar>
    </div>
  );
};

export default CommentButton;
