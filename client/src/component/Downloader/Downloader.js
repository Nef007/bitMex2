import React, {useEffect, useState} from "react";
import "./index.css";
import Axios from "axios";
import {Progress} from "antd";


const Downloader =  ({files = [], remove , setInfo}) => {

    return (
        <div className="downloader">
            <div className="card-loader">
                <div className="card-header">Скачивание файлов</div>
                <ul className="list-group list-group-flush">
                    {files.map((file, idx) => (
                        <DownloadItem
                            key={idx}
                            removeFile={() => remove(file.downloadId)}
                            {...file}
                            setInfo={setInfo}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

const DownloadItem = ({name, path, fileName, removeFile, setInfo}) => {
    const [downloadInfo, setDownloadInfo] = useState({
        progress: 0,
        completed: false,
        exception: false,
        total: 0,
        loaded: 0,
    });



    useEffect(async () => {
        const options = {

            headers: {Authorization: `Bearer ${localStorage.getItem('userData')}`,
            },
            onDownloadProgress: (progressEvent) => {
                const {loaded, total} = progressEvent;


                setDownloadInfo({
                    progress: Math.floor((loaded * 100) / total),
                    loaded,
                    total,
                    completed: false,
                    exception: false,
                });
            },
        };

        try {
            const response = await Axios.get(path, {
                responseType: "blob",
              //  responseType: "stream",
                ...options,
            })

            if (response.status === 200) {
                const url = window.URL.createObjectURL(
                    new Blob([response.data], {
                        type: response.headers["content-type"],
                    })
                );

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();

                setDownloadInfo((info) => ({
                    ...info,
                    completed: true,
                }));

            }
                else {

                setDownloadInfo((info) => ({
                    ...info,
                    exception: true,
                    completed: true,

                }));

                setInfo('error', response.data.message)

            }

        }catch (e) {




            setDownloadInfo((info) => ({
                ...info,
                exception: true,
                completed: true,
            }));

            let text = JSON.parse(await e.response.data.text()).message

            setInfo('error', text)
        }


        setTimeout(() => {
            removeFile();
        }, 4000);

    }, []);

    const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

    return (
        <li className="list-group-item">
            <div className="row-loader">
                <div className="info-loader">
                    <div className="name-info-loader">{name}</div>
                    <div>
                        <div className="size-info-loader">
                            <small>
                                { downloadInfo.exception ?  `Ошибка!` : downloadInfo.loaded > 0 && (
                                    <>
                  <span className="text-success">
                    {formatBytes(downloadInfo.loaded)}
                  </span>
                                        / {formatBytes(downloadInfo.total)}
                                    </>
                                )}
                                {downloadInfo.loaded === 0 &&  "Инициализация..."}
                            </small>
                        </div>
                    </div>

                </div>
                <Progress percent={downloadInfo.progress} status={!downloadInfo.completed ? "active": downloadInfo.exception ? 'exception' : ''}/>

            </div>
        </li>
    );
};

export default Downloader;