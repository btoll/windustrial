import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import ReactModal from 'react-modal';

import ForecastMain from './forecast/ForecastMain';
import Modal from './modal/Modal';
import * as api from './api';

let cookies;

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        cookies = new Cookies();

        this.state = {
            authToken: cookies.get('authToken'),
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
        };

        this.login = this.login.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);

        // For aria, should hide underyling dom elements when modal is shown.
        // (Doesn't appear to be working.)
        ReactModal.setAppElement('#root');
    }

    closeModal(e) {
        this.setState({
            modal: {
                data: {},
                show: false
            }
        });
    }

    openModal(type, modalData, e) {
        if (e) {
            e.preventDefault();
        // Duck typing!
        } else if (modalData && modalData.preventDefault) {
            modalData.preventDefault();
        }

        const [data, text] = (typeof modalData !== 'object') ?
            [null, modalData] :
            [modalData.data, modalData.text];

        this.setState({
            modal: {
                data,
                show: true,
                text,
                type
            }
        });
    }

    login(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        this.openModal('spinnerModal');
        api.auth.call(this, formData.get('email'), formData.get('password'), cookies);
    }

    render() {
        return !this.state.authToken ?
            <>
                {
                    this.state.modal.show &&
                        <Modal app={this} />
                }

                <section id="banner">
                    <h1>Business Forecasting Tool</h1>
                </section>

                <section id="login">
                    <form onSubmit={this.login}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                name="email"
                                autoFocus={true}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                            />
                        </div>
                        <div>
                            <label></label>
                            <input
                                type="submit"
                                value="LOG IN"
                            />
                        </div>
                        <div>
                            <label></label>
                            <a href="#">Forgot your password?</a>
                        </div>
                    </form>
                </section>
            </> :

            <ForecastMain
                authToken={this.state.authToken}
                cookies={cookies}
            />;
    }
}

