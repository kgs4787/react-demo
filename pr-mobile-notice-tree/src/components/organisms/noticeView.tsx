import React, { useEffect, useRef, useContext, useState } from "react";
import { Toast } from "primereact/toast";
import { GetContext } from "@/contexts/get";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import axios from "axios";
const NoticeView = () => {
  const { totalNumber, getTotal, setFile, files } = useContext(GetContext);
  const toast = useRef<any>(null);
  const [contentFirst, setContentFirst] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTree = async () => {
      setLoading(true);
      await axios
        .get("http://localhost:3001/files?key=" + contentFirst)
        .then((res) => {
          console.log("res", res.data);
          setFile(res.data);
        });
      setLoading(false);
    };
    getTree();
  }, [contentFirst]);

  const onContentPageChange = (event) => {
    setContentFirst(event.first);
    getTotal();
  };

  const _columns = Object.keys(files[0].data).map((col, index) => {
    if (col === "작업명") {
      return null;
    } else if (col === "계획시작일" || col === "계획종료일") {
      return (
        <Column field={col} header={col} key={index} className="tree-date" />
      );
    } else {
      return (
        <Column
          field={col}
          header={col}
          key={index}
          headerClassName="sm-invisible"
          bodyClassName="sm-invisible"
        />
      );
    }
  });

  return (
    <div className="dataview-demo">
      <Toast ref={toast} />
      <div className="card">
        <TreeTable
          value={files}
          scrollable
          lazy
          scrollHeight="900px"
          first={contentFirst}
          loading={loading}
        >
          <Column
            field="작업명"
            header="작업명"
            className="tree-작업명"
            expander
          />
          {_columns}
        </TreeTable>

        <Paginator
          first={contentFirst}
          rows={1}
          totalRecords={totalNumber}
          onPageChange={onContentPageChange}
          template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        ></Paginator>
      </div>
    </div>
  );
};

export default NoticeView;
