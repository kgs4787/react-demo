import React, { useState, useEffect, useRef } from "react";
import ITSLayout from "@/components/ITSLayout";
import Link from "next/link";
import axios from "axios";
import SplitPane from "react-split-pane";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "react-datepicker/dist/react-datepicker.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/nova/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

const ItsTestPage = () => {
  let emptyProduct = {
    id: null,
    issue: "",
    priority: "",
    content: "",
    importance: "",
  };

  const [toDos, setToDos] = useState<any>([]);
  const [globalFilter, setGlobalFilter] = useState<any>(null);
  const [productDialog, setProductDialog] = useState<any>(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState<any>(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState<any>(false);
  const [product, setProduct] = useState<any>(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState<any>(null);
  const [submitted, setSubmitted] = useState<any>(false);
  const [expandedRows, setExpandedRows] = useState<any>([]);

  const toast = useRef<any>(null);
  const dt = useRef<any>(null);

  const headerTemplate = (data: any) => {
    return (
      <div>
        <span className="image-text">{data.issuetypes.issuetype}</span>
      </div>
    );
  };

  const importCSV = (e: any) => {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const data = csv.split("\n");

      const cols = data[0].replace(/['"]+/g, "").split(",");
      data.shift();

      const importedData = data.map((d: any) => {
        d = d.split(",");
        const processedData = cols.reduce((obj: any, c: any, i: any) => {
          c =
            c === "Status"
              ? "inventoryStatus"
              : c === "Reviews"
              ? "rating"
              : c.toLowerCase();
          obj[c] = d[i].replace(/['"]+/g, "");
          (c === "price" || c === "rating") && (obj[c] = parseFloat(obj[c]));
          return obj;
        }, {});

        processedData["id"] = createId();
        return processedData;
      });

      const _products = [...toDos, ...importedData];

      setToDos(_products);
    };

    reader.readAsText(file, "UTF-8");
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const priorities = [
    { name: "긴급", value: "긴급" },
    { name: "높음", value: "높음" },
    { name: "보통", value: "보통" },
    { name: "낮음", value: "낮음" },
  ];

  const important = [
    { name: "심각", value: "심각" },
    { name: "높음", value: "높음" },
    { name: "보통", value: "보통" },
    { name: "낮음", value: "낮음" },
  ];

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">검색</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";

    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const rowClass = (data: any) => {
    return {
      "row-accessories": data.priority === "긴급",
      "row-accessories1": data.importance === "심각",
    };
  };

  const importanceTemplate = (rowData: any) => {
    const stockClassName = classNames({
      higheststock: rowData.importance === "심각",
      highstock: rowData.importance === "높음",
      normalstock: rowData.importance === "보통",
      lowstock: rowData.importance === "낮음",
    });

    return <div className={stockClassName}>{rowData.importance}</div>;
  };

  const priorityTemplate = (rowData: any) => {
    const stockClassName = classNames({
      higheststock: rowData.priority === "긴급",
      highstock: rowData.priority === "높음",
      normalstock: rowData.priority === "보통",
      lowstock: rowData.priority === "낮음",
    });

    return <div className={stockClassName}>{rowData.priority}</div>;
  };
  const onRowClick = (rowData: any) => {
    return editProduct(rowData);
  };
  const actionBodyTemplate = (rowData: any) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </div>
    );
  };
  const saveProduct = () => {
    setSubmitted(true);

    if (product.issue.trim()) {
      let _products = [...toDos];
      let _product = { ...product };

      console.log(product.id);
      const index = findIndexById(product.id);

      _products[index] = _product;
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Product Updated",
        life: 3000,
      });

      axios.patch("http://localhost:3001/issues/" + product.id, {
        issue: product.issue,
        content: product.content,
        priority: product.priority,
        importance: product.importance,
      });

      setToDos(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product: any) => {
    setProductDialog(true);
    setProduct({ ...product });
    console.log(product);
  };

  const confirmDeleteProduct = (product: any) => {
    console.log(product);
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const hideDeleteProductDialog = () => {
    console.log(product.id);
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const deleteProduct = () => {
    let _products = toDos.filter((val: any) => val.id !== product.id);
    axios.delete("http://localhost:3001/issues/" + product.id);
    console.log(_products);
    setToDos(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const deleteSelectedProducts = () => {
    let _products = toDos.filter((val: any) => !selectedProducts.includes(val));
    selectedProducts.map((id: any) =>
      axios.delete("http://localhost:3001/issues/" + id.id)
    );
    setToDos(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id: any) => {
    let index = -1;
    for (let i = 0; i < toDos.length; i++) {
      if (toDos[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const productDialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveProduct}
      />
    </div>
  );

  const deleteProductDialogFooter = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </div>
  );
  const deleteProductsDialogFooter = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
      />
    </div>
  );

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    return axios.get("http://localhost:3001/issues").then((res) => {
      setToDos(res.data);
    });
  };

  const leftToolbarTemplate = () => {
    return (
      <Button
        label="Delete"
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={confirmDeleteSelected}
        disabled={!selectedProducts || !selectedProducts.length}
      />
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div>
        <FileUpload
          mode="basic"
          name="demo[]"
          auto
          url="https://primefaces.org/primereact/showcase/upload.php"
          accept=".csv"
          chooseLabel="Import"
          className="mr-2 inline-block"
          onUpload={importCSV}
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </div>
    );
  };

  return (
    <ITSLayout title="Test">
      <h3>이슈정보</h3>
      <div className="title_main">
        <p className="path">
          <Link href={`/its/home`}>
            <a>Home</a>
          </Link>
          &gt;
          <Link href="/its">
            <a>TEST </a>
          </Link>
          &gt;
          <span className="current-menu">Test</span>
        </p>
      </div>

      <div className="datatable-crud-demo">
        <Toast ref={toast} />
        <div className="card">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <SplitPane split="vertical">
            <DataTable
              ref={dt}
              value={toDos}
              rowClassName={rowClass}
              filterDisplay="row"
              responsiveLayout="scroll"
              selection={selectedProducts}
              onSelectionChange={(e) => setSelectedProducts(e.value)}
              dataKey="id"
              globalFilter={globalFilter}
              header={header}
              resizableColumns
              columnResizeMode="fit"
              showGridlines
              rowGroupMode="subheader"
              groupRowsBy="issuetypes.issuetype"
              sortMode="single"
              sortField="issuetypes.issuetype"
              sortOrder={1}
              expandableRowGroups
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowGroupHeaderTemplate={headerTemplate}
              scrollable
              scrollHeight="700px"
              virtualScrollerOptions={{ itemSize: 46 }}
              onRowClick={(rowData) => onRowClick(rowData)}
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "30px" }}
                style={{ width: "5%" }}
                exportable={false}
              ></Column>
              <Column
                field="issue"
                header="이슈 제목"
                sortable
                filter
                filterPlaceholder="Search by name"
              ></Column>
              <Column
                field="priority"
                header="우선 순위"
                body={priorityTemplate}
                sortable
                filter
                filterPlaceholder="Search by name"
              ></Column>
              <Column
                field="importance"
                header="중요도"
                body={importanceTemplate}
                sortable
                filter
                filterPlaceholder="Search by name"
              ></Column>
              <Column
                field="duration"
                header="조치 기한"
                sortable
                filter
                filterPlaceholder="Search by name"
              ></Column>
              <Column
                field="date"
                header="등록일자"
                sortable
                filter
                filterPlaceholder="Search by name"
              ></Column>
              <Column body={actionBodyTemplate} exportable={false}></Column>
            </DataTable>

            <Form>
              <Form.Group as={Col}>
                <Form.Label>이슈 제목</Form.Label>
                <Form.Control value={product.issue} type="text" id="index" />
              </Form.Group>
              <Row>
                <Form.Group as={Col} controlId="formProject">
                  <Form.Label>프로젝트</Form.Label>
                  <Form.Control
                    name="project"
                    as="select"
                    defaultValue="22년-통합품질관리(PiMS)-운영"
                  >
                    <option value="22년-피엠에스플러스">
                      22년-피엠에스플러스
                    </option>
                    <option value="22년-통합품질관리(PiMS)-운영">
                      22년-통합품질관리(PiMS)-운영
                    </option>
                    <option value="22년-통합품질관리(PiMS)-개발">
                      22년-통합품질관리(PiMS)-개발
                    </option>
                    <option value="22년-통합품질관리(PiMS)-차세대">
                      22년-통합품질관리(PiMS)-차세대
                    </option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formService">
                  <Form.Label>연계 서비스</Form.Label>
                  <Form.Control
                    name="service"
                    as="select"
                    defaultValue="연계안함"
                  >
                    <option value="연계안함">연계안함</option>
                    <option value="PMS">PMS</option>
                    <option value="TMS">TMS</option>
                    <option value="AGILE">AGILE</option>
                  </Form.Control>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} controlId="formIssueType">
                  <Form.Label>이슈 타입</Form.Label>
                  <Form.Control name="issuetype" as="select">
                    <option selected>선택...</option>
                    <option value="버그">버그</option>
                    <option value="개선">개선</option>
                    <option value="요구사항">요구사항</option>
                    <option value="테스트">테스트</option>
                    <option value="일감">일감</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formDevOps">
                  <Form.Label>DevOps</Form.Label>
                  <Form.Control
                    name="devops"
                    as="select"
                    defaultValue="사용안함"
                  >
                    <option value="사용안함">사용안함</option>
                    <option value="사용">사용</option>
                  </Form.Control>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} controlId="formPriority">
                  <Form.Label>우선 순위</Form.Label>
                  <Form.Control value={product.priority} as="select">
                    <option selected>선택...</option>
                    <option value="긴급">긴급</option>
                    <option value="높음">높음</option>
                    <option value="보통">보통</option>
                    <option value="낮음">낮음</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formImportance">
                  <Form.Label>중요도</Form.Label>
                  <Form.Control value={product.importance} as="select">
                    <option selected>선택...</option>
                    <option value="심각">심각</option>
                    <option value="높음">높음</option>
                    <option value="보통">보통</option>
                    <option value="낮음">낮음</option>
                  </Form.Control>
                </Form.Group>
              </Row>
              <Form.Group as={Col} controlId="formIssueContent">
                <Form.Label>내용</Form.Label>
                <Form.Control
                  value={product.content}
                  type="text"
                  placeholder="  "
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formManager">
                <Form.Label>담당자</Form.Label>
                <Form.Control name="manager" as="select" defaultValue="보통">
                  <option value="심각">심각</option>
                  <option value="높음">높음</option>
                  <option value="보통">보통</option>
                  <option value="낮음">낮음</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </SplitPane>
        </div>

        <Dialog
          visible={productDialog}
          style={{ width: "450px" }}
          header="Issue Details"
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="issue">이슈 제목</label>
            <InputText
              id="issue"
              value={product.issue}
              onChange={(e) => onInputChange(e, "issue")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !product.issue,
              })}
            />
            {submitted && !product.issue && (
              <small className="p-error">Name is required.</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="content">내용</label>
            <InputTextarea
              id="content"
              value={product.content}
              onChange={(e) => onInputChange(e, "content")}
              required
              rows={3}
              cols={20}
            />
          </div>
          <div className="field">
            <label htmlFor="priority">우선 순위</label>
            <Dropdown
              value={product.priority}
              options={priorities}
              onChange={(e) => onInputChange(e, "priority")}
              optionLabel="name"
            />
          </div>
          <div className="field">
            <label htmlFor="importance">중요도</label>
            <Dropdown
              value={product.importance}
              options={important}
              onChange={(e) => onInputChange(e, "importance")}
              optionLabel="name"
            />
          </div>
        </Dialog>
        <Dialog
          visible={deleteProductDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteProductDialogFooter}
          onHide={hideDeleteProductDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && (
              <span>
                Are you sure you want to delete <b>{product.issue}</b>?
              </span>
            )}
          </div>
        </Dialog>
        <Dialog
          visible={deleteProductsDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteProductsDialogFooter}
          onHide={hideDeleteProductsDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && (
              <span>
                Are you sure you want to delete the selected products?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </ITSLayout>
  );
};
export default ItsTestPage;
