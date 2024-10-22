import ReactPaginate from "react-paginate"
import LoadSamples from "./LoadSamples"
import { Modal } from 'react-responsive-modal';

function AddSamplesUser({ toast, toastNow, ToastUpdate, useEffect, useRef, axios, getBooking, state, setState }) {
    return (
        <Modal open={state.modalOpen2} onClose={() => setState({ modalOpen2: false, samplesId: [], wantType: null, pageCount2: 6, samplesForAdd: null })} center>
            <h4 className='modalTitle'>Thêm hình mẫu</h4>
            <div className='fatherAddType2'>
                <LoadSamples ReactPaginate={ReactPaginate} toast={toast} toastNow={toastNow} ToastUpdate={ToastUpdate} useEffect={useEffect} useRef={useRef} axios={axios} getBooking={getBooking} level={2} state={state} setState={setState} />
            </div>
        </Modal>
    )
}
export default AddSamplesUser