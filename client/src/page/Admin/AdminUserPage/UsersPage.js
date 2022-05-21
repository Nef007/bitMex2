import React, {useEffect} from "react";
import {Button, Form, Modal, Table,} from "antd";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import {FormUser} from "../../../component/FormUser";



export const UsersPage = (props) => {

    const {
        columns,
        users,
        activeUserAddedModal,
        onActiveUserAddedModal,
        onBuildPassword,
        password,
        onRegister,
        loading,
        pagination,
        onTableChange,
        total,


    } = props

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            password: password,
        });
    });

    return (
        <>
            <div className="title">Пользователи</div>
            <div className='contentOut'>

                <Table scroll={{x: 900 }}
                       size="small"
                       rowKey={record => record.id}
                       loading={loading}
                       columns={columns}
                       dataSource={users}
                       pagination={pagination}
                       onChange={onTableChange}
                       title={() =>
                           <div className="table_header">
                               <span>Всего: {total}</span>
                               <Button onClick={onActiveUserAddedModal} type="primary">
                                   <PlusOutlined/> Добавить
                               </Button>
                           </div>
                       }

                />


                <Modal
                    width={450}
                    title="Добавление пользователя"
                    visible={activeUserAddedModal}
                    footer={null}
                    onCancel={onActiveUserAddedModal}
                >
                    <FormUser isAdmin deleteBtn={false} password={password} onSaveForm={onRegister}
                              onBuildPassword={onBuildPassword}/>


                </Modal>
            </div>

        </>

    );
};
