import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import axios from "axios";

const VirtualView = () => {
  const toast = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [files, setFiles] = useState<any>([{ data: {} }]);
  const loader = useRef(null);
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);

  useEffect(() => {
    const getTree = async () => {
      setLoading(true);
      await axios
        .get("http://localhost:3001/files?_limit=" + page * 15)
        .then((res) => {
          setFiles(res.data);
        });
      setLoading(false);
    };
    getTree();
  }, [page]);

  const handleObserver = (targetList) => {
    const target = targetList[0];
    if (target.isIntersecting) {
      setPage((page) => page + 1);
    }
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
          key={index}
          field={col}
          header={col}
          headerClassName="sm-invisible"
          bodyClassName="sm-invisible"
        />
      );
    }
  });

  const onExpand = (event) => {
    console.log(event);
  };

  const rowClassName = (node) => {
    return { "p-highlight": node.children && node.children.length === 35 };
  };

  return (
    <div className="dataview-demo">
      <Toast ref={toast} />
      <div className="card">
        <TreeTable
          value={files}
          lazy
          loading={loading}
          onExpand={onExpand}
          rowClassName={rowClassName}
        >
          <Column
            field="작업명"
            header="작업명"
            className="tree-작업명"
            expander
          />
          {_columns}
        </TreeTable>
        <div ref={loader}>Load more...</div>
      </div>
    </div>
  );
};

export default VirtualView;
