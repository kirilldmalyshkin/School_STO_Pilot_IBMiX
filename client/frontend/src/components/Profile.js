import React, { Component } from "react";
import { Avatar, Tabs, Icon, Button, Card, Form, DatePicker } from "antd";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import pilotAvatar from "../images/pilotAvatarHalf.jpg";
import './Profile.css';

// const fetch = require('node-fetch');

import { Link, Redirect } from "react-router-dom";
// import { connect } from "react-redux";
// import {EditProfilePageAC} from '../redux/action';
import moment from 'moment';

const { TabPane } = Tabs;

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: false,
      edit: false,
      user: null,
    };
  }
  
  componentDidMount() {
    (async () => {
      const response = await fetch('/api/profilePilot', {
        headers: { 'Content-Type': 'application/json' }
      })
      const result = await response.json();
      this.setState({user: result.response});
    })();
  }

  saveToBase(user) {
    (async () => {
      fetch('/api/pilot/edit', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({editUser: user}),
      }).then((res) => res.json()).then((res) => console.log("IN FETCH", res));
    })();
    this.setState({edit: !this.state.edit});
  }

  render() {
    if (this.state.isRedirect) {
      return <Redirect to={"/login"} />;
    }
    let linkEdite = '';

    if (this.state.user && this.state.user.crewRole === 'командир') {
      linkEdite = '/edit/profile_comander'
    } else if (this.state.user && this.state.user.crewRole !== 'командир') {
      linkEdite = '/edit/profile_pilot'
    }
    else {
      linkEdite = "/login"
    }

    console.log('123', this.state.phone)
    return (
          <Modal isOpen={this.props.isOpen} className={'modal-lg'}> 

            <ModalBody className={'main_block'}>

            <div style={{textAlign: 'right'}}>
              <div className={"setting"}>
                <Icon type='setting' style={{color: 'white'}} className={'unselectable'} onClick={() => this.setState({edit: !this.state.edit})} />
              </div>
              <div className={"setting"}>
                <Icon type='close' style={{color: 'white'}} className={'unselectable'} onClick={() => this.props.closeFunc()} />
              </div>
            </div>

              <div className="block_with_avatar">
                <div className="left_column_with_avatar">
                    <Avatar
                        size={150}
                        icon="user"
                        src={this.state.photo && this.state.user.photo ? this.state.user.photo : pilotAvatar}
                    />
                </div>
                <div className="right_column_with_avatar">
                      <h3
                          style={{ color: "#ffffff" }}
                      >{`${this.state.user ? this.state.user.firstName : "Name"} ${this.state.user ? this.state.user.lastName : 'Surname'}`}</h3>
 
                      <div className={'contact_info'} style={{marginBottom: '0px'}}>
                        <h5 style={{ color: "#ffffff" }}>
                      <span style={{ fontWeight: "bold" }}>
                        <Icon type="user" /> &nbsp; Должность: <span style={{ fontWeight: "normal" }}> {this.state.user && this.state.user.crewRole ? this.state.user.crewRole : '-/-'} </span>
                      </span>
                        </h5>
                      </div>

                      <div className={'contact_info' + (this.state.edit ? ' change_this_field' : '')}>
                        <h5 style={{ color: this.state.edit ? "rgb(83,93,202)" : "#ffffff" }}>
                          <span style={{ fontWeight: "bold", marginLeft: '10px'}}>
                            <Icon type="mail" /> &nbsp; E-mail:
                            <input 
                            value = {this.state.user && this.state.user.email ? this.state.user.email : (!this.state.edit ? '-/-' : '')}
                            className={'input_field'}
                            onChange={(val) => {
                              let tmp = this.state.user;
                              tmp.email = val.target.value;
                              this.setState({user: tmp})
                            }}
                            disabled={!this.state.edit}
                            />
                          </span>
                        </h5>
                      </div>

                      <div  className={'contact_info' + (this.state.edit ? ' change_this_field' : '')}>
                        <h5 style={{ color: this.state.edit ? "rgb(83,93,202)" : "#ffffff", marginLeft: '11px' }}>
                          <span style={{ fontWeight: "bold", marginLeft: '10px' }}>
                            <Icon type="phone" /> &nbsp; Телефон: 
                            <input 
                            value = {this.state.user && this.state.user.phone ? this.state.user.phone : (!this.state.edit ? '-/-' : '')}
                            className={'input_field'}
                            onChange={(val) => {
                              let tmp = this.state.user;
                              tmp.phone = val.target.value;
                              this.setState({user: tmp})
                            }}
                            disabled={!this.state.edit}
                            />
                          </span>
                        </h5>
                      </div>
                </div>
              </div>

    

              <div className='block_with_avatar'>
                    <div>
                      <div>
                        <h5 style={{ color: "#ffffff" }}>
                          <span style={{ fontWeight: "bold" }}>
                            <Icon type="calendar" /> &nbsp; Стаж работы в должности: 
                          </span>
                          <li type='disc'>
                            <span className={'subtext'}>с {this.state.user && this.state.user.standingFromDateInRole ? this.state.user.standingFromDateInRole : '-/-'} </span>
                          </li>
                        </h5>
                      </div>

                      <div>
                        <h5 style={{ color: "#ffffff" }}>
                          <span style={{ fontWeight: "bold" }}>
                            <Icon type="calendar" /> &nbsp; Стаж работы в авиакомпании:
                          </span>
                          <li>
                            <span className={'subtext'}> с {this.state.user && this.state.user.standingFromDate ? this.state.user.standingFromDate : '-/-'}</span>
                          </li>
                        </h5>
                      </div>
                    </div>

                    <div>
                      <div>
                        <h5 style={{ color: "#ffffff" }}>
                          <span style={{ fontWeight: "bold" }}>
                            <Icon type="global" /> &nbsp; Индекс сеньорити: 
                          </span>
                          <li>
                            <span className={'subtext'}> {this.state.user && this.state.user.reliabilityIndex ? this.state.user.reliabilityIndex : '-/-'} </span>
                          </li>
                        </h5>
                      </div>

                      <div>
                        <h5 style={{ color: "#ffffff" }}>
                          <span style={{ fontWeight: "bold" }}>
                            <Icon type="bell" /> &nbsp; Индекс поощрений и наказаний:
                          </span>
                          <li>
                            <span className={'subtext'}> {this.state.user && this.state.user.rewardsAndPunishments ? this.state.user.rewardsAndPunishments : '-/-'}</span>
                          </li>
                        </h5>
                      </div>
                    </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', height: '70px'}}>
                <div style={!this.state.edit ? {display: 'none'} : {display: 'block'}}>
                  <Button onClick={() => this.saveToBase(this.state.user)}>Сохранить</Button>
                </div>
              </div>
            </ModalBody>
        </Modal>
    );
  }
}

export default Profile;
