import React, { useState, useEffect, useRef } from "react";
import ITSLayout from "@/components/ITSLayout";
import axios from "axios";
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
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { RadioButton } from "primereact/radiobutton";
import { Editor } from "primereact/editor";
import moment from "moment";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Row } from "react-bootstrap";
import { Calendar } from "primereact/calendar";
import { GrNew } from "react-icons/gr";
import { Sidebar } from "primereact/sidebar";

const ItsInformPage = () => {
  let emptyProduct = {
    id: null,
    title: "",
    inform: "",
    category: "",
    date: null,
    startDate: null,
    endDate: null,
  };
  let today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const [inform, setInform] = useState<any>([]);
  const [informModalIsOpen, setInformModalIsOpen] = useState<any>(false);
  const [globalFilter, setGlobalFilter] = useState<any>(null);
  const [productDialog, setProductDialog] = useState<any>(false);
  const [product, setProduct] = useState<any>(emptyProduct);
  const [submitted, setSubmitted] = useState<any>(false);
  const [text1, setText1] = useState<any>("");
  const [regs, setRegs] = useState<any>([]);
  const [regDate, setRegDate] = useState<any>(new Date());
  const [startDate, setStartDate] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(new Date());

  const [confirmDialogIsOpen, setConfirmDialogIsOpen] = useState<any>(false);
  const [multiSortMeta, setMultiSortMeta] = useState<any>([
    { field: "date", order: -1 },
    { field: "category", order: -1 },
  ]);
  const toast = useRef<any>(null);
  const dt = useRef<any>(null);

  const start_date = moment(startDate).format("YYYY-MM-DD");
  const end_date = moment(endDate).format("YYYY-MM-DD");
  const format_Today = moment(today).format("YYYY-MM-DD");
  const reg_date = moment(regDate).format("YYYY-MM-DD");

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">??????</h5>
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

  const createInforms = () => {
    return axios
      .post("http://localhost:3001/informs", {
        title: regs.title,
        inform: text1,
        date: reg_date,
        category: regs.category,
        startDate: start_date,
        endDate: end_date,
        duration: start_date + "~" + end_date,
      })
      .then(() => {
        axios.get("http://localhost:3001/informs").then((res) => {
          setInform(res.data);
        });
        toast.current.show({
          severity: "success",
          summary: "??????",
          detail: "?????????????????????.",
          life: 3000,
        });
      });
  };

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";

    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };
  const onChange = (e: any) => {
    setRegs({
      ...regs,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.title.trim()) {
      let _products = [...inform];
      let _product = { ...product };

      const index = findIndexById(product.id);

      _products[index] = _product;
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Product Updated",
        life: 3000,
      });

      axios
        .patch("http://localhost:3001/informs/" + product.id, {
          title: product.title,
          inform: text1,
          category: product.category,
          date: reg_date,
          startDate: start_date,
          endDate: end_date,
          duration: start_date + "~" + end_date,
        })
        .then(() => {
          axios.get("http://localhost:3001/informs").then((res) => {
            setInform(res.data);
          });
        });

      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (prod: any) => {
    setProductDialog(true);
    setProduct({ ...prod });
    console.log(product);
  };

  const hideConfirmDialog = () => {
    setConfirmDialogIsOpen(false);
  };

  const onCategoryChange = (e: any) => {
    let _product = { ...product };
    _product["category"] = e.value;
    setProduct(_product);
  };

  const deleteProduct = () => {
    let _products = inform.filter((val: any) => val.id !== product.id);
    axios.delete("http://localhost:3001/informs/" + product.id);
    setInform(_products);
    setProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id: any) => {
    let index = -1;
    for (let i = 0; i < inform.length; i++) {
      if (inform[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const productDialogFooter = (
    <div>
      <Button
        label="??????"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="??????"
        icon="pi pi-ban
        "
        className="p-button-text"
        onClick={deleteProduct}
      />
      <Button
        label="??????"
        icon="pi pi-save"
        className="p-button-text"
        onClick={saveProduct}
      />
    </div>
  );

  const confirmDialogFooter = (
    <div>
      <Button
        label="?????????"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideConfirmDialog}
      />
      <Button
        label="???"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => {
          createInforms();
          setInformModalIsOpen(false);
          setConfirmDialogIsOpen(false);
          setText1("");
        }}
      />
    </div>
  );
  useEffect(() => {
    getInforms();
  }, []);

  const getInforms = () => {
    return axios.get("http://localhost:3001/informs").then((res) => {
      setInform(res.data);
    });
  };

  const rightToolbarTemplate = () => {
    return (
      <div>
        <Button
          className="regButton"
          onClick={() => setInformModalIsOpen(true)}
        >
          + ??????
        </Button>
      </div>
    );
  };
  const deadLineTemplate = (rowData: any) => {
    return (
      <div>{rowData.endDate <= format_Today ? "?????? ??????" : "?????? ???"}</div>
    );
  };
  const titleTemplate = (rowData: any) => {
    const format_lastWeek = moment(lastWeek).format("YYYY-MM-DD");
    return (
      <div
        onClick={() => {
          editProduct(rowData);
        }}
      >
        {rowData.date >= format_lastWeek ? (
          <div>
            <GrNew className="new_icon" /> {rowData.title}
          </div>
        ) : (
          rowData.title
        )}
      </div>
    );
  };
  return (
    <ITSLayout title="Test">
      <h3>?????? ?????? </h3>
      <div className="datatable-crud-demo">
        <Toast ref={toast} />
        <div className="card">
          <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
          <DataTable
            ref={dt}
            value={inform}
            filterDisplay="row"
            responsiveLayout="scroll"
            dataKey="id"
            globalFilter={globalFilter}
            header={header}
            columnResizeMode="fit"
            sortOrder={1}
            sortMode="multiple"
            removableSort
            multiSortMeta={multiSortMeta}
            onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
            scrollable
            scrollHeight="500px"
            virtualScrollerOptions={{ itemSize: 40 }}
          >
            <Column
              field="title"
              header="?????? ??????"
              sortable
              filter
              filterPlaceholder="Search by name"
              body={titleTemplate}
            ></Column>
            <Column header="????????????" body={deadLineTemplate}></Column>
            <Column
              field="date"
              header="????????????"
              sortable
              sortableDisabled
              style={{ width: "150px" }}
            ></Column>
          </DataTable>
        </div>
        <Dialog
          visible={productDialog}
          style={{ width: "450px" }}
          header="?????? ??????"
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
          maximized
        >
          <div className="field">
            <label htmlFor="title">?????? ??????</label>
            <InputText
              id="title"
              value={product.title}
              onChange={(e) => onInputChange(e, "title")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !product.title,
              })}
            />
            {submitted && !product.title && (
              <small className="p-error">Name is required.</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="inform">??????</label>
            <Editor
              style={{ height: "320px" }}
              value={product.inform}
              onTextChange={(e) => setText1(e.htmlValue)}
            />
          </div>
          <div className="field">
            <label className="mb-3">??????</label>
            <div className="formgrid grid">
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="category1"
                  name="category"
                  value="????????????"
                  onChange={onCategoryChange}
                  checked={product.category === "????????????"}
                />
                <label htmlFor="category1">????????????</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="category2"
                  name="category"
                  value="????????????"
                  onChange={onCategoryChange}
                  checked={product.category === "????????????"}
                />
                <label htmlFor="category2">????????????</label>
              </div>
            </div>
          </div>
          <div className="field">
            <label htmlFor="date">?????????</label>
            <Calendar
              id="icon"
              placeholder={product.date}
              onChange={(e) => setRegDate(e.value)}
              showIcon
              appendTo="self"
            />
          </div>
          <div className="field">
            <label htmlFor="startDate">?????????</label>
            <Calendar
              id="icon"
              placeholder={product.startDate}
              onChange={(e) => setStartDate(e.value)}
              showIcon
              maxDate={endDate}
              appendTo="self"
            />
          </div>
          <div className="field">
            <label htmlFor="endDate">?????????</label>
            <Calendar
              id="icon"
              placeholder={product.endDate}
              onChange={(e) => setEndDate(e.value)}
              showIcon
              minDate={startDate}
              appendTo="self"
            />
          </div>
        </Dialog>

        <Dialog
          visible={confirmDialogIsOpen}
          style={{ width: "450px" }}
          header="??????"
          modal
          footer={confirmDialogFooter}
          onHide={hideConfirmDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && <span>?????????????????????????</span>}
          </div>
        </Dialog>
        <Sidebar
          visible={informModalIsOpen}
          fullScreen
          onHide={() => setInformModalIsOpen(false)}
        >
          <Form onSubmit={onSubmit} onChange={onChange}>
            <h1 style={{ textAlign: "center" }}>?????? ??????</h1>
            <Form.Group as={Col} controlId="formInformTitle">
              <Form.Label>?????? ??????</Form.Label>
              <Form.Control name="title" type="text" placeholder="  " />
            </Form.Group>
            <Form.Group as={Col} controlId="formInform">
              <Form.Label>??????</Form.Label>
              <Editor
                style={{ height: "320px" }}
                value={text1}
                onTextChange={(e) => setText1(e.htmlValue)}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="category">
              <Form.Label>??????</Form.Label>
              <Form.Control name="category" as="select">
                <option selected>??????...</option>
                <option value="????????????">????????????</option>
                <option value="????????????">????????????</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="formDate">
              <Form.Label>?????????</Form.Label>
              <Calendar
                id="icon"
                value={regDate}
                onChange={(e) => setRegDate(e.value)}
                showIcon
                appendTo="self"
              />
            </Form.Group>
            <Row>
              <Form.Group as={Col} controlId="formStartDate">
                <Form.Label>?????????</Form.Label>
                <Calendar
                  name="stratDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.value)}
                  maxDate={endDate}
                  showIcon
                  appendTo="self"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formEndDate">
                <Form.Label>?????????</Form.Label>
                <Calendar
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.value)}
                  minDate={startDate}
                  showIcon
                  appendTo="self"
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                controlId="Button"
                style={{ textAlign: "center" }}
              >
                <Button
                  label="??????"
                  icon="pi pi-times"
                  className="p-button-text"
                  onClick={() => {
                    setInformModalIsOpen(false);
                    setText1("");
                  }}
                  type="reset"
                ></Button>
                <Button
                  label="??????"
                  icon="pi pi-save"
                  className="p-button-text"
                  onClick={() => {
                    setConfirmDialogIsOpen(true);
                  }}
                  type="reset"
                ></Button>
              </Form.Group>
            </Row>
          </Form>
        </Sidebar>
      </div>
    </ITSLayout>
  );
};
export default ItsInformPage;
