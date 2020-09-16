import React, { Suspense, Component } from "react";
// import avatar from "../images/avatar.png";

import { Link } from 'react-router-dom';

import { Tabs } from 'antd';

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



class StepD2 extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }



    render() {

        return (

            <div className="dashBoardContainer">

                <div className="dashBoardContent borderDesign" style={{ borderColor: "4px double black;" }}>


                    <Card size="small"
                        className="userCardSlider"
                    >
                        <div style={{ textAlign: "left", height: '300px' }}>

                        </div>
                        {/* <div className='buttonCardSlider'>Кнопка</div> */}
                        <button className='buttonCardSlider' style={{ float: 'right', marginRight: '10px' }}><span style={{ marginLeft: '10px' }}>🡺</span><span style={{ marginLeft: '35px' }}>Далее</span> </button>
                        <button className='buttonCardSlider' style={{ float: 'right', marginRight: '10px' }}><span style={{ marginLeft: '10px' }}>🡸</span><span style={{ marginLeft: '35px' }}>Назад</span> </button>


                        {/* <Button className='buttonCardSlider'>Кнопка</Button> */}

                    </Card>
                </div>
            </div>






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

export default StepD2;