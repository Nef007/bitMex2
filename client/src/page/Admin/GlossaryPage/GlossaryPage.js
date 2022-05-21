import React, {useEffect, useState} from "react";

import "moment/locale/ru";

import {useRootStore} from "../../../store";
import {Button, Col, Form, Input, Modal, Space, Table, Tabs, Tooltip} from "antd";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import Highlighter from "react-highlight-words";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import {Link} from "react-router-dom";
import moment from "moment";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import {useToggle} from "react-use";
import {DebounceSelect} from "../../../component/DebounceSelect";
import {Observer, observer} from "mobx-react-lite";
import RedoOutlined from "@ant-design/icons/lib/icons/RedoOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";


export const GlossaryPage = observer( (props) => {


  const {glossary} = useRootStore()

  const [arraySelectNewWord, setArraySelectNewWord] = useState([])
  const [activeModal, setActiveModal] = useToggle(false)
  const [activeModalChange, setActiveModalChange] = useToggle(false)



  useEffect(async () => {
    await glossary.geGlossaryNew();
    await glossary.getCountWordGlossary()
  }, []);

  //удаляет слово из таблицы новых слов
  const onDeleteNewWordAdmin = async () => {
    await glossary.deleteNewWordAdmin(arraySelectNewWord);


  };

// добавляет слова в словари
  const onAddWordsInGlossary = async (word, glossaryValue) => {
    await glossary.addWord(word, glossaryValue);
    // getNewWords();
    // запрос слов из словаря в "Редактирование"
    await glossary.getGlossaryAdminPanel(glossaryValue)
    await glossary.getCountWordGlossary()
  };
  // изменяет слово в списке новых и используемых таблицах, оповещение пользователю
  const onChangeWord = async ( word) => {
    if (word) {
      await glossary.changeNewWord(word);


    }
  };

  // запрос словаря
  const onGetGlossary = async (glossaryValue) => {
    await glossary.getGlossaryAdminPanel(glossaryValue)

  };


  const onActiveModalChange= async (oldWord, glossaryValue, idNewWord) => {

    glossary.setData({
      oldWord,
      glossaryValue,
      idNewWord
    })
    await glossary.getGlossary('',  glossaryValue)
    setActiveModalChange()

  };
  // удаление слова из словаря
  const onDeleteWordGlossary = async (id) => {

      Modal.confirm({
        title: 'Вы действительно хотите удалить запись?',
        icon: <ExclamationCircleOutlined />,
        // content: 'Some descriptions',
        okText: 'Да',
        okType: 'danger',
        cancelText: 'Нет',
        onOk() {
          glossary.deleteWordGlossary(id)
        },

      });


  };


  const rowSelection = {
    onChange: selectedRowKeys => setArraySelectNewWord(selectedRowKeys),
  };


  //////////////////////////////////ПОИСК///////
  let searchInput = React.createRef()
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)

  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };
  const getColumnSearchProps = dataIndex => ({

    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{padding: 8}}>
          <Input
              ref={node => {
                searchInput = node;
              }}
              placeholder={`Что искать?`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{marginBottom: 8, display: 'block'}}
          />
          <Space>
            <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined/>}
                size="small"
                style={{width: 90}}
            >
              Поиск
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
              Сброс
            </Button>
          </Space>
        </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
    onFilter: (value, record) =>
        record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: text =>
        searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
        ) : (
            text
        ),
  });


  const columns = [
    {
      title: "Действие",
      render: (record) => (
          <>
            <Tooltip title="Исправить">
              <Button onClick={() => onActiveModalChange(record.word, record.glossary, record.id)}
                      shape="circle" icon={<EditOutlined/>}
                      size="large"/>
            </Tooltip>

          </>

      ),
    },
    {
      title: "Слово",
      dataIndex: "word",
    },
    {
      title: "Словарь",
      dataIndex: "glossary",

    },
    {
      title: "Пользователь",
      render: (record) => (
          <Link to={`/admin/user/${record.userId}`}>
            {record.user}
          </Link>

      )

    },

    {
      title: "Дата",
      dataIndex: "createdAt",
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => (moment(text).format("DD.MM.YYYY HH:mm"))

    },
  ];
  const columnsEdit = [

    {
      title: "Действие",
      render: (record) => (
          <>
            <Space size="middle">

              <Tooltip title="Показать">
                <Button onClick={() => onGetGlossary(record.glossary)} shape="circle"
                        icon={<EyeOutlined/>}
                        size="large"/>
              </Tooltip>
            </Space>


          </>

      ),
    },
    {
      title: "Имя",
      dataIndex: "name",
      ...getColumnSearchProps('name'),


    }, {
      title: "Словарь",
      dataIndex: "glossary",
    },
    {
      title: "Таблицы",
      render: (record) => record.tables.map(item => <span>{item.table}={item.collum} </span>)
    },
    {
      title: "Слов",
      dataIndex: "count_word",

    },

  ];
  const columnsEditWord = [

    {
      title: "Действие",
      render: (record) => (
          <>
            <Space size="middle">
              <Tooltip title="Изменить">
                  <Button  onClick={() => onActiveModalChange(record.word, glossary.current_glossary, record.id)} shape="circle"
                          icon={<EditOutlined />}
                          size="large"/>
              </Tooltip>


              <Tooltip title="Удалить">
                <Button onClick={() => onDeleteWordGlossary(record.id)} shape="circle"
                        icon={<DeleteOutlined/>}
                        size="large"/>
              </Tooltip>
            </Space>


          </>

      ),
    },
    {
      title: "Слово",
      dataIndex: "word",
      ...getColumnSearchProps('word'),
    },
    {
      title: "Дата",
      dataIndex: "createdat",
      defaultSortOrder: 'descend',
      sorter: (a, b) => Number(a.createdat) - Number(b.createdat),
      render: (text) => moment(Number(text)).format("DD.MM.YYYY HH:mm")

    },

  ];


  return (
      <>
        <div className="title">Словари</div>
        <div className="contentOut">
          <Tabs type="card">
            <Tabs.TabPane tab="Новые" key="1">
              <Table scroll={{x: 900}}
                     size="small"
                     rowKey={record => record.id}
                     loading={glossary.loadingTable}
                     rowSelection={rowSelection}
                     columns={columns}
                     dataSource={glossary.arrayWordsNew}
                     title={() =>
                         <div className="table_header">

                             <span>Всего: {glossary.arrayWordsNew.length}</span>

                           <div>
                             <Button
                                 className="btn"
                                 onClick={onDeleteNewWordAdmin}
                                 disabled={!arraySelectNewWord.length}
                                 type="primary"
                             >
                               Просмотрено
                             </Button>
                             <Button
                                 className="btn"
                                 onClick={() => glossary.geGlossaryNew()}
                                 type="primary"
                             >
                               Обновить
                             </Button>
                           </div>
                         </div>
                     }
              />

            </Tabs.TabPane>
            <Tabs.TabPane tab="Редактировать" key="2">
              <Table scroll={{x: 600, y: 200}}
                     size="small"
                     rowKey={record => record.id}
                     loading={glossary.loadingTable}
                     columns={columnsEdit}
                     dataSource={glossary.glossaryList}

              />
              <Table scroll={{x: 600}}
                     size="small"
                     rowKey={record => record.id}
                     loading={glossary.loadingTable}
                     columns={columnsEditWord}
                     dataSource={glossary.glossaryAdminArrayWord}
                     title={() =>
                         <div className="table_header">

                           <span>Всего: {glossary.glossaryAdminArrayWord.length}</span>

                           <div>
                             <Button
                                 className="btn"
                                 onClick={() => setActiveModal()}
                                 type="primary"
                             >
                               Добавить
                             </Button>

                             <Modal
                                 title={`Добавление слов в ${glossary.current_glossary}`}
                                 visible={activeModal}
                                 footer={null}
                                 onCancel={() => setActiveModal()}
                             >
                               <div className="lineContainer">
                                 <Form
                                     name="change_user"
                                     className="login-form"
                                     onFinish={(value) => onAddWordsInGlossary(value.word,glossary.current_glossary)}
                                 >
                                   <div className="paramItemAuth">
                                     <Col>
                                       <Form.Item name={"word"}>
                                         <Input.TextArea placeholder="Введите список"/>
                                       </Form.Item>

                                     </Col>
                                   </div>


                                   <div className="buttonPanel">
                                     <div className="buttonItem">
                                       <Button type="primary" htmlType="submit">
                                         Добавить
                                       </Button>
                                     </div>
                                   </div>

                                 </Form>
                               </div>

                             </Modal>
                           </div>

                         </div>
                     }

              />
            </Tabs.TabPane>
          </Tabs>
          <Modal
              title="Исправить"
              visible={activeModalChange}
              footer={null}
              onCancel={() => setActiveModalChange()}
          >
            <div className="lineContainer">
              <Observer>
                {() =>
                    <Form
                        name="change_word"
                        className="login-form"
                        onFinish={(value) =>
                            onChangeWord(value.word)
                        }
                    >
                      <div className="paramItemAuth">

                        <Col>
                          <Form.Item
                              name={'word'}
                              rules={[{required: true, message: '',}]}
                              initialValue={glossary.data.oldWord}

                          >
                            <DebounceSelect
                                glossary={glossary.data.glossaryValue}
                                showSearch
                                loadingSelect={glossary.loadingSelect}
                                getGlossary={(value, glossaryname) => glossary.getGlossary(value, glossaryname)}
                                placeholder="Выберите значение"
                                defaultOptions={glossary.glossary[glossary.data.glossaryValue]}
                                onAddWord={(word, glossaryname) => glossary.addWord(word, glossaryname)}
                            />

                          </Form.Item>
                        </Col>
                      </div>

                      <div className="buttonPanel">
                        <div className="buttonItem">
                          <Button type="primary" htmlType="submit">
                            Исправить
                          </Button>
                        </div>
                      </div>
                    </Form>
                }</Observer>
            </div>
          </Modal>

        </div>
      </>


  );
});


