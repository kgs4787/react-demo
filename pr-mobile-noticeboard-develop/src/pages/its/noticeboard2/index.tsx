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
import { Dropdown } from "primereact/dropdown";

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
  const [productDialog, setProductDialog] = useState<any>(false);
  const [product, setProduct] = useState<any>(emptyProduct);
  const [submitted, setSubmitted] = useState<any>(false);
  const [text1, setText1] = useState<any>("");
  const [regs, setRegs] = useState<any>([]);
  const [regDate, setRegDate] = useState<any>(new Date());
  const [startDate, setStartDate] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
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
  const categories = [
    { name: "전체 유형", code: "all" },
    { name: "중요공지", code: "important" },
    { name: "일반공지", code: "normal" },
  ];
  const onCategorySelect = (e: { value: any }) => {
    setSelectedCategory(e.value);
  };

  const states = [
    { name: "전체 상태", code: "all" },
    { name: "진행 중", code: "progress" },
    { name: "기간 지남", code: "not_period" },
  ];
  const onStateSelect = (e: { value: any }) => {
    setSelectedState(e.value);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setText1("");
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
          summary: "성공",
          detail: "저장되었습니다.",
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
        label="취소"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="삭제"
        icon="pi pi-ban"
        className="p-button-text"
        onClick={deleteProduct}
      />
      <Button
        label="저장"
        icon="pi pi-save"
        className="p-button-text"
        onClick={saveProduct}
      />
    </div>
  );

  const confirmDialogFooter = (
    <div>
      <Button
        label="아니오"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideConfirmDialog}
      />
      <Button
        label="예"
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

  useEffect(() => {
    if (selectedCategory != null) {
      getConditionInforms();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedState != null) {
      getConditionInforms();
    }
  }, [selectedState]);

  const getInforms = () => {
    return axios.get("http://localhost:3001/informs").then((res) => {
      setInform(res.data);
    });
  };
  const getConditionInforms = () => {
    return selectedCategory === null
      ? selectedState.name === "전체 상태"
        ? axios.get("http://localhost:3001/informs").then((res) => {
            setInform(res.data);
          })
        : selectedState.name === "기간 지남"
        ? axios
            .get("http://localhost:3001/informs?endDate_lte=" + format_Today)
            .then((res) => {
              setInform(res.data);
            })
        : axios
            .get("http://localhost:3001/informs?endDate_gte=" + format_Today)
            .then((res) => {
              setInform(res.data);
            })
      : selectedState === null
      ? selectedCategory.name === "전체 유형"
        ? axios.get("http://localhost:3001/informs").then((res) => {
            setInform(res.data);
          })
        : axios
            .get(
              "http://localhost:3001/informs?category=" + selectedCategory.name
            )
            .then((res) => {
              setInform(res.data);
            })
      : selectedCategory.name === "전체 유형"
      ? selectedState.name === "전체 상태"
        ? axios.get("http://localhost:3001/informs").then((res) => {
            setInform(res.data);
          })
        : selectedState.name === "기간 지남"
        ? axios
            .get("http://localhost:3001/informs?endDate_lte=" + format_Today)
            .then((res) => {
              setInform(res.data);
            })
        : axios
            .get("http://localhost:3001/informs?endDate_gte=" + format_Today)
            .then((res) => {
              setInform(res.data);
            })
      : selectedState.name === "전체 상태"
      ? axios
          .get(
            "http://localhost:3001/informs?category=" + selectedCategory.name
          )
          .then((res) => {
            setInform(res.data);
          })
      : selectedState.name === "기간 지남"
      ? axios
          .get(
            "http://localhost:3001/informs?category=" +
              selectedCategory.name +
              "&endDate_lte=" +
              format_Today
          )
          .then((res) => {
            setInform(res.data);
          })
      : axios
          .get(
            "http://localhost:3001/informs?category=" +
              selectedCategory.name +
              "&endDate_gte=" +
              format_Today
          )
          .then((res) => {
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
          + 등록
        </Button>
      </div>
    );
  };
  const leftToolbarTemplate = () => {
    return (
      <div>
        <Dropdown
          value={selectedCategory}
          options={categories}
          onChange={(e) => {
            onCategorySelect(e);
          }}
          optionLabel="name"
          placeholder="전체 유형"
        />
        <Dropdown
          value={selectedState}
          options={states}
          onChange={onStateSelect}
          optionLabel="name"
          placeholder="전체 상태"
        />
      </div>
    );
  };
  const bodyTemplate = (rowData: any) => {
    const format_lastWeek = moment(lastWeek).format("YYYY-MM-DD");
    return (
      <div
        className="col-12"
        onClick={() => {
          editProduct(rowData);
        }}
      >
        <div className="product-list-item">
          <div className="product-list-category">
            {rowData.date >= format_lastWeek ? (
              <div>
                <GrNew className="new_icon" /> {rowData.category}
              </div>
            ) : (
              rowData.category
            )}
          </div>
          <div className="product-list-content">
            <div className="product-name">{rowData.title}</div>
            <div className="product-list-detail">
              <span className="product-regDate">{rowData.date}</span>
              <span className="product-duration">{rowData.duration}</span>
              <div>
                {rowData.endDate <= format_Today ? "기간 지남" : "진행 중"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <ITSLayout title="Test">
      <h3>공지 사항 </h3>
      <div className="datatable-crud-demo">
        <Toast ref={toast} />
        <div className="card">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <DataTable
            ref={dt}
            value={inform}
            dataKey="id"
            sortOrder={1}
            sortMode="multiple"
            removableSort
            multiSortMeta={multiSortMeta}
            onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
            scrollable
            scrollHeight="645px"
            virtualScrollerOptions={{ itemSize: 40 }}
          >
            <Column body={bodyTemplate}></Column>
          </DataTable>
        </div>
        <Dialog
          visible={productDialog}
          style={{ width: "450px" }}
          header="공지 사항"
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
          maximized={true}
        >
          <div className="field">
            <label htmlFor="title">공지 제목</label>
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
            <label htmlFor="inform">내용</label>
            <Editor
              style={{ height: "320px" }}
              value={product.inform}
              onTextChange={(e) => setText1(e.htmlValue)}
            />
          </div>
          <div className="field">
            <label className="mb-3">유형</label>
            <div className="formgrid grid">
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="category1"
                  name="category"
                  value="중요공지"
                  onChange={onCategoryChange}
                  checked={product.category === "중요공지"}
                />
                <label htmlFor="category1">중요공지</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton
                  inputId="category2"
                  name="category"
                  value="일반공지"
                  onChange={onCategoryChange}
                  checked={product.category === "일반공지"}
                />
                <label htmlFor="category2">일반공지</label>
              </div>
            </div>
          </div>
          <div className="field">
            <label htmlFor="date">등록일</label>
            <Calendar
              id="icon"
              placeholder={product.date}
              onChange={(e) => setRegDate(e.value)}
              showIcon
              appendTo="self"
            />
          </div>
          <div className="field">
            <label htmlFor="startDate">시작일</label>
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
            <label htmlFor="endDate">종료일</label>
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
          header="저장"
          modal
          footer={confirmDialogFooter}
          onHide={hideConfirmDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && <span>저장하시겠습니까?</span>}
          </div>
        </Dialog>
        <Sidebar
          visible={informModalIsOpen}
          fullScreen
          onHide={() => setInformModalIsOpen(false)}
        >
          <Form className="form_react" onSubmit={onSubmit} onChange={onChange}>
            <h1 style={{ textAlign: "center" }}>공지 등록</h1>
            <Form.Group
              as={Col}
              controlId="formInformTitle"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Form.Label>공지 제목</Form.Label>
              <Form.Control name="title" type="text" placeholder="  " />
            </Form.Group>
            <Form.Group as={Col} controlId="formInform">
              <Form.Label>내용</Form.Label>
              <Editor
                style={{ height: "320px" }}
                value={text1}
                onTextChange={(e) => setText1(e.htmlValue)}
              />
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="category"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Form.Label>유형</Form.Label>
              <Form.Control
                name="category"
                as="select"
                style={{ width: "100px" }}
              >
                <option selected>선택...</option>
                <option value="중요공지">중요공지</option>
                <option value="일반공지">일반공지</option>
              </Form.Control>
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
              />
            </Form.Group>
            <Row>
              <Form.Group
                as={Col}
                controlId="formStartDate"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Form.Label>시작일</Form.Label>
                <Calendar
                  name="stratDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.value)}
                  maxDate={endDate}
                  showIcon
                  appendTo="self"
                />
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="formEndDate"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Form.Label>종료일</Form.Label>
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
                  label="취소"
                  icon="pi pi-times"
                  className="p-button-text"
                  onClick={() => {
                    setInformModalIsOpen(false);
                    setText1("");
                  }}
                  type="reset"
                ></Button>
                <Button
                  label="저장"
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
