import { Chart, registerables } from 'chart.js';
import BarChart from "./Chart/BarChart";
import LineChart from "./Chart/LineChart";
import DoughnutChart from "./Chart/DoughnutChart";
import { useReducer } from "react";
import PlusJobsModal from "../../Modal/PlusJobsModal";
import GalleryBarChart from './Chart/GalleryBarChart';
import LineChartIncome from './Chart/LineChartIncome';
import ChartResponCarousel from './Chart/ChartResponCarousel';
Chart.register(...registerables);

function DashboardTabs({ accounts, getAccounts, axios, toast, ToastUpdate, useRef, token, useEffect }) {
    const toastNow = useRef(null)
    const sortPlace = ["Việc cần làm", "Thời gian tạo", "Trạng thái"]
    const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
        jobs: "",
        wantSeeJobs: false,
        modalOpen: false,
        dataAccounts: null,
        dataSamples: null,
        dataBlogs: null,
        dataBookingSuccess: null,
        dataBookingFail: null,
        dataSamplesPie: null,
        dataGallery: null,
        dataTotalPriceBooking: null,
    })

    useEffect(() => {
        const configuration = {
            method: "get",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/FetchDashboard`,
        }
        axios(configuration).then((res) => {
            setState({ dataAccounts: res.data.dataAccounts, dataSamples: res.data.dataSamples, dataBlogs: res.data.dataBlogs, dataBookingSuccess: res.data.dataBookingSuccess, dataBookingFail: res.data.dataBookingFail, dataSamplesPie: res.data.dataSamplesPie, dataGallery: res.data.dataGallery, dataTotalPriceBooking: res.data.dataTotalPriceBooking })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleTodoList(e, idX) {
        const configuration = {
            method: "post",
            url: `${process.env.REACT_APP_apiAddress}/api/v1/UpdateTodoList`,
            data: {
                id: token.userId,
                jobsId: idX,
                status: e
            }
        }
        toastNow.current = toast.loading("Chờ một chút...")
        axios(configuration).then((res) => {
            getAccounts()
            ToastUpdate({ type: 1, message: res.data, refCur: toastNow.current })
        }).catch((err) => {
            ToastUpdate({ type: 2, message: err.response.data, refCur: toastNow.current })
        })
    }
    return (
        <>
            <div className="upDashBoard">
                <div className="upDashBoardChild">
                    <BarChart titleLabel={"Tài khoản mới"} data={state.dataAccounts} />
                </div>
                <div className="upDashBoardChild">
                    <BarChart titleLabel={"Hình mẫu mới"} data={state.dataSamples} />
                </div>
                <div className="upDashBoardChild">
                    <BarChart titleLabel={"Blog mới"} data={state.dataBlogs} />
                </div>
                <div className="upDashBoardChild">
                    <GalleryBarChart titleLabel={"Hậu trường"} data={state.dataGallery} />
                </div>
            </div>
            <div className='upDateBoard2'>
                <ChartResponCarousel state={state} BarChart={BarChart} GalleryBarChart={GalleryBarChart} />
            </div>
            <div className="midDashBoard">
                <div className="midDashBoardChild">
                    <LineChart dataSuccess={state.dataBookingSuccess} dataFail={state.dataBookingFail} />
                </div>
                <div className="midDashBoardChild">
                    <LineChartIncome data={state.dataTotalPriceBooking} />
                </div>
            </div>
            <div className="botDashBoard">
                <div className="firstChildBot">
                    <div className='upperFirstChildBot'>
                        <button onClick={() => setState(state.wantSeeJobs ? { wantSeeJobs: false } : { wantSeeJobs: true })} type="button" className="openMoreSamples"><span style={state.wantSeeJobs ? { rotate: "90deg" } : null}>➤</span> {accounts?.todolist?.filter(item => item.status === 1).length > 0 ? accounts?.todolist?.filter(item => item.status === 1).length : 0} việc cần làm</button>
                        <button onClick={() => setState({ modalOpen: true })} className="yesForm yesNoButton">+ Thêm</button>
                    </div>
                    {state.wantSeeJobs ? (
                        <table className="accountTable">
                            <thead>
                                <tr>
                                    {sortPlace.map((u, index) => {
                                        return (
                                            <th key={index}>{u}</th>
                                        )
                                    })}
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts?.todolist?.map((i) => {
                                    return (
                                        <tr key={i.id} style={{ textAlign: "center" }}>
                                            <td>{i.jobs}</td>
                                            <td>{new Date(i.time).toLocaleString()}</td>
                                            <td style={{ color: i.status === 1 ? "#09c167" : i.status === 2 ? "#e4c342" : i.status === 3 ? "#e13534" : null }}>{i.status === 1 ? "Đang làm" : i.status === 2 ? "Hoàn thành" : i.status === 3 ? "Hủy" : null}</td>
                                            <td>
                                                {i.status === 1 ? (
                                                    <div className="buttonFlexInTd">
                                                        <button onClick={() => handleTodoList(2, i.id)} title='Hoàn thành'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg></button>
                                                        <button onClick={() => handleTodoList(3, i.id)} title='Hủy'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg></button>
                                                    </div>
                                                ) : null}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : null}
                </div>
                <div className='secondChildBot'>
                    <DoughnutChart data={state.dataSamplesPie} />
                </div>
            </div>
            <PlusJobsModal setState={setState} state={state} axios={axios} toast={toast} ToastUpdate={ToastUpdate} toastNow={toastNow} token={token} getAccounts={getAccounts} />
        </>
    )
}
export default DashboardTabs