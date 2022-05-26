

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
    getTimeUpdate(token) {
        return request(`/sys_time/`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        },);
    },
    getLog(token) {
        return request(`/sys_log/`, 'GET', null, {
            Authorization: `Bearer ${token}`,
        },);
    },
    getIndex() {
        return request(`/sys_index/`, 'GET', null);
    },
    deleteLog(token) {
        return request(`/sys_log/`, 'DELETE', null, {
            Authorization: `Bearer ${token}`,
        },);
    },
    setTimeUpdate(form, token) {
        return request(`/sys_time/`, 'POST', {...form}, {
            Authorization: `Bearer ${token}`,
        },);
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


export const groupAPI = {
    create(form, token) {
        return  request('/group', 'POST', {...form}, {
            Authorization: `Bearer ${token}`
        })

    },
    change(id, form, token) {
        return  request(`/group/${id}`, 'PUT', {...form}, {
            Authorization: `Bearer ${token}`
        })

    },
    all(token) {
        return  request('/groups', 'GET', null, {
            Authorization: `Bearer ${token}`
        })

    },
    delete(id, token) {
        return  request(`/group/${id}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`
        })

    },
};

export const toorAPI = {
    create(form, token) {
        return  request('/toor', 'POST', {...form}, {
            Authorization: `Bearer ${token}`
        })

    },
    change(id, form, token) {
        return  request(`/toor/${id}`, 'PUT', {...form}, {
            Authorization: `Bearer ${token}`
        })

    },
    all(token) {
        return  request('/toors', 'GET', null, {
            Authorization: `Bearer ${token}`
        })

    },
    myAll(token) {
        return  request('/toors_my', 'GET', null, {
            Authorization: `Bearer ${token}`
        })

    },
    adminAll(token) {
        return  request('/toors_admin', 'GET', null, {
            Authorization: `Bearer ${token}`
        })

    },
    delete(id, token) {
        return  request(`/toor/${id}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`
        })

    },
};
export const accountAPI = {
    create(form, token) {
        return  request('/account', 'POST', {...form}, {
            Authorization: `Bearer ${token}`
        })

    },
    change(id, form, token) {
        return  request(`/account/${id}`, 'PUT', {...form}, {
            Authorization: `Bearer ${token}`
        })

    },
    all(token) {
        return  request('/accounts', 'GET', null, {
            Authorization: `Bearer ${token}`
        })

    },
    delete(id, token) {
        return  request(`/account/${id}`, 'DELETE', null, {
            Authorization: `Bearer ${token}`
        })

    },
    getData(id, token) {
        return  request(`/account/${id}`, 'GET', null, {
            Authorization: `Bearer ${token}`
        })

    },
    getInfo(id, token) {
        return  request(`/accounts_info/${id}`, 'GET', null, {
            Authorization: `Bearer ${token}`
        })

    },
    getDataAll(groupId, token) {
        return  request(`/accounts_data/${groupId}`, 'GET', null, {
            Authorization: `Bearer ${token}`
        })

    },
};












