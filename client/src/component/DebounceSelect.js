import React, {useState} from "react";
import debounce from "lodash/debounce";
import {Button, Empty, Select, Spin} from "antd";
import {observer, Observer} from "mobx-react-lite";


export const DebounceSelect = ({getGlossary, name, onAddWord, add=true,  tags = false, debounceTimeout = 800, loadingSelect, defaultOptions, glossary, ...props}) => {

    const [newWord, setNewWord] = useState('')

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setNewWord(value)

            getGlossary(value, glossary)
        };
        return debounce(loadOptions, debounceTimeout);
    }, [getGlossary, glossary,  debounceTimeout]);


    return (


        <Select
            mode={tags ? "multiple" : ""}
            allowClear={true}
            labelInValue={tags}
            onSearch={debounceFetcher}
            optionFilterProp="children"
            filterOption={false
            }
            filterSort={(optionA, optionB) => optionA.value.indexOf(newWord.toLowerCase()) - optionB.value.indexOf(newWord.toLowerCase())

            }
            notFoundContent={loadingSelect ? <Spin size="small"/> : <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{
                    height: 40,
                }}
                description={
                    add ?
                    <span>
        В Базе нет такого слова. Добавим?
      </span> : <span>
        Нет данных
      </span>
                }
            >
                {add &&  <Button onClick={() => onAddWord(newWord, glossary)} type="primary">Добавить</Button> }
            </Empty>}
            {...props}
            options={defaultOptions}

        />


    );
}



