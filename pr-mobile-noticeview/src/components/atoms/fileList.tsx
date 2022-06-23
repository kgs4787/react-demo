import React, { useContext } from "react";
import { SplitButton } from "primereact/splitbutton";
import { PrimeIcons } from "primereact/api";
import JSZip from "jszip";
import { GetContext } from "@/contexts/get";
import { Button } from "primereact/button";
const FileList = () => {
  var FileSaver = require("file-saver");
  const { detailInform } = useContext(GetContext);

  const items = [];
  var zip = new JSZip();

  if (detailInform.filename !== undefined) {
    if (Array.isArray(detailInform.filename)) {
      for (let i = 0; i < detailInform.file.length; i++) {
        var uri = detailInform.file[i];
        var idx = uri.indexOf("base64,") + "base64,".length;
        var content = uri.substring(idx);

        zip.file(detailInform.filename[i], content, { base64: true });
        items.push({
          label: detailInform.filename[i],
          icon: PrimeIcons.DOWNLOAD,
          command: () => {
            FileSaver.saveAs(detailInform.file[i], detailInform.filename[i]);
          },
        });
      }
    }
  }

  return (
    <div className="postview-file">
      {detailInform.filename === undefined ? null : Array.isArray(
          detailInform.filename
        ) ? (
        <SplitButton
          label="첨부 파일"
          model={items}
          onClick={() => {
            zip.generateAsync({ type: "blob" }).then((resZip) => {
              FileSaver.saveAs(resZip, "첨부파일.zip");
            });
          }}
          className="mr-2 mb-2"
        ></SplitButton>
      ) : (
        <Button
          className="postview-file"
          onClick={() => {
            FileSaver.saveAs(detailInform.file, detailInform.filename);
          }}
        >
          {detailInform.filename}
        </Button>
      )}
    </div>
  );
};

export default FileList;
