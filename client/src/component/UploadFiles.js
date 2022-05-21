import {Button, DatePicker, Form, Input,  Modal, Tooltip} from "antd";
import React  from "react";
import UploadOutlined from "@ant-design/icons/lib/icons/UploadOutlined";
import FileTextOutlined from "@ant-design/icons/lib/icons/FileTextOutlined";
import moment from "moment";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import {FormNewDoc} from "./FormNewDoc";

const tailLayout = {
  wrapperCol: {offset: 8, span: 16},
};

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};


export const UploadFiles = ({fileList, setFileList, fileListData,  setFileListData,  activeModalDataFile, setActiveModalDataFile, role }) => {


  const onChangeUploadFile = (event) => {
    if(role==="Пользователь"){
      setActiveModalDataFile(true)
    }

    console.log(111)
    setFileList([...fileList, event.target.files[0]])

  };

  const onCleanFile = (id) => {
    setFileList(fileList.filter((file, index) => {
      return index !== id
    }))
    setFileListData(fileListData.filter((data, index) => {
      return index !== id
    }))
  };
  const onCancelModalDataFile = () => {
    setFileList(fileList.filter((file) => {
      return file.number && file.date
    }))
    setActiveModalDataFile(false)
  };
  const onSaveFormDataFile = ({number, date, title}) => {
    setActiveModalDataFile(false)
    setFileListData([...fileListData, {number, date: +date, title}])
  }


  return (<> <input id='input_file' className="none" onChange={onChangeUploadFile} name='files'
                    type='file'/>
        <label htmlFor="input_file" className="ant-btn"> <UploadOutlined/> Загрузить
        </label>
        <div className="file_list">
          {fileListData.map((file, index) => {
            return (
                <div className="file">
                  <div className="file_box">
                    <FileTextOutlined className="file_icon"/>
                    <Tooltip title={file.title ? file.title : file.name}>
                                                            <span
                                                                className="file_name">{file.title ? file.title : file.name}</span>
                      <span
                          className="file_info"> вх № {file.number ? file.number : "____"} от {file.date ? moment(file.date).format("DD.MM.YYYY") : "_____"}</span>

                    </Tooltip>
                  </div>
                  <DeleteOutlined onClick={event => onCleanFile(index)}/>
                </div>

            )
          })}

        </div>
        <FormNewDoc activeModalDataFile={activeModalDataFile}
                    onCancelModalDataFile={onCancelModalDataFile}
                    onSaveFormDataFile={onSaveFormDataFile}

        />




        {/*<Modal title="Заполните поля"*/}
        {/*       visible={activeModalDataFile}*/}
        {/*       onCancel={onCancelModalDataFile}*/}
        {/*       footer={null}*/}
        {/*>*/}
        {/*  <Form {...formItemLayout} onFinish={onSaveFormDataFile}>*/}
        {/*    <Form.Item name="title"*/}
        {/*               label="Название"*/}
        {/*               rules={[{required: true, message: ''}]}*/}
        {/*    >*/}
        {/*      <Input/>*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item name="number"*/}
        {/*               label="Вх №"*/}
        {/*               rules={[{required: true, message: ''}]}*/}
        {/*    >*/}
        {/*      <Input/>*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item name="date"*/}
        {/*               label="Дата"*/}
        {/*               rules={[{required: true, message: ''}]}*/}


        {/*    >*/}
        {/*      <DatePicker*/}
        {/*          format={'DD.MM.YYYY'}*/}
        {/*      />*/}
        {/*    </Form.Item>*/}
        {/*    <Form.Item {...tailLayout}>*/}
        {/*      <Button htmlType="submit" type="primary">Сохранить</Button>*/}
        {/*    </Form.Item>*/}
        {/*  </Form>*/}

        {/*</Modal>*/}

      </>
  );
};
