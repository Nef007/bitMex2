import { Space, Spin } from "antd";
import React from "react";

export const Loader = () => {
  return (
      <div className="loadFull">

       {/*style={{ display: "flex", justifyContent: "center", paddingTop: "2rem", }}*/}

      <Space size="middle">
        <Spin size="large" />
      </Space>

      </div>
  );
};
