import React, { useContext, useState } from "react";
import { CSVLink } from "react-csv";
import { GetContext } from "@/contexts/get";

const ExportButton = () => {
  const { files } = useContext(GetContext);
  const [csv, setCSV] = useState([]);

  const headers = Object.keys(files[0].data).map((col) => {
    return { label: col, key: col };
  });

  const mapping = (props) => {
    props.map((col) => {
      setCSV((oldCSV) => [...oldCSV, col.data]);
      if (col.children) {
        mapping(col.children);
      }
    });
  };

  const setData = () => {
    setCSV([]);
    mapping(files);
  };

  return (
    <CSVLink data={csv} headers={headers}>
      <i
        className="pi pi-download"
        style={{ fontSize: "30px" }}
        onClick={() => setData()}
      ></i>
    </CSVLink>
  );
};
export default ExportButton;
