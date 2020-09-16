import React, { Component } from "react";
import { Avatar, Tabs, Icon, Button, Card, Form, DatePicker } from "antd";
import pilotAvatar from "../images/pilotAvatarHalf.jpg";
import './Profile.css';

import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
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
      edit: false
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.state.isRedirect) {
      return <Redirect to={"/login"} />;
    }
    let linkEdite = '';

    if (this.props.user.crewRole === 'командир') {
      linkEdite = '/edit/profile_comander'
    } else if (this.props.user.crewRole !== 'командир') {
      linkEdite = '/edit/profile_pilot'
    }
    else {
      linkEdite = "/login"
    }

    return (
        <div style={{ padding: "10px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
                style={{
                  borderRadius: "20px",
                  display: "flex",
                  width: "850px",
                  marginTop: "20px",
                  display: 'flex',
                  flexDirection: 'column',
                  background: 
                      "linear-gradient(6deg, rgba(132,100,250,1) 0%, rgba(74,118,168,1) 100%)"
                }}
            >
            
            <div className={"setting"}>
              <a href={linkEdite} style={{color: 'white'}}><Icon type='setting' /></a>
            </div>

              <div className="block_with_avatar">
                <div className="left_column_with_avatar">
                    <Avatar
                        size={150}
                        icon="user"
                        src={this.props.user.photo ? this.props.user.photo : pilotAvatar}
                    />
                </div>
                <div className="right_column_with_avatar">
                      <h3
                          style={{ color: "#ffffff" }}
                      >{`${this.props.user.firstName} ${this.props.user.lastName}`}</h3>
 
                      <div>
                        <h5 style={{ color: "#ffffff" }}>
                      <span style={{ fontWeight: "bold" }}>
                        <Icon type="user" /> &nbsp; Должность: <span style={{ fontWeight: "normal" }}> {this.props.user.crewRole ? this.props.user.crewRole : '-/-'} </span>
                      </span>
                        </h5>
                      </div>

                      <div>
                        <h5 style={{ color: "#ffffff" }}>
                          <span style={{ fontWeight: "bold" }}>
                            <Icon type="mail" /> &nbsp; E-mail: <span style={{ fontWeight: "normal" }}>{this.props.user.email ? this.props.user.email : '-/-'}</span>
                          </span>
                        </h5>
                      </div>

                      <div>
                        <h5 style={{ color: "#ffffff" }}>
                      <span style={{ fontWeight: "bold" }}>
                        <Icon type="phone" /> &nbsp; Телефон: <span style={{ fontWeight: "normal" }}>{this.props.user.phone ? this.props.user.phone : '-/-'}</span>
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
                            <span className={'subtext'}>с {this.props.user.standingFromDateInRole ? this.props.user.standingFromDateInRole : '-/-'} </span>
                          </li>
                        </h5>
                      </div>

                      <div>
                        <h5 style={{ color: "#ffffff" }}>
                          <span style={{ fontWeight: "bold" }}>
                            <Icon type="calendar" /> &nbsp; Стаж работы в авиакомпании:
                          </span>
                          <li>
                            <span className={'subtext'}> с {this.props.user.standingFromDate ? this.props.user.standingFromDate : '-/-'}</span>
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
                            <span className={'subtext'}> {this.props.user.reliabilityIndex ? this.props.user.reliabilityIndex : '-/-'} </span>
                          </li>
                        </h5>
                      </div>

                      <div>
                        <h5 style={{ color: "#ffffff" }}>
                          <span style={{ fontWeight: "bold" }}>
                            <Icon type="bell" /> &nbsp; Индекс поощрений и наказаний:
                          </span>
                          <li>
                            <span className={'subtext'}> {this.props.user.rewardsAndPunishments ? this.props.user.rewardsAndPunishments : '-/-'}</span>
                          </li>
                        </h5>
                      </div>


                      {this.props.user.vk && (
                          <div>
                            <h5 style={{ color: "#ffffff" }}>
                        <span style={{ fontWeight: "bold" }}>
                          <Icon type="global" /> &nbsp; VK:{" "}
                        </span>{" "}
                              <span style={{ fontWeight: "normal" }}>
                          {this.props.user.vk}
                        </span>
                            </h5>
                          </div>
                      )}
                      {this.props.user.nativeLocation && (
                          <div>
                            <h5 style={{ color: "#ffffff" }}>
                        <span style={{ fontWeight: "bold" }}>
                          <Icon type="compass" /> &nbsp; Приоритетный город для полетов:{" "}
                        </span>{" "}
                              <span style={{ fontWeight: "normal" }}>
                          {this.props.user.nativeLocation}
                        </span>
                            </h5>
                          </div>
                      )}
                    </div>
              </div>


            </div>

          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card className="newCard">
              <Tabs defaultActiveKey="1">
                <TabPane
                    tab={
                      <span>
                    <Icon type="picture" />
                    Все заявки
                  </span>
                    }
                    key="1"
                >
                  <div style={{ display: "block", textAlign: "center" }}>
                    {/* {this.props.photos &&
                    this.props.photos.map((url, i) => {
                      return (
                        <Avatar
                          size={150}
                          icon="user"
                          shape="square"
                          src={url.thumbUrl}
                          style={{ margin: "10px 10px 0 0" }}
                          onClick={this.showModal}
                          key={i}
                        />
                      );
                    })} */}
                    Какая то информация
                  </div>
                </TabPane>
                <TabPane
                    tab={
                      <span>
                    <Icon type="picture" theme="twoTone" twoToneColor="#eb2f96" />
Удовлетворенные заявки
                  </span>
                    }
                    key="2"
                >
                  <div>
                    Какая то информация
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    edit: store.editProfile,
    photos: store.photos,
    user: store.user
  };
}

export default Form.create()(connect(mapStateToProps)(Profile));
