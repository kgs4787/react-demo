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
import { FileUpload } from "primereact/fileupload";
import { GetContext } from "@/contexts/get";

const RegModal = () => {
  const [text1, setText1] = useState<any>("");
  const [regs, setRegs] = useState<any>([]);
  const [file, setFile] = useState([{ fileName: null, fileurl: null }]);
  const [regDate, setRegDate] = useState<any>(new Date());
  const toast = useRef<any>(null);
  const reg_date = moment(regDate).format("YYYY-MM-DD");
  const { getInforms, user, setVisible, visibleReg } = useContext(GetContext);

  const onChange = (e: any) => {
    setRegs({
      ...regs,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const params = new URLSearchParams();

    for (let i = 1; i < file.length; i++) {
      params.append("file", file[i].fileurl);
    }
    for (let i = 1; i < file.length; i++) {
      params.append("filename", file[i].fileName);
    }

    params.append("title", regs.title);
    params.append("inform", text1);
    params.append("userID", user.id);
    params.append("date", reg_date);
    params.append("commentlength", "0");
    params.append("heartcount", "0");
    params.append("view", "0");

    await axios.post(`http://localhost:3001/informs`, params).then(() => {
      getInforms();
      toast.current.show({
        severity: "success",
        summary: "성공",
        detail: "저장되었습니다.",
        life: 3000,
      });
    });

    onReset();
  };

  const onSelect = ({ files }) => {
    const temp = [...file];
    for (let i = 0; i < files.length; i++) {
      const file1 = files[i];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        temp.push({ fileName: file1.name, fileurl: e.target.result });
      };
      fileReader.readAsDataURL(file1);
    }
    setFile(temp);
  };

  const onRemove = (event) => {
    setFile(file.filter((remove) => remove.fileName !== event.file.name));
  };

  const onReset = () => {
    setVisible(false, "Reg");
    setText1("");
    setFile([{ fileName: null, fileurl: null }]);
  };

  return (
    <div className={`fancy-selector-w`}>
      <Toast ref={toast} />
      <Sidebar
        className="reg-sidebar"
        visible={visibleReg}
        fullScreen
        onHide={() => onReset()}
      >
        <Form className="form_react" onSubmit={onSubmit} onChange={onChange}>
          <h1 style={{ textAlign: "center" }}>공지 등록</h1>
          <Form.Group
            as={Col}
            controlId="formInformTitle"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Form.Label>공지 제목</Form.Label>
            <Form.Control
              name="title"
              type="text"
              placeholder="  "
              maxLength={20}
              required
              className="title-input"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formInform">
            <Form.Label>내용</Form.Label>
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
          <div className="upload-section">
            <FileUpload
              maxFileSize={35000}
              multiple
              emptyTemplate={
                <p className="m-0" style={{ height: "100px" }}>
                  Drag and drop files to here to upload.
                </p>
              }
              headerClassName="fileupload-header"
              onSelect={onSelect}
              onRemove={onRemove}
              contentClassName="fileupload-content"
            />
          </div>
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

export default RegModal;
