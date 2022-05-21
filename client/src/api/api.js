import axios from 'axios';

const request = async (url, method = 'GET', body = null, headers = {}, files = false, getFileName=false ) => {
    if (body && !files) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
    }


    const response = await fetch(url, {method, body, headers});

    if(getFileName){
        if(response.status===200){
            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = getFileName
            document.body.appendChild(link)
            link.click()
            link.remove()

        }else {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Что то пошло не так');
            }

            return data;
        }


    }else {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Что то пошло не так');
        }

        return data;
    }




};


export const authAPI = {
    login(form) {
        return request('/user/login', 'POST', form);
    },

    auth(token) {
        return request('/user/me', 'GET', null, {
            Authorization: `Bearer ${token}`,
        });
    },

    register(from, form) {
        return request(`/user/register/${from}`, 'POST', form);
    },
};






export const notifiAPI = {
    create(form, token) {
        return request('/notifi/', 'POST', form, {
            Authorization: `Bearer ${token}`,
        },);
    },
    all(params, token) {
        return request('/notifis/', 'POST', params, {
            Authorization: `Bearer ${token}`,
        },);
    },
    del(id, token) {
        return request(`/notifi/${id}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`,
        },);
    },
    getUsers(id, token) {
        return request(`/notifiusers/${id}`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        },);
    },

    seeNotifi(arrIdNotifi, token) {
        return request(`/notifi/`, "PUT", {arrIdNotifi}, {
            Authorization: `Bearer ${token}`,
        },);
    },
    getNotifi(token) {
        return request(`/notifi/`, "GET", null, {
            Authorization: `Bearer ${token}`,
        },);
    },

};

export const monitAPI = {
    create(form, token) {
        return request('/server/', 'POST', form, {
            Authorization: `Bearer ${token}`,
        },);
    },
    all(params) {
        return request('/servers/', 'POST', params);
    },
    del(id, token) {
        return request(`/server/${id}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`,
        },);
    },
    log(id, params) {
        return request(`/server/log/${id}`, 'POST', params);
    },
    change(id, form, token) {
        return request(`/server/${id}`, 'PUT', {form}, {
            Authorization: `Bearer ${token}`,
        },);
    },
    get_index(id,token) {
        return request(`/server/${id}`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        },);
    },
    report(date, token) {
        return request(`/report`, 'POST', {date}, {
            Authorization: `Bearer ${token}`,
        },);
    },

};

export const systemAPI = {
    create_Version(form, token) {
        return request('/version/', 'POST', form, {
            Authorization: `Bearer ${token}`,
        },);
    },
    all_Versions(token) {
        return request('/versions/', 'GET', null, {
            Authorization: `Bearer ${token}`,
        },);
    },
    del_Version(id, token) {
        return request(`/version/${id}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`,
        },);
    },
    change_Version(id, form, token) {
        return request(`/version/${id}`, 'PUT', {form}, {
            Authorization: `Bearer ${token}`,
        },);
    },
    get_VersionIndex(id,token) {
        return request(`/version/${id}`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        },);
    },


};


export const requestAPI = {
    create(form,  token) {
        return request(`/request/`, 'POST', form,
            {
                Authorization: `Bearer ${token}`,
            },
            true
        );
        // return axios.post(`/request/`, form, {
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //             "Content-Type": "multipart/form-data",
        //         },
        //     }
        //
        // );
    },
    all(filter, params, token) {
        return request(`/requests/${filter}`, 'POST', params, {
            Authorization: `Bearer ${token}`,
        });
    },
    search(filter, params, search, token) {
        return request(`/requests/search/${filter}`, 'POST', {params, search}, {
            Authorization: `Bearer ${token}`,
        });
    },
    get(id, token) {
        return request(`/request/${id}`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        });
    },
    getInfoRequest(token) {
        return request(`/request/info`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        });
    },
    execut(id, data, token) {

        return request(`/request/${id}`, 'PUT', data, {
            Authorization: `Bearer ${token}`,
        });
    },
    see(id, token) {

        return request(`/request/see/${id}`, 'PUT', null, {
            Authorization: `Bearer ${token}`,
        });
    },
    del(id, token) {

        return request(`/request/del/${id}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`,
        });
    },
    change(id, formData, token) {

        return request(`/request/change/${id}`, 'PUT', formData, {
            Authorization: `Bearer ${token}`,
        }, true);
    },
    delFile(id, path, token) {

        return request(`/request/delfile?id=${id}&path=${path}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`,
        });
    },
    estimation(id, value,  token) {

        return request(`/request/estimation/${id}`, 'PUT', value, {
            Authorization: `Bearer ${token}`,
        });
    },
    rezult(id, formData, token) {

        return request(`/request/rezult/${id}`, 'PUT', formData, {
            Authorization: `Bearer ${token}`,
        },
        true

        );
    },
    rezultfinish(id, value, token) {

        return request(`/request/rezult/${id}`, 'PUT', value, {
            Authorization: `Bearer ${token}`,
        },

        );
    },
    downloadImg(id, name, token) {
        return request(`/download/img/${id}`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        }, false, name);
    },

};

