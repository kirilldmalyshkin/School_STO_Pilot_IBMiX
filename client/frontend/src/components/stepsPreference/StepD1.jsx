import React, { Suspense, Component } from "react";
// import avatar from "../images/avatar.png";

import { Redirect, Link } from 'react-router-dom';

import { Tabs } from 'antd';

import StepD2 from './StepD2'

import {
    Card,
    Modal,
    Avatar,
    Icon,
    notification,
    Calendar,
    Input,
    message,
    Spin,
    Switch,


    Button,
    Carousel, Slider, Select, Badge, Form, Collapse,
    Tag,
    Alert,
} from "antd";

import { connect } from "react-redux";

// import { AddPhotoAC, AddUserAC, AddUsersDashBoard } from "../redux/action";



class StepD1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRedirect: false,
        };
        this.stepWishD2 = this.stepWishD2.bind(this);
    }


    stepWishD2() {
        // this.setState({ isRedirect: true })
        // this.props.stepD = <StepD2 />
        console.log(this.props)


    }

    render() {
        // if (this.state.isRedirect === true) {
        //     return <Redirect to={`/stepD2`} />
        // }
        return (

            <div className="dashBoardContainer">

                <div className="dashBoardContent borderDesign" style={{ borderColor: "4px double black;" }}>


                    <Card size="small"
                        className="userCardSlider"
                    >
                        <div style={{ textAlign: "left", height: '300px' }}>

                        </div>
                        {/* <div className='buttonCardSlider'>Кнопка</div> */}

                        <button className='buttonCardSlider' style={{ float: 'right', marginRight: '10px' }} onClick={this.stepWishD2} ><span style={{ marginLeft: '10px' }}>🡲</span><span style={{ marginLeft: '35px' }}>Далее</span> </button>
                        {/* <Button className='buttonCardSlider'>Кнопка</Button> */}

                    </Card>
                </div>
            </div >






        );
    }
}

// function mapStateToProps(store) {
//     return {
//         users: store.usersDashBoard,
//         user: store.user
//     };
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         // addUser: user => {
//         //     dispatch(AddUserAC(user));
//         // },
//         // addPhotos: photos => {
//         //     dispatch(AddPhotoAC(photos))
//         // },
//         // AddUsersDashBoard: users => {
//         //     dispatch(AddUsersDashBoard(users));
//         // }
//     };
// }

// const StepD1Render = Form.create({ name: 'dashBoard' })(StepD1);
// export default connect(mapStateToProps, mapDispatchToProps)(StepD1Render);

export default StepD1;