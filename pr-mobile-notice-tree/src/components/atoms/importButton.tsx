import React, { useContext, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import axios from "axios";
import { GetContext } from "@/contexts/get";
const ImportButton = () => {
  const { getTotal, totalNumber } = useContext(GetContext);
  const length = String(totalNumber).length;

  useEffect(() => {
    getTotal();
  }, []);

  const importExcel = (e) => {
    const file = e.files[0];

    import("xlsx").then((xlsx) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const wb = xlsx.read(e.target.result, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
        let tempData = { key: "", data: {}, children: [] };
        let importedData = { key: "", data: {}, children: [] };
        const cols = data[0];
        data.shift();
        const total = String(totalNumber);
        let _importedData = data.map((d) => {
          return cols.reduce((obj, c, i) => {
            if (c === "WBS") {
              if (d[i] === "0") {
                obj["key"] = total;
              } else {
                let temp = total;
                for (let j = 0; j < d[i].length; j++) {
                  if (j % 2 === 0) {
                    const wbs = Number(d[i].substring(j, j + 1)) - 1;
                    temp = temp.concat("-", String(wbs));
                  }
                }
                obj["key"] = temp;
              }
            }
            obj[c] = d[i];
            return obj;
          }, {});
        });

        const temp = (e) => {
          tempData.key = e.key;
          for (const prop in e) {
            if (prop !== "key") {
              tempData.data[prop] = e[prop];
            }
          }
        };
        console.log("treeData", _importedData);
        await Promise.all(
          _importedData.map((e) => {
            if (e.key.length === length) {
              importedData.key = e.key;

              for (const prop in e) {
                if (prop !== "key") {
                  if (e[prop] === undefined) {
                    importedData.data[prop] = "";
                  } else {
                    importedData.data[prop] = e[prop];
                  }
                }
              }
            } else if (e.key.length === 2 + length) {
              temp(e);
              importedData.children.push({
                key: tempData.key,
                data: tempData.data,
                children: [],
              });
              tempData = { key: "", data: {}, children: [] };
            } else if (e.key.length === 4 + length) {
              const number = Number(e.key.substring(1 + length, 2 + length));
              temp(e);
              importedData.children[number].children.push({
                key: tempData.key,
                data: tempData.data,
                children: [],
              });
              tempData = { key: "", data: {}, children: [] };
            } else if (e.key.length === 6 + length) {
              const number = Number(e.key.substring(1 + length, 2 + length));
              const number2 = Number(e.key.substring(3 + length, 4 + length));
              temp(e);
              importedData.children[number].children[number2].children.push({
                key: tempData.key,
                data: tempData.data,
                children: [],
              });
              tempData = { key: "", data: {}, children: [] };
            }
          })
        );

        const postGet = async () => {
          await axios
            .post("http://localhost:3001/files", importedData)
            .then(() => {
              axios.patch("http://localhost:3001/fileNumber/1", {
                number: totalNumber + 1,
              });
            });
          getTotal();
        };
        postGet();
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className={`fancy-selector-w`}>
      <FileUpload
        chooseOptions={{
          label: "Excel",
          icon: "pi pi-file-excel",
          className: "p-button-success",
        }}
        name="demo[]"
        mode="basic"
        auto
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        className="mr-2"
        onSelect={importExcel}
      />
    </div>
  );
};
export default ImportButton;