export const documentAPI = {
    create(form,  token) {
        return request(`/document`, 'POST', form,
            {
                Authorization: `Bearer ${token}`,
            },
            true
        );

    },

    statDevision( filters, token) {
        return request(`/document/stat_devision`, 'POST', {filters}, {
            Authorization: `Bearer ${token}`,
        });
    },
    statSection( filters, token) {
        return request(`/document/stat_section`, 'POST', {filters}, {
            Authorization: `Bearer ${token}`,
        });
    },
    startDuples( filters, token) {
        return request(`/document/start_duples`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        });
    },
   allDuples( filters, token) {
        return request(`/document/all_duples`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        });
    },


};

export const userAPI = {
    all(params, token) {
        return request('/users', 'POST', params, {
            Authorization: `Bearer ${token}`,
        });
    },
    get(id, token) {
        return request(`/user/${id}`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        });
    },
    del(id, token) {
        return request(`/user/${id}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`,
        });
    },
    change(id, form, token) {
        return request(`/user/${id}`, 'PUT', form, {
            Authorization: `Bearer ${token}`,
        });
    },
    changeSetting(id, form, token) {
        return request(`/user/setting/${id}`, 'PUT', form, {
            Authorization: `Bearer ${token}`,
        });
    },

    createdAccessService(id, form, token) {
        return request(`/user/access_service/${id}`, 'POST', form, {
            Authorization: `Bearer ${token}`,
        });
    },
    deleteAccessService(id, deleteArrayHeader, token) {
        return request(`/user/access_service/${id}`, 'DELETE', {deleteArrayHeader}, {
            Authorization: `Bearer ${token}`,
        });
    },
    getAccessService(id) {
        return request(`/user/access_service/${id}`, 'GET', null );
    },


    getLogs(id) {
        return request(`/user/logs/${id}`, 'GET', null );
    },
  getLogsFile(id) {
        return request(`/user/logs_file/${id}`, 'GET', null, {}, false, `logs_user_id_${id}.txt` );
    },






};

export const glossaryAPI = {
    getGlossary(search, glossary) {
        return request(`/glossary?search=${search}&glossary=${glossary}`, 'GET', null);
    },

    deleteWordGlossary(id, glossary, token) {
        return request(`/glossary/del?id=${id}&glossary=${glossary}`, 'DELETE', null,{
            Authorization: `Bearer ${token}`,
        });
    },

    getGlossaryNew(token) {
        return request(`/glossary/new`, "GET", null, {
            Authorization: `Bearer ${token}`,
        });
    },

    deleteNewWordAdmin(wordId, token) {
        return request(`/glossary/new/`, "DELETE", {wordId}, {
            Authorization: `Bearer ${token}`,
        });
    },
    getCountWordGlossary(arrayGlossary, token) {
        return request(`/glossary/stat/`, "PUT", {arrayGlossary}, {
            Authorization: `Bearer ${token}`,
        });
    },


    changeWord({oldWord, word, glossaryValue, idNewWord}, relation,  token) {
        return request(
            `/glossary/new/${idNewWord}`,
            "PUT",
            {oldWord, word, glossaryValue, relation },
            {
                Authorization: `Bearer ${token}`,
            }
        );
    },
    addWord(word, glossary, token) {
        return request(
            `/glossary/${glossary}`,
            "POST",
            {word},
            {
                Authorization: `Bearer ${token}`,
            }
        );
    },
};









