import React, { Suspense, Component } from 'react';

import Iframe from 'react-iframe'
import { Popover, Tabs } from 'antd';
import {
  Avatar,
  Icon,
  notification,
  Spin,
  Button,
  Select,
  Collapse,
  Radio
} from 'antd';
import { connect } from 'react-redux';
import { AddPhotoAC, AddUserAC, AddUsersDashBoard, SetPriority, SetFlightDirection, SetDayTime } from '../redux/action';
import './DashBoard.css';
import StepButtonComponent from './StepButtonComponent/StepButtonComponent';

const { Option } = Select;
const { Panel } = Collapse;
const openNotification = (placement, icon, title, message) => {
  notification.open({
    message: title,
    description:
      message,
    placement,
    icon: <Icon type={icon} style={{ color: '#108ee9' }} />,
    duration: 3,
  });
};

const content = (
  <div>
    <p><a href="/profile">Профиль</a></p>
    <p><a href="/logout">Выйти</a></p>
  </div>
);

class DashBoardCommander extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalUser: null,
      loading: false,

      visibleSort: false,

      showLongWork: true,
      showShortWork: true,

      minTime: 0,
      maxTime: 50000,

      visible: false,
      visible2: false,
      // isRedirect: false,
      usersLength: null,
      newWish: false,
      preference: true,
      preference1: false,
      preference2: false,
      preference3: false,
      preference4: false,
      preference5: false,
      selectedDates: [],
      valueIframe: 1,
    };
  }

  showModal = user => {

    this.setState({
      modalUser: {
        // id: user.id,
        // about: user.plane.about,
        where_to: user.where_to,
        where_from: user.where_from,
        flight_time: user.flight_time,
        time_of_departure: user.time_of_departure,
        time_of_arrival: user.time_of_arrival,
        level_flights: user.level_flights,
        city_photo: user.city_photo,
        airport_name: user.airport_name,
      },
      visible: true,
    });
  };

  showSort = () => {

    this.setState({
      visibleSort: true,
    });
  };

  async componentDidMount() {
    this.dispatcher_func = { SetPriority };

    const reqUsersLength = await fetch('/api/usersLength', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    let usersLength = await reqUsersLength.json();


    this.setState({ usersLength: usersLength.usersLength });


    if (this.props.users.length === 0) {
      this.setState({ loading: true });
    }

    const response = await fetch('/api/profilePilot', {
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    console.log(result);
    if (result.response !== 'fail') {

      await this.props.addUser(result.response);


    }

    console.log('есть', this.props.user);

    const reqComparison = await fetch('/api/getAllFly', {

      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        id: this.props.user.id,
      }),
    });
    let users = await reqComparison.json();


    this.setState({ loading: false });

    this.props.AddUsersDashBoard(users);
    console.log('есть ', users, this.props.users, this.props.users.response);


  }
















  ym = () => {
    return (
      '<script src=\'https://mc.yandex.ru/metrika/watch.js\' type=\'text/javascript\'></script>\
        <script type=\'text/javascript\'>\
              try {\
                    var yaCounter57428827 = new Ya.Metrika({\
                    id:57428827,\
                    clickmap:true,\
                    trackLinks:true,\
                    accurateTrackBounce:true,\
                    webvisor:true,\
                    trackHash:true\
                    });\
              } catch(e) {console.log(\'error\') }\
        </script>'
    );
  };

  onNewWishList = () => {
    this.setState({
      newWish: !this.state.newWish,
    });
  };

  onChangeIframe = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      valueIframe: e.target.value,
    });
  };


  render() {
    const { TabPane } = Tabs;
    const { cities } = this.state;
    const userMainInfo = JSON.parse(localStorage.getItem('userMainInfo'));
    let searchFlag;
    let blueCircle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAE/ElEQVRoge2ZTWhcVRTH/+dmMklLI5KmaJp0IdokGjRgBrtucROlYBZDQ6PiQiIlKahbEabg10ZF7IQ2anGRgG1cKPixkdClhpkUlagJ1EUbU7VNEDMkZua9e1zM15v37n33vpnEjbkw5OUe3tzf/5xzz7nvDbA39sb/e9BOfEkyeaUJsQceY+LjDAxKoA9AJxMdYAAM5BhYBbAkibKS5dyxo4/Op1IkG127IQEjI/NHHIhxJnoahK4SLJgI1WvfX1D5eoVB000upb+eGVj5TwUkkwuHZBO/RoTnmBCPCO6bR56ILjlx59WrU4k7uy4gOZI5zSTeZ+L2RsBRuS7baQ2MiasfD3yyKwLGxjLN6xtikomfDwUPgFXnYLAzAGZc3Gp2zmanEoUdE3DyZGZ/vI0+ZWAoKjgshPkdIglfFUQhmZ1KbDYsYGws07yWo88lMLTb4DUpRvgm91fsycXZ/nwYnzAJuJ0Tky7RkCSCBCCp9KlcU+njAdDYg/eXbN756v2P77vbec/EFxqB4dPXRiXxdJjHgZCIeOfNHlfaQTSycPHhy5EFDD/73UHXbf6FCR1+sGB61AcOC2FMWI/JfG9WU2K1KeTI+BuS0FEOr9fr2lQC1aSCKlXKKcYWqVS0U/u2aDkXKQJDo993C3Kvo9KkSONRO4/DYLcoCnlyxdHFqf4bVhEQTe4EE+JFj5LCo2aPV+D89+k87v1ez6YvRSvuxviMktU/kUqxkEyj9YAXF6vU8mDlsQTXVLNnkLzSZBTw7a/XjklCtxG8NF9dTG23BfemmFoYd913b/+gUYALOm4Cr92I9YOzBzzUYaU5Ypzw88b8E5KQgGJzwnOt3Lw1dv3mBBooCgKBCAQEMFGP+vBVP3i1bzRYzQi9FgLQqWgm4eAasB0Dr853GgVI4ICyVluCw2C3BQ9Ev3jdZhbgTwcL8OBiEcC94i1S1EIA5RhoN4Grz0PRwWGw+/bWhk0EbjHQrgIDNAvozvoaMBjsuqIggVtGAQxalsT9ZTClp+sAh8FuU82YaMnPG2hkDjhT+ZJAY6qcENUPKb4GFOiu/gblvx/qxldtnJwxRkACc+TfwBE8ro9Y49VMspgzRmCh+5F5SbgZxeMVgIBHLT1e+j94Hqqx3/i7rSdrFIAUSUmYCQX3elUJVnu6DANnD7hOmCTAZcxA8SpS+TzADqclUd6/cCXENg/qIeA1h0EdOGru35auSKtYlQJ++HBgRQKXgmGtH5w94KGppEhRCfHB1ru9v1kLAADKi1cYuON/2IgCrqxmkcAJkrAWc3FOx6kVsPhR/7okOmv9TkcBHvKgbgNejtaZjbd7tS99SWcoj/vHf7zAgl4IHO5Qm14w2Ospw1JwuvDmgxNhfMY3c9f//Hlcgj9TPV3VVpD6Pa4qw0z8ZaHl9xdNfMYIAMDhscz+WOu+WUl4Agi09+geL62st9MXTmvbKaQOG1/uGiMAAKtTic1D/2w9xcAF7R6w8LhlGU47ravDNvAlP0Qb97z80ykwzjPQoTwy++ZgsHsieRvM4+5bfbNReKwi4B1/vPPQ5Vie+lhgUgLbqjIb7K6hHt+WROfdFqcvKjzQ4I98B19a6nKEnADRKMBHbCLi8fhNJkxLQhqvq5vUrguojBSLuzaXE8zyhEsYBKiXi79aFn9mFcgxY4UZy5KQkaA5tPZkVWebvbE39ka08S8oPLE2P4bQtwAAAABJRU5ErkJggg==';
    let redCircle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADXElEQVRoge2Zz2scZRzGn+edLWxQCV6sFVupihuvdv+CeBdiy0JrkpKLaCx6KD2IDb7QioJS2qIN1UNpFwUXTcS78Q8w7dXUQ0qrqDnVHxUHdud9PDQ9OPPuzryT3Wmg+Ry/7/fd+TzMzM7M+wI77PBgw2H8iKw12F9rgpgUXBPgcwCeBPDQZss/AH4BcZ3iVQgruNFbpbVuq8feUgC139vj5N4gMAtgb+D0WwLahuYTzrzzW1mHUgH0+fuPuqRrCb4KoF724JvEgj41iXuXc/aP0MnBAXTl1MsCFgE8Fjo3hw0C85xdWAqZVDiAOp3IxWtnCL4Z7lYcCefMWOM4W62kSH+hALpk66qZLyBObU2vINQye+4I52yc12ryGtTpRKpF7crkAUCckom+1Pe2lteaG8DFa2cgHBqOWQDES+5n82F+2wA2b9ivh2cVjCge5NGTy/0a+gZQ54Nxxd0fAewZiVpxNhjVnucrb9/2Dfa9hFzcPYX7Lw8Au13Stf0GvWdAl+zjiqJ1AGOjsgok5q7kGR62v6YHvGfARdExbB95AKi7bjTvG8gEkLWGwMzoncIgMC1rM77ZM7C/1gSwrwqpQJ7C07UX0sVsAOrFSnTKMZkuZC8h6EA1LuEIaqZrnpuYjSpkSjKRLvj+hZ6oQKQsmeeSL8DDFYiU5ZF0IfdlbrvjC3Cncovi/J0u+AJkHtfbiMzHvyeArldhUpK1dCETgODValzCIbiarmXPgPhdJTblWEkXsgFu9FYB3KrCJpCbWO9dSxezl5C1TkC7GqfiCGr7liK9zwGTJB8D+HfkVsWJzS636BvwBuCc/V3QZ6N1Ko6Ei76vMWDAk9gYtwDP/+59YMO4xPYb7BuA0/YvAscAaBRWBRGJ1wYt+g58F+LswpKE88P3KoaAs5xZ+GZQT+7LnBlrHAfx1fC0CiJ8a+qNE3ltuQHYaiW8PT4Nqu/q2AhY4p/jrSIr1KHL6x8RfCtkXiAScNbUGyeGurz+vyNcPj0lahHA7mC9wWxQfH3QOqiP4A8aHj25zCSZEHQeQO76fQFiCeeYJBOh8sBQNvmSeYKzCF9LuimobRhdqHyTL42sNXjWHIA4KaAJ4d42673v6zu4u836E8UfAKxgvXdtGNusO+zwoPMfinkPENdCPQgAAAAASUVORK5CYII=';
    let greenCircle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADlUlEQVRoge2ZTWwbRRiG33e3sWM7Fe6FUtQSVaghXGjSWogr4Y4UfnIo/ZGFhCBUuVQcEStxRCptBFSFQ4QsQESQIO6kd3BLygWKEVV/BOTUiLrxrirPy4FISLtr745jL5Ga5/jNN97nkz3emW+AHXZ4sGE/PsSTnIOtqxVDMwU6FciMgdwPobT5lHuQbpO8JumyI2fleuFw3SPNVp+9pQJq9+r77jvum4ROAjxgOf2mgNqQaX94olT5s1eHngr4bP2nPUHOeCReAzTc68M3FXwJHzPQO9U9k+vWs20nLGysvgDqAoCHbecmsAZxtlqcWLKZlLqARS26zdbYWVJz9m4WCOdLhcaZGc6006SnKmBBl4YVlD+nML01u3SIWGZ+/ViVz/pJuU5SwqIWXQblWlbyAEBhWq3yl54u7UrKTSyg2Ro7K+Gl/qilh8Tzo0H5vcS8boObC/br/mlZI0d88VRxYrlTQscCLqr+UM53fwawbyBq6VnLBe6Tr5SfuhM32PEnlGvtehf/vzwA7A1yxus0GPsNLDS/fwTu0O8ACoOysoO+MebxV0tH/giPxH4DcodOY9vIA4CG6XA2biRSgCc5BE4MXsoOAsc9KeIbCRxsXa0AeCwTKztGD2z8eCQcjBTQpp7Lxscel5wKxyIFkDyajY49clAJx6IFSE9ko9MD0ng4FClAwKPZ2NhDMPJeivsbHcnApScE7A7HEjdz2524ApqZW6SEwN1wLLqIgcjrersgKHL4jy5i8lo2Oj1A/hIORQuQLmdjYw8N6uFYpABX/C4bHXva0ko4FingeuFwHcDNTIzsuHGrOHklHIzuRkkjoJaNU3oI1eJakbHvAbbvfwCgNXCr1NBvG1yIG4ktoDry9F8SPxmslAXSxbjTGNDtTFzw3wbQc9O1j6whgNdpsGMBx/nM3xBPA9AgrFIiGLzerenbdS9ULU4sQZjvv1c6SJyrlia/6ZaTuJkrFRpnSHzVP610SPi2mG+8lZSXqrk7r0Z+JGh+kVl/lFq6m999bI6HgqTUVNvpOR4KRvKNl0Gcw2DXhEi8X8r/NpNGHujhguPTjdVp8+8Fx15rve6sOeIb3fqgcVgfaE4VJ5bhY1ziPMDE/n0y9CGch49xW3mgD5d8bceZFXgS9r2kG4RqrjEfZX7JF8aTnNGN1aMgp+ioIoMxEPvx3/m6CeE2HfwKgx/a0sqt4uSVflyz7rDDg84/KB4mhRttl6cAAAAASUVORK5CYII=';
    return (


      <div>

        <div className="dashBoardContainer">

          {/* START HEAD PANEL */}
          <div className="head-panel">
            <div className='head-part'>
              <Button type="primary" className='bidding-btn' onClick={() => this.props.history.push('/dashboard3')}>Панель пилота</Button>
              {/*<span className="dots" />*/}

              <div className='bidding-info'>
                <span className='bidding-info--start'>Старт подачи</span>
                <span className='bidding-info--finish'>Финиш подачи</span>
              </div>
              <div className='bidding-date'>
                <span className='bidding-date--digit'>23.08.2020</span>
                <span className='bidding-date--digit'>23.08.2020</span>
              </div>
              <div className='date-clock'>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.0001 4.8148C8.48154 4.82996 4.81494 8.48298 4.81494 13C4.81494 17.517 8.48154 21.17 13.0001 21.1852V4.8148Z"
                    fill="#FFDE84" />
                  <path
                    d="M13.0001 25.6905C6.00481 25.6905 0.30957 19.9953 0.30957 13C0.30957 6.00477 6.00481 0.309525 13.0001 0.309525C19.0667 0.309525 24.2977 4.62739 25.4584 10.5702C25.6132 11.3595 25.6905 12.1798 25.6905 13C25.6905 19.9953 19.9953 25.6905 13.0001 25.6905ZM13.0001 1.74881C6.7941 1.74881 1.74886 6.79405 1.74886 13C1.74886 19.206 6.7941 24.2512 13.0001 24.2512C19.206 24.2512 24.2512 19.206 24.2512 13C24.2512 12.2726 24.1893 11.5452 24.0501 10.8488C23.0132 5.57143 18.3703 1.74881 13.0001 1.74881Z"
                    fill="#5459CD" />
                  <path
                    d="M13 26C5.83453 26 0 20.1655 0 13C0 5.83453 5.83453 0 13 0C19.206 0 24.5762 4.42619 25.7679 10.5083C25.9226 11.3286 26 12.1643 26 13C26 20.1655 20.1655 26 13 26ZM13 0.619048C6.175 0.619048 0.619048 6.175 0.619048 13C0.619048 19.825 6.175 25.381 13 25.381C19.825 25.381 25.381 19.825 25.381 13C25.381 12.1952 25.3036 11.406 25.1488 10.6321C24.0345 4.82857 18.9119 0.619048 13 0.619048ZM13 24.5607C6.62381 24.5607 1.43929 19.3762 1.43929 13C1.43929 6.62381 6.62381 1.43929 13 1.43929C18.525 1.43929 23.2917 5.37024 24.3441 10.7714C24.4833 11.4988 24.5607 12.2417 24.5607 12.9845C24.5607 19.3762 19.3762 24.5607 13 24.5607ZM13 2.05833C6.96429 2.05833 2.05833 6.96429 2.05833 13C2.05833 19.0357 6.96429 23.9417 13 23.9417C19.0357 23.9417 23.9417 19.0357 23.9417 13C23.9417 12.2881 23.8798 11.5917 23.7405 10.9107C22.7345 5.7881 18.231 2.05833 13 2.05833Z"
                    fill="#5459CD" />
                  <path
                    d="M19.8874 15.4762H12.9231C11.9326 15.4762 11.1433 14.6869 11.1433 13.6964V4.56547C11.1433 3.93095 11.6695 3.40475 12.304 3.40475C12.9385 3.40475 13.4647 3.93095 13.4647 4.56547V13.1548H19.8874C20.5219 13.1548 21.0481 13.681 21.0481 14.3155C21.0481 14.95 20.5219 15.4762 19.8874 15.4762Z"
                    fill="#5459CD" />
                  <path
                    d="M13.0003 16.0953C14.7097 16.0953 16.0955 14.7095 16.0955 13C16.0955 11.2906 14.7097 9.90477 13.0003 9.90477C11.2908 9.90477 9.90503 11.2906 9.90503 13C9.90503 14.7095 11.2908 16.0953 13.0003 16.0953Z"
                    fill="#5459CD" />
                </svg>
              </div>
            </div>
            <div className='head-part'>
              <div className='bidding-stats'>
                <span className='bidding-stats--first'>
                  70
                  </span>
                  /
                  <span className='bidding-stats--second'>
                  30
                  </span>%
                </div>
              <div className='stats-icon'>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d)">
                    <path
                      d="M33 20C33 27.1792 27.1792 33 20 33C12.8208 33 7 27.1792 7 20C7 12.8208 12.8208 7 20 7C26.3247 7 31.5978 11.5208 32.759 17.5096C32.9197 18.3129 33 19.1455 33 20Z"
                      fill="#5459CD" />
                  </g>
                  <g filter="url(#filter1_d)">
                    <path
                      d="M33 18.0087C26.593 19.5005 20 21 20 21V7C26.4442 7 31.8168 11.7355 33 18.0087Z"
                      fill="#FFDE84" />
                  </g>
                  <defs>
                    <filter id="filter0_d" x="0" y="0" width="40" height="40"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset />
                      <feGaussianBlur stdDeviation="3.5" />
                      <feColorMatrix type="matrix"
                        values="0 0 0 0 0.328368 0 0 0 0 0.3474 0 0 0 0 0.804167 0 0 0 0.1 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix"
                        result="effect1_dropShadow" />
                      <feBlend mode="normal" in="SourceGraphic"
                        in2="effect1_dropShadow" result="shape" />
                    </filter>
                    <filter id="filter1_d" x="13" y="0" width="27" height="28"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset />
                      <feGaussianBlur stdDeviation="3.5" />
                      <feColorMatrix type="matrix"
                        values="0 0 0 0 0.328368 0 0 0 0 0.3474 0 0 0 0 0.804167 0 0 0 0.1 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix"
                        result="effect1_dropShadow" />
                      <feBlend mode="normal" in="SourceGraphic"
                        in2="effect1_dropShadow" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
              {/* <Popover content={content} placement="bottom"> */}
              <Avatar
                className="user-avatar"
                size="large"
                shape="square"
                icon="user"
                src="https://img.icons8.com/bubbles/50/000000/short-curly-hair-lady-with-red-glasses.png"
              />
              {/* </Popover> */}
              {/* <Popover content={content} placement="bottom"> */}
              <div className='user-info'>
                <span className='user-info--name'>{this.props.user &&
                  this.props.user.firstName}</span>
                <span className='user-info--name'>{this.props.user &&
                  this.props.user.lastName}</span>
              </div>
              {/* </Popover> */}
              <Popover content={content} placement="bottom">
                <div className="user-more">
                  <svg width="4" height="14" viewBox="0 0 4 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="2" fill="#686CD7" />
                    <circle cx="2" cy="7" r="2" fill="#686CD7" />
                    <circle cx="2" cy="12" r="2" fill="#686CD7" />
                  </svg>
                </div>
              </Popover>
            </div>
          </div>
          {/* END HEAD PANEL */}

          {(this.state.loading || !this.props.users) && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Spin size="small" tip="Загрузка..." />
            </div>
          )}

        </div>
        <div className="dashBoardContainer">
          <div className="dashBoardContentDataLeans">
            <div>
              <Radio.Group onChange={this.onChangeIframe} value={this.state.valueIframe}>
                <Radio value={1}>Информация о пилотах</Radio>
                <Radio value={2}>Статистика истории заявок</Radio>

              </Radio.Group>
            </div>
            {this.state.valueIframe === 1 &&
              <Iframe className='iframe' url="https://datalens.yandex/u45zuwto2g02p" width="100%" height={window.innerHeight - 70} />
            }
            {this.state.valueIframe === 2 &&
              <Iframe className='iframe' url="https://datalens.yandex/z8qygi47ww50u?_embedded=1&tab=N6&_theme=dark" width="100%" height={window.innerHeight - 70} />
            }
          </div>
        </div>


        <footer className='footer-users'
                align={'center'}>
          <p>Зарегистрировано пользователей IBMiX : {this.state.usersLength}</p>

          <div dangerouslySetInnerHTML={{ __html: this.ym() }} />
        </footer>
      </div>


    );
  }
}

function mapStateToProps(store) {
  return {
    users: store.usersDashBoard,
    user: store.user,
    priority_list_for_application: store.priority,
    flight_direction: store.flight_direction,
    daytime: store.daytime,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addUser: user => {
      dispatch(AddUserAC(user));
    },
    addPhotos: photos => {
      dispatch(AddPhotoAC(photos));
    },
    AddUsersDashBoard: users => {
      dispatch(AddUsersDashBoard(users));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoardCommander);