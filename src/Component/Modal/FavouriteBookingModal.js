import { Modal } from 'react-responsive-modal';
import Booking from '../HomePageComponent/Booking';

function FavouriteBookingModal({ state, setState }) {
    return (
        <Modal open={state.modalFav} onClose={() => setState({ modalFav: false })} center>
            <Booking type={2} state={state} setState={setState} />
        </Modal>
    )
}
export default FavouriteBookingModal