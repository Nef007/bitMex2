import {Tooltip} from "antd";
import React from "react";
import UploadOutlined from "@ant-design/icons/lib/icons/UploadOutlined";
import FileTextOutlined from "@ant-design/icons/lib/icons/FileTextOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";




export const UploadFilesOperator = ({addFiles, deleteFile, service}) => {


  return (
      <>
        <input
            id={`input_${service.id}`}
            className="none"
            onChange={(event) => addFiles(event, service.id)}
            name="files"
            type="file"
        />
        <label htmlFor={`input_${service.id}`} className="ant-btn">
          {" "}
          <UploadOutlined/> Загрузить
        </label>
        <div className="file_list">
          {service.files.map((file, index) => {
            return (
                <div className="file">
                  <div className="file_box">
                    <FileTextOutlined className="file_icon"/>
                    <Tooltip title={file.title}>
                      <span className="file_name">{file.name}</span>
                    </Tooltip>
                  </div>
                  <DeleteOutlined onClick={(event) => deleteFile(service.id, index)}/>
                </div>
            );
          })}
        </div>
      </>

  )


};
