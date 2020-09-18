import React, { Suspense, Component } from 'react';
import plane from '../images/plane.jpg';
import Iframe from 'react-iframe'

import team from '../images/CEO3.jpg';
import github from '../images/github.png';
import inst from '../images/inst.png';
import npm from '../images/npm.png';
import moment from 'moment';
import ItemList from '../components/DnD/itemList';
import ItemList_day from '../components/DnD_day/itemList';
import { UncontrolledCollapse, Button as Buttonr, CardBody, Card as Cardr, Collapse as Collapser } from 'reactstrap';
import Calendar from './Calendar'
import CalendarWithButtons from './CalendarWithButtons';
import RadioButtonList from './lineFlight/RadioButtonList';
import RadioButtonList_WorkDay from './WorkTime/RadioButtonList';
import { data_work_time } from './WorkTime/radio_data';
import { data_work_day } from './WorkDay/radio_data';
import RadioButtonList_WorkTime from './WorkDay/RadioButtonList';

import WOW from 'wowjs';

import Profile from './Profile';

import { Popover, Tabs } from 'antd';
import {
  Card,
  Modal,
  Avatar,
  Icon,
  notification,
  message,
  Spin,
  Switch,
  Button,
  Carousel, Slider, Select, Badge, Form, Collapse,
  Tag,
  Alert,
  Checkbox,
} from 'antd';
import { connect } from 'react-redux';
import { AddPhotoAC, AddUserAC, AddUsersDashBoard, SetPriority, SetFlightDirection, SetDayTime } from '../redux/action';
import './DashBoard.css';

function handleChange(value) {
  console.log(`selected ${value}`);
}





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

// КНОПОЧКИ НА НАВИГАЦИОННОЙ ПАНЕЛИ
const content = (func) => {
  return (
    <div>
      {/* <p><a href="/profile">Профиль</a></p> */}
      {/* <p onClick={() => this.setState({modalProfileShow: !this.state.modalProfileShow})}>{this.state.modalProfileShow.toSring()}</p> */}
      {/* <p onClick={() => this.setState({modalProfileShow: !this.state.modalProfileShow})}>Профиль</p> */}
      <p onClick={() => func()}><a href='#'>Профиль</a></p>
      <p><a href="/logout">Выйти</a></p>
    </div>
  );
}


const rulesCount = (
  <div>
    <p><b><u>Коэффициент вероятности учета пожеланий</u></b> <br /> При увелечении количества преференций <br /> уменьшается  вероятность учета пожелания </p>

  </div >
);

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaTags: [],

      modalUser: null,
      modalProfileShow: false,
      loading: false,
      visibleSort: false,
      showLongWork: true,
      showShortWork: true,
      minTime: 0,
      maxTime: 24,
      minDifficulty: 0,
      maxDifficulty: 10,
      cities: null,
      visible: false,
      visible2: false,
      visible4: false,
      flagVisit: false,
      usersLength: null,
      newWish: false,
      preference: false,
      preference1: true,
      preference2: false,
      preference3: false,
      preference4: false,
      preference5: false,
      preference6: false,
      selectedDates: [],
      checkboxTransAir: false,
      colorTransAir: 'white',
      checkboxContinent: false,
      colorContinent: 'white',
      checkboxWork: false,
      colorWork: 'white',
      checkboxLaziness: false,
      colorLaziness: 'white',
      checkboxLongDay: false,
      colorLongDay: 'white',
      checkboxEasyDay: false,
      colorEasyDay: 'white',
      checkboxTransAirCoontinent: false,
      checkboxWorkLaziness: false,
      checkboxLongDayEasyDay: false,
      data: [],
      timeDay: [],
      newWishForm: [],
      citiesSort: [],
      showSortFilters: false,
    };
  }

  showModal = user => {

    this.setState({
      modalUser: {
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
      showSortFilters: !this.state.showSortFilters,
    });
  };

  async componentDidMount() {
    new WOW.WOW().init();
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

    const allCities = await fetch('/api/getCities', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const cities = await allCities;
    const citiesRes = await cities.json()

    this.setState({ cities: citiesRes.response });

    const response = await fetch('/api/profilePilot', {
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (result.response !== 'fail') {

      await this.props.addUser(result.response);

      if (result.response.flagVisit === false)
        this.setState({
          visible4: true,
        });

    }


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
    this.setState({ workingDays: this.getWorkingDays() });

    this.setState({
      newWishForm: this.props.user.wishForm,
    });
  }


  handleSubmit = async event => {
    event.preventDefault();
    // this.props.form.validateFields(async (err, values) => {
    // if (!err) {



    let longFly;
    // if (this.state.checkboxTransAir) {
    //   longFly = 'Трансатлантические'
    // } else if (this.state.checkboxContinent) {
    //   longFly = 'Континентальные'
    // } else if (!this.state.checkboxTransAir && !this.state.checkboxContinent) {
    //   longFly = 'Не заполнено'
    // }



    if (this.state.areaTags.length !== 0) {
      longFly = this.state.areaTags
    } else {
      longFly = 'Не заполнено'
    }

    let otherTime;
    if (this.state.checkboxWork) {
      otherTime = 'Хочу работать с переработками'
    } else if (this.state.checkboxLaziness) {
      otherTime = 'Переработки неприемлимы'
    } else if (!this.state.checkboxWork && !this.state.checkboxLaziness) {
      otherTime = 'Не заполнено'
    }

    let timeFly;
    if (this.state.checkboxLongDay) {
      timeFly = 'Длительная смена'
    } else if (this.state.checkboxEasyDay) {
      timeFly = 'Короткая смена'
    } else if (!this.state.checkboxLongDay && !this.state.checkboxEasyDay) {
      timeFly = 'Не заполнено'
    }

    let preferenceTimeFly;
    if (this.state.timeDay.length !== 0) {
      preferenceTimeFly = this.state.timeDay
    } else {
      preferenceTimeFly = ['Не заполнено']
    }

    let allPreference = this.state.data
    if (allPreference.length !== 0) {
      allPreference = this.state.allPreference
    } else {
      allPreference = ['Не заполнено']
    }


    let selectedDates = this.state.selectedDates
    if (selectedDates.length !== 0) {
      selectedDates = this.state.selectedDates
    } else {
      selectedDates = ['Не заполнено']
    }

    const wishForm = [{ longFly: longFly, otherTime: otherTime, timeFly, preferenceTimeFly, allPreference, selectedDates }]
    const response = await fetch('/newWishForm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.props.user.email,
        wishForm: wishForm
      })
    })

    const result = await response.json();

    if (result.response === 'success') {
      message.success(`Ваша заявка на полет успешно сохранена`, 5)
      this.setState({
        newWishForm: result.wishForm,
      })
      this.props.user.wishForm = result.wishForm
    }

    //     this.props.cookies.set('isLogin', true, { path: "/" });
    //     this.props.cookies.set('Role', result.crewRole, { path: "/" });
    //     this.props.addIsLogin(true);
    //     if (result.crewRole === 'командир отдельно на будещее') {

    //         this.setState({
    //             isRedirect: true,
    //             iconLoading: false,
    //             dashboard: "/dashboard3"
    //         })

    //     } else if (result.crewRole || result.crewRole !== 'командир отдельно на будещее') {
    //         this.setState({
    //             isRedirect: true,
    //             iconLoading: false,
    //             dashboard: "/dashboard3"
    //         })
    //     }

    // } else {
    //     openNotification('topRight', 'warning', 'Warning', 'Неверный email и пароль, пожалуйста попробуйте еще раз!')
    //     this.setState({ iconLoading: false })
    // }
    // }
    // })
  };

  showDiagram = (flag1, flag2, flag3, flag4) => {
    let arr = [flag1, flag2, flag3, flag4]
    let count1 = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === true) {
        count1++
      }
    }

    if (count1 === 0) {
      return { text: 'к сожалению, ни одна преференция не удовлетворена' }
    } else if (count1 === 1) {
      return { text: 'удовлетворено 25% преференций' }
    } else if (count1 === 2) {
      return { text: 'удовлетворено 50% преференций' }
    } else if (count1 === 3) {
      return { text: 'удовлетворено 75% преференций' }
    } else if (count1 === 4) {
      return { text: 'удовлетворено 100% преференций' }
    }
  };


  onChangeLongWork = (checked) => {
    this.setState({ showLongWork: checked });
  };

  onChangeShortWork = (checked) => {
    this.setState({ showShortWork: checked });
  };

  onChangeTime = value => {
    this.setState({
      minTime: value[0],
      maxTime: value[1],
    });
  };

  onChangeDifficulty = value => {
    this.setState({
      minDifficulty: value[0],
      maxDifficulty: value[1],
    });
  };

  filterTime = (time) => {
    return this.state.minTime <= time && time <= this.state.maxTime;
  };

  tryam = () => {
    this.setState({
      visible2: true,
    });

  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel2 = e => {
    this.setState({
      visible2: false,
    });
  };


  handleCancel3 = () => {

    this.setState({
      visibleSort: false,
    });
  };

  handleCancel4 = async (e) => {
    this.setState({
      visible4: false,
    });

    const response = await fetch('/expierence/pilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.props.user.email,
      })
    })

    const result = await response.json();

  };

  getWorkingDays = () => {
    if (this.props.user.arrFlights) {
      let days = [];
      this.props.user.arrFlights.map((user, i) => {
        let year_month_day = user.time_of_departure.split('-', 9);
        days.push({
          year: parseInt(year_month_day[0]),
          month: parseInt(year_month_day[1]),
          day: parseInt(year_month_day[2]),
        });
      });
      return days;
    }
  };


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

  setSelectedDates = dates => {
    if (dates.length <= 3) {
      this.setState({ selectedDates: dates })
    }
    else {
      dates.shift();
      this.setState({ selectedDates: dates })
    }
  }

  step = () => {
    this.setState({
      preference: false,
      preference1: true,
      preference2: false,
      preference3: false,
      preference4: false,
      preference5: false,
    });
  };

  stepBack = () => {
    this.setState({
      preference: true,
      preference1: false,
      preference2: false,
      preference3: false,
      preference4: false,
      preference5: false,
    });
  };

  step3 = () => {

    this.setState({
      preference: false,
      preference1: false,
      preference2: true,
      preference3: false,
      preference4: false,
      preference5: false,
    });
  };

  step3Clear = () => {

    this.setState({
      preference: false,
      preference1: false,
      preference2: true,
      preference3: false,
      preference4: false,
      preference5: false,
      checkboxTransAir: false,
      colorTransAir: 'white',
      checkboxContinent: false,
      colorContinent: 'white',
      checkboxTransAirCoontinent: false,

    });
  };

  step4 = () => {

    this.setState({
      preference: false,
      preference1: false,
      preference2: false,
      preference3: true,
      preference4: false,
      preference5: false,
    });
  };

  step4Clear = () => {

    this.setState({
      preference: false,
      preference1: false,
      preference2: false,
      preference3: true,
      preference4: false,
      preference5: false,
      timeDay: []
    });
  };


  step5 = () => {

    this.setState({
      preference: false,
      preference1: false,
      preference2: false,
      preference3: false,
      preference4: true,
      preference5: false,
    });
  };

  step5Clear = () => {

    this.setState({
      preference: false,
      preference1: false,
      preference2: false,
      preference3: false,
      preference4: true,
      preference5: false,
      checkboxWork: false,
      colorWork: 'white',
      checkboxLaziness: false,
      colorLaziness: 'white',
      checkboxWorkLaziness: false
    });
  };

  step6 = () => {

    this.setState({
      preference: false,
      preference1: false,
      preference2: false,
      preference3: false,
      preference4: false,
      preference5: true,
      preference6: false,

    });
  };

  step6Clear = () => {

    this.setState({
      preference: false,
      preference1: false,
      preference2: false,
      preference3: false,
      preference4: false,
      preference5: true,
      checkboxLongDay: false,
      colorLongDay: 'white',
      checkboxEasyDay: false,
      colorEasyDay: 'white',
      checkboxLongDayEasyDay: false,

    });
  };

  mainPreference = (e) => {

  };

  timeDayPreference = (e) => {

    this.setState({
      timeDay: e
    });

  };

  checkboxTransAir = async (e) => {
    this.setState({
      checkboxTransAir: true,
      checkboxContinent: false,
      colorTransAir: 'rgb(180,244,209)',
      colorContinent: 'white',
      checkboxTransAirCoontinent: true

    });

    const reqComparison = await fetch('/api/getAirports', {

      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        reliabilityIndex: this.props.user.reliabilityIndex,
      }),
    });
    let cities = await reqComparison.json();
    this.setState({
      cities: []
    });
    this.setState({
      cities: cities.response
    });
  };

  checkboxContinent = async (e) => {

    this.setState({
      checkboxTransAir: false,
      checkboxContinent: true,
      colorContinent: 'rgb(180,244,209)',
      colorTransAir: 'white',
      checkboxTransAirCoontinent: true

    });

    const reqComparison = await fetch('/api/getAirports/russia', {

      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        reliabilityIndex: this.props.user.reliabilityIndex,
      }),
    });
    let cities = await reqComparison.json();
    this.setState({
      cities: cities.response
    });


  };



  checkboxWork = (e) => {
    this.setState({
      checkboxWork: true,
      checkboxLaziness: false,
      colorWork: 'rgb(180,244,209)',
      colorLaziness: 'white',
      checkboxWorkLaziness: true
    });
  };

  checkboxLaziness = (e) => {
    this.setState({
      checkboxWork: false,
      checkboxLaziness: true,
      colorWork: 'white',
      colorLaziness: 'rgb(180,244,209)',
      checkboxWorkLaziness: true
    });
  };

  checkboxLongDay = (e) => {
    this.setState({
      checkboxLongDay: true,
      checkboxEasyDay: false,
      colorLongDay: 'rgb(180,244,209)',
      colorEasyDay: 'white',
      checkboxLongDayEasyDay: true

    });
  };

  checkboxEasyDay = (e) => {
    this.setState({
      checkboxLongDay: false,
      checkboxEasyDay: true,
      colorLongDay: 'white',
      colorEasyDay: 'rgb(180,244,209)',
      checkboxLongDayEasyDay: true

    });
  };

  dataComponent = (flag) => {

    if (flag.target.value === 'clear') {
      this.setState({
        selectedDates: []
      });
    }

    let checkboxTransAirCoontinent = this.state.checkboxTransAirCoontinent

    let timeDay = this.state.timeDay

    let checkboxWorkLaziness = this.state.checkboxWorkLaziness

    let checkboxLongDayEasyDay = this.state.checkboxLongDayEasyDay

    let selectedDates = this.state.selectedDates

    let arrPreference = [checkboxTransAirCoontinent, timeDay, checkboxWorkLaziness, checkboxLongDayEasyDay, selectedDates]

    let arrData = []
    for (let i = 0; i < arrPreference.length; i++) {
      if (arrPreference[i] === true || (typeof arrPreference[i] === 'object' && arrPreference[i].length
        !== 0)) {
        if (i === 0) {
          arrData.push({ name: 'Направление\nполета', style: 'flight_direction' })
        }
        if (i === 1) {
          arrData.push({ name: "Время вылета", style: 'time_of_fly' })
        }
        if (i === 2) {
          arrData.push({ name: "Продолжительнсоть\nсмены", style: 'duration' })
        }
        if (i === 3) {
          arrData.push({
            name: "Желание работать\nс переработками", style: 'wish_to_work'
          })
        }
        if (i === 4 && flag.target.value !== 'clear') {
          arrData.push({ name: "Выбор выходных\nдней", style: 'weekends' })
        }
      }
    }

    this.setState({
      data: arrData,
      preference: false,
      preference1: false,
      preference2: false,
      preference3: false,
      preference4: false,
      preference5: false,
      preference6: true,

    });
  };

  handleSelect = (value) => {
    if (this.state.areaTags.length < 9) {
      let newStateArray = this.state.areaTags.slice();
      newStateArray.push(value)
      this.setState({ areaTags: newStateArray });
    }
  };

  handleSelectClear = (id) => {
    this.state.areaTags.splice(id, 1);
    this.setState({ areaTags: this.state.areaTags });
  };

  filterPrise = (budget) => {
    return this.state.minTime <= budget && budget <= this.state.maxTime;
  };

  filterCities = (city) => {
    let array = this.state.citiesSort;
    if (array.length === 0) {
      return city
    } else {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === city) {
          return city
        }
      }
    }
  };


  filterDifficulty = (level_flights) => {
    return this.state.minDifficulty <= level_flights && level_flights <= this.state.maxDifficulty;
  };


  handleChangeSort = (value) => {
    if (value.length === 0) {
      this.setState({ citiesSort: value })
    }
    this.setState({ citiesSort: value })

  };

  render() {
    const { TabPane } = Tabs;
    const { cities } = this.state;
    const userMainInfo = JSON.parse(localStorage.getItem('userMainInfo'));
    let searchFlag;
    const { getFieldDecorator } = this.props.form;
    let blueCircle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAE/ElEQVRoge2ZTWhcVRTH/+dmMklLI5KmaJp0IdokGjRgBrtucROlYBZDQ6PiQiIlKahbEabg10ZF7IQ2anGRgG1cKPixkdClhpkUlagJ1EUbU7VNEDMkZua9e1zM15v37n33vpnEjbkw5OUe3tzf/5xzz7nvDbA39sb/e9BOfEkyeaUJsQceY+LjDAxKoA9AJxMdYAAM5BhYBbAkibKS5dyxo4/Op1IkG127IQEjI/NHHIhxJnoahK4SLJgI1WvfX1D5eoVB000upb+eGVj5TwUkkwuHZBO/RoTnmBCPCO6bR56ILjlx59WrU4k7uy4gOZI5zSTeZ+L2RsBRuS7baQ2MiasfD3yyKwLGxjLN6xtikomfDwUPgFXnYLAzAGZc3Gp2zmanEoUdE3DyZGZ/vI0+ZWAoKjgshPkdIglfFUQhmZ1KbDYsYGws07yWo88lMLTb4DUpRvgm91fsycXZ/nwYnzAJuJ0Tky7RkCSCBCCp9KlcU+njAdDYg/eXbN756v2P77vbec/EFxqB4dPXRiXxdJjHgZCIeOfNHlfaQTSycPHhy5EFDD/73UHXbf6FCR1+sGB61AcOC2FMWI/JfG9WU2K1KeTI+BuS0FEOr9fr2lQC1aSCKlXKKcYWqVS0U/u2aDkXKQJDo993C3Kvo9KkSONRO4/DYLcoCnlyxdHFqf4bVhEQTe4EE+JFj5LCo2aPV+D89+k87v1ez6YvRSvuxviMktU/kUqxkEyj9YAXF6vU8mDlsQTXVLNnkLzSZBTw7a/XjklCtxG8NF9dTG23BfemmFoYd913b/+gUYALOm4Cr92I9YOzBzzUYaU5Ypzw88b8E5KQgGJzwnOt3Lw1dv3mBBooCgKBCAQEMFGP+vBVP3i1bzRYzQi9FgLQqWgm4eAasB0Dr853GgVI4ICyVluCw2C3BQ9Ev3jdZhbgTwcL8OBiEcC94i1S1EIA5RhoN4Grz0PRwWGw+/bWhk0EbjHQrgIDNAvozvoaMBjsuqIggVtGAQxalsT9ZTClp+sAh8FuU82YaMnPG2hkDjhT+ZJAY6qcENUPKb4GFOiu/gblvx/qxldtnJwxRkACc+TfwBE8ro9Y49VMspgzRmCh+5F5SbgZxeMVgIBHLT1e+j94Hqqx3/i7rSdrFIAUSUmYCQX3elUJVnu6DANnD7hOmCTAZcxA8SpS+TzADqclUd6/cCXENg/qIeA1h0EdOGru35auSKtYlQJ++HBgRQKXgmGtH5w94KGppEhRCfHB1ru9v1kLAADKi1cYuON/2IgCrqxmkcAJkrAWc3FOx6kVsPhR/7okOmv9TkcBHvKgbgNejtaZjbd7tS99SWcoj/vHf7zAgl4IHO5Qm14w2Ospw1JwuvDmgxNhfMY3c9f//Hlcgj9TPV3VVpD6Pa4qw0z8ZaHl9xdNfMYIAMDhscz+WOu+WUl4Agi09+geL62st9MXTmvbKaQOG1/uGiMAAKtTic1D/2w9xcAF7R6w8LhlGU47ravDNvAlP0Qb97z80ykwzjPQoTwy++ZgsHsieRvM4+5bfbNReKwi4B1/vPPQ5Vie+lhgUgLbqjIb7K6hHt+WROfdFqcvKjzQ4I98B19a6nKEnADRKMBHbCLi8fhNJkxLQhqvq5vUrguojBSLuzaXE8zyhEsYBKiXi79aFn9mFcgxY4UZy5KQkaA5tPZkVWebvbE39ka08S8oPLE2P4bQtwAAAABJRU5ErkJggg==';
    let redCircle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADXElEQVRoge2Zz2scZRzGn+edLWxQCV6sFVupihuvdv+CeBdiy0JrkpKLaCx6KD2IDb7QioJS2qIN1UNpFwUXTcS78Q8w7dXUQ0qrqDnVHxUHdud9PDQ9OPPuzryT3Wmg+Ry/7/fd+TzMzM7M+wI77PBgw2H8iKw12F9rgpgUXBPgcwCeBPDQZss/AH4BcZ3iVQgruNFbpbVuq8feUgC139vj5N4gMAtgb+D0WwLahuYTzrzzW1mHUgH0+fuPuqRrCb4KoF724JvEgj41iXuXc/aP0MnBAXTl1MsCFgE8Fjo3hw0C85xdWAqZVDiAOp3IxWtnCL4Z7lYcCefMWOM4W62kSH+hALpk66qZLyBObU2vINQye+4I52yc12ryGtTpRKpF7crkAUCckom+1Pe2lteaG8DFa2cgHBqOWQDES+5n82F+2wA2b9ivh2cVjCge5NGTy/0a+gZQ54Nxxd0fAewZiVpxNhjVnucrb9/2Dfa9hFzcPYX7Lw8Au13Stf0GvWdAl+zjiqJ1AGOjsgok5q7kGR62v6YHvGfARdExbB95AKi7bjTvG8gEkLWGwMzoncIgMC1rM77ZM7C/1gSwrwqpQJ7C07UX0sVsAOrFSnTKMZkuZC8h6EA1LuEIaqZrnpuYjSpkSjKRLvj+hZ6oQKQsmeeSL8DDFYiU5ZF0IfdlbrvjC3Cncovi/J0u+AJkHtfbiMzHvyeArldhUpK1dCETgODValzCIbiarmXPgPhdJTblWEkXsgFu9FYB3KrCJpCbWO9dSxezl5C1TkC7GqfiCGr7liK9zwGTJB8D+HfkVsWJzS636BvwBuCc/V3QZ6N1Ko6Ei76vMWDAk9gYtwDP/+59YMO4xPYb7BuA0/YvAscAaBRWBRGJ1wYt+g58F+LswpKE88P3KoaAs5xZ+GZQT+7LnBlrHAfx1fC0CiJ8a+qNE3ltuQHYaiW8PT4Nqu/q2AhY4p/jrSIr1KHL6x8RfCtkXiAScNbUGyeGurz+vyNcPj0lahHA7mC9wWxQfH3QOqiP4A8aHj25zCSZEHQeQO76fQFiCeeYJBOh8sBQNvmSeYKzCF9LuimobRhdqHyTL42sNXjWHIA4KaAJ4d42673v6zu4u836E8UfAKxgvXdtGNusO+zwoPMfinkPENdCPQgAAAAASUVORK5CYII=';
    let greenCircle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADlUlEQVRoge2ZTWwbRRiG33e3sWM7Fe6FUtQSVaghXGjSWogr4Y4UfnIo/ZGFhCBUuVQcEStxRCptBFSFQ4QsQESQIO6kd3BLygWKEVV/BOTUiLrxrirPy4FISLtr745jL5Ga5/jNN97nkz3emW+AHXZ4sGE/PsSTnIOtqxVDMwU6FciMgdwPobT5lHuQbpO8JumyI2fleuFw3SPNVp+9pQJq9+r77jvum4ROAjxgOf2mgNqQaX94olT5s1eHngr4bP2nPUHOeCReAzTc68M3FXwJHzPQO9U9k+vWs20nLGysvgDqAoCHbecmsAZxtlqcWLKZlLqARS26zdbYWVJz9m4WCOdLhcaZGc6006SnKmBBl4YVlD+nML01u3SIWGZ+/ViVz/pJuU5SwqIWXQblWlbyAEBhWq3yl54u7UrKTSyg2Ro7K+Gl/qilh8Tzo0H5vcS8boObC/br/mlZI0d88VRxYrlTQscCLqr+UM53fwawbyBq6VnLBe6Tr5SfuhM32PEnlGvtehf/vzwA7A1yxus0GPsNLDS/fwTu0O8ACoOysoO+MebxV0tH/giPxH4DcodOY9vIA4CG6XA2biRSgCc5BE4MXsoOAsc9KeIbCRxsXa0AeCwTKztGD2z8eCQcjBTQpp7Lxscel5wKxyIFkDyajY49clAJx6IFSE9ko9MD0ng4FClAwKPZ2NhDMPJeivsbHcnApScE7A7HEjdz2524ApqZW6SEwN1wLLqIgcjrersgKHL4jy5i8lo2Oj1A/hIORQuQLmdjYw8N6uFYpABX/C4bHXva0ko4FingeuFwHcDNTIzsuHGrOHklHIzuRkkjoJaNU3oI1eJakbHvAbbvfwCgNXCr1NBvG1yIG4ktoDry9F8SPxmslAXSxbjTGNDtTFzw3wbQc9O1j6whgNdpsGMBx/nM3xBPA9AgrFIiGLzerenbdS9ULU4sQZjvv1c6SJyrlia/6ZaTuJkrFRpnSHzVP610SPi2mG+8lZSXqrk7r0Z+JGh+kVl/lFq6m999bI6HgqTUVNvpOR4KRvKNl0Gcw2DXhEi8X8r/NpNGHujhguPTjdVp8+8Fx15rve6sOeIb3fqgcVgfaE4VJ5bhY1ziPMDE/n0y9CGch49xW3mgD5d8bceZFXgS9r2kG4RqrjEfZX7JF8aTnNGN1aMgp+ioIoMxEPvx3/m6CeE2HfwKgx/a0sqt4uSVflyz7rDDg84/KB4mhRttl6cAAAAASUVORK5CYII=';

    let onePreference;
    if (this.state.checkboxTransAir || this.state.checkboxContinent) {
      onePreference = 15
    } else {
      onePreference = 0
    }

    let cityPreference = 0;
    if (this.state.areaTags.length === 1) {
      cityPreference = 5
    } else if (this.state.areaTags.length === 2) {
      cityPreference = 10
    } else if (this.state.areaTags.length === 3) {
      cityPreference = 15
    } else if (this.state.areaTags.length === 4) {
      cityPreference = 20
    } else if (this.state.areaTags.length === 5) {
      cityPreference = 25
    } else if (this.state.areaTags.length === 6) {
      cityPreference = 30
    } else if (this.state.areaTags.length === 7) {
      cityPreference = 35
    } else if (this.state.areaTags.length === 8) {
      cityPreference = 40
    } else if (this.state.areaTags.length === 9) {
      cityPreference = 40
    }

    let twoPreference;
    if (this.state.timeDay.length !== 0) {
      twoPreference = 15;
    } else {
      twoPreference = 0;
    }

    let thirdPreference;

    if (this.state.checkboxWork || this.state.checkboxLaziness) {
      thirdPreference = 15
    } else {
      thirdPreference = 0
    }

    let fourthPreference;
    if (this.state.checkboxLongDay || this.state.checkboxEasyDay) {
      fourthPreference = 15
    } else {
      fourthPreference = 0
    }

    let fithPreference;
    if (this.state.selectedDates.length !== 0) {
      fithPreference = 15
    } else {
      fithPreference = 0
    }

    let points = 100 - cityPreference - twoPreference - thirdPreference - fourthPreference - fithPreference;

    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let first = new Date(y, m, 1);
    let last = new Date(y, m + 1, 0);

    let firstDay = moment(first).format('MM / DD / YYYY');
    let lastDay = moment(last).format('MM / DD / YYYY');

    return (


      <div>

        <div className="dashBoardContainer">
          {(this.state.loading || !this.props.users) && (
            <div className='progress-page'>
              <Spin size="small" tip="Загрузка..." />
            </div>
          )}
          {/* START HEAD PANEL */}
          <div className="head-panel">
            <div className='head-part'>
              <Button type="primary" className='bidding-btn' onClick={this.onNewWishList}>Новая заявка</Button>
              {/* {(this.props.user.crewRole === 'командир') && <Button type="primary" className='bidding-btn' onClick={() => this.props.history.push('/dashboardC')}>Аналитика</Button>} */}
              {/*<span className="dots" />*/}

              <div className='bidding-info'>
                <span className='bidding-info--start'>Старт подачи</span>
                <span className='bidding-info--finish'>Финиш подачи</span>
              </div>
              <div className='bidding-date'>
                <span className='bidding-date--digit'>{firstDay}</span>
                <span className='bidding-date--digit'>{lastDay}</span>
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


              {(this.props.user.crewRole === 'командир') &&
                <div className='stats-icon' onClick={() => this.props.history.push('/dashboardC')}>
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
              }

              {(this.props.user.crewRole === 'КВС') &&
                <div className='stats-icon' onClick={() => this.props.history.push('/dashboardC')}>
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
              }

              {/* Модальное окно профиля */}
              <Profile isOpen={this.state.modalProfileShow} closeFunc={() => this.setState({ modalProfileShow: !this.state.modalProfileShow })} />
              {/* Модальное окно профиля конец */}

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
              <Popover content={content(() => {
                this.setState({ modalProfileShow: !this.state.modalProfileShow });
              })} placement="bottom">
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


          <div className='modalWidth'>
            <Modal
              width='700px'
              title="Фильтрация расписания рейсов"
              visible={this.state.visibleSort}
              onCancel={this.handleCancel3}
              footer={[]}
            >
              <div style={{ textAlign: 'center' }}>
                <div className="dashBoardContainerMoreFiltres">
                  <div className="dashBoardContentMoreFiltres">
                    <Card size="small" title="Время полета" className="userCardFilterSort">
                      <div style={{ marginLeft: 'auto', marginRight: 'auto', width: 'auto' }}>
                        <Slider range value={[this.state.minTime, this.state.maxTime]} max={24}
                          onChange={this.onChangeTime}
                          defaultValue={[this.state.minTime, this.state.maxTime]}
                          marks={{ 0: 'ч', 24: 'ч.' }} />
                      </div>
                    </Card>
                    <Card size="small" title="Город"
                      className="userCardFilterSort"
                    >
                      <Select
                        mode="multiple"
                        style={{ width: '50%' }}
                        placeholder="Приоритетный город"
                        // defaultValue={['china']}
                        onChange={handleChange}
                      // optionLabelProp="label"
                      >

                        {this.state.cities && this.state.cities.map(city => (
                          <Option value={city.cityName} key={city.cityName}>
                            <div className="demo-option-label-item">
                              {city.cityName}
                            </div>
                          </Option>
                        ))}

                      </Select>

                    </Card>
                    <Card size="small" title="Время полета" className="userCardFilterSort">
                      <div style={{ marginLeft: 'auto', marginRight: 'auto', width: 'auto' }}>
                        <Slider range value={[this.state.minPrice, this.state.maxPrice]} max={24}
                          onChange={this.onChangeTime}
                          defaultValue={[this.state.minTime, this.state.maxTime]}
                          marks={{ 0: 'ч', 24: 'ч.' }} />
                      </div>
                    </Card>


                  </div>
                </div>
              </div>
            </Modal>
          </div>

        </div>

        {
          (this.state.newWish && this.state.preference)
          && (
            <div className="dashBoardContainer">
              <div className="dashBoardContentDrag borderDesign">
                <Card
                  size="small"
                  bordered={false}
                  className="userCardSlider"
                >
                  <div className='newForm'>Новая Заявка &nbsp;
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z"
                        fill="#282828"
                      />
                      <path
                        d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z"
                        fill="#282828"
                      />
                    </svg>
                    <span className='newForm2'>
                      &nbsp;&nbsp;&nbsp; 1. Приоритет заявки</span> &nbsp;&nbsp;&nbsp;
                      <span className='newForm3'>Переместите бокс по приоритету</span>
                  </div>
                  <div style={{ textAlign: 'left', height: '300px' }}>
                    {/* <ItemList />
                                         */}
                  Здесь можно указать основную информацию о правилах заведения новой заявки для новых пользователей
                  </div>
                  <Button
                    type="primary"
                    className='bidding-btn-step--skip'
                    onClick={this.step}
                  >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.9996 3.99972L8.25842 0.214007C7.97607 -0.0717068 7.53489 -0.0717068 7.25254 0.214007C6.97018 0.499722 6.97018 0.946149 7.25254 1.23186L10.0055 4.01758L7.25254 6.78544C6.97018 7.07115 6.97018 7.51758 7.25254 7.80329C7.53489 8.08901 7.97607 8.08901 8.25842 7.80329L11.9996 3.99972Z" fill="black" />
                      <path d="M3.68824 3.28578H0.705882C0.317647 3.28578 0 3.60721 0 4.00007C0 4.39293 0.317647 4.71436 0.705882 4.71436H3.68824C4.07647 4.71436 4.39412 4.39293 4.39412 4.00007C4.39412 3.60721 4.07647 3.28578 3.68824 3.28578Z" fill="black" />
                      <path d="M10.9419 3.28578H6.65364C6.2654 3.28578 5.94775 3.60721 5.94775 4.00007C5.94775 4.39293 6.2654 4.71436 6.65364 4.71436H10.9419C11.3301 4.71436 11.6478 4.39293 11.6478 4.00007C11.6478 3.60721 11.3301 3.28578 10.9419 3.28578Z" fill="black" />
                    </svg>
                    <span style={{ marginLeft: '8px' }}>Пропустить</span>
                  </Button>
                  <Button
                    type="primary"
                    className='bidding-btn'
                    style={{ float: 'right', marginRight: '10px' }}
                    onClick={this.step}
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                </Card>
              </div>
            </div>
          )}


        {
          (this.state.newWish && this.state.preference6)
          && (
            <div className="dashBoardContainer">
              <div className="dashBoardContentDrag borderDesign">
                <Card
                  size="small"
                  bordered={false}
                  className="userCardSlider"
                >
                  <div className='newForm'>Новая Заявка &nbsp;
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z"
                        fill="#282828"
                      />
                      <path
                        d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z"
                        fill="#282828"
                      />
                    </svg>
                    <span className='newForm2'>
                      &nbsp;&nbsp;&nbsp; 6. Приоритет заявки</span> &nbsp;&nbsp;&nbsp;
                      <span className='newForm3'>Переместите бокс по приоритету</span>
                    <Popover content={rulesCount} placement="bottom"><span className='newForm4'>{points}</span></Popover>
                  </div>
                  <div style={{ textAlign: 'left', height: '300px' }}>
                    {/* <ItemList />
                                         */}



                    {this.state.data.length === 0 &&
                      <div><h1>Вы не выбрали ни одной преференции для сохранения заявки</h1></div>
                    }
                    {this.state.data.length !== 0 &&
                      <ItemList func={this.mainPreference} data={this.state.data} />
                    }

                  </div>

                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '10px' }}
                    onClick={this.handleSubmit}
                  >
                    <span>Сохранить</span>
                  </Button>

                  <Button
                    type="primary"
                    className='bidding-btn-step--back'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.step6}
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0)">
                          <path d="M0 4.99996L4.36471 0.267814C4.69412 -0.0893292 5.20882 -0.0893292 5.53824 0.267814C5.86765 0.624957 5.86765 1.18299 5.53824 1.54013L2.32647 4.99996L5.53824 8.4821C5.86765 8.83924 5.86765 9.39728 5.53824 9.75442C5.20882 10.1116 4.69412 10.1116 4.36471 9.75442L0 4.99996Z" fill="white" />
                          <path d="M14 4.99997C14 5.49104 13.6294 5.89282 13.1765 5.89282L1.2353 5.89282C0.782362 5.89282 0.411774 5.49104 0.411774 4.99997C0.411774 4.50889 0.782362 4.10711 1.2353 4.10711L13.1765 4.10711C13.6294 4.10711 14 4.50889 14 4.99997Z" fill="white" />
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="10" height="14" fill="white" transform="translate(0 10) rotate(-90)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Назад</span>
                  </Button>

                </Card>


              </div>
            </div>
          )
        }

        {
          (this.state.newWish && this.state.preference1) &&

          /*< div className="dashBoardContainer">
            <div className="dashBoardContentDrag borderDesign">
              <Card
                size="small"
                bordered={false}
                className="userCardSlider"
              >
                <div className='newForm'>Новая Заявка &nbsp;
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z"
                      fill="#282828"
                    />
                    <path
                      d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z"
                      fill="#282828"
                    />
                  </svg>
                  <span className='newForm2'>&nbsp;&nbsp;&nbsp; 1. Направление полета</span> &nbsp;&nbsp;&nbsp;
                  <span className='newForm3'>Выберите одни из вариантов</span>
                  <Popover content={rulesCount} placement="bottom"><span className='newForm4'>{points}</span></Popover>
                </div>

                <div style={{ textAlign: 'center'}}>
                  {/!* {this.props.flight_direction && (
                    <RadioButtonList dispatcher_func={SetFlightDirection} data={this.props.flight_direction} />
                  )} *!/}
                  <div className={'main_radio_block'}>
                    <div className={'sub_radio_block unselectable'} style={{ backgroundColor: '#FFDC82' }} onClick={this.checkboxTransAir}>
                      <div className={'radio_circle'} style={{ backgroundColor: this.state.colorTransAir }}></div>
                      <div className={'radio_text_wrapper'}>
                        <p className={'radio_text'} style={{ color: 'black' }}>Трансатлантические</p>
                      </div>
                    </div>

                    <div className={'sub_radio_block unselectable'} style={{ backgroundColor: '#7D58FF' }} onClick={this.checkboxContinent}>
                      <div className={'radio_circle'} style={{ backgroundColor: this.state.colorContinent }}></div>
                      <div className={'radio_text_wrapper'}>
                        <p className={'radio_text'} style={{ color: 'black' }}>Континентальные</p>
                      </div>
                    </div>


                    <Select
                      showSearch
                      style={{ width: '50%' }}
                      placeholder="Приоритетный город"
                      // defaultValue={['china']}
                      onChange={handleChange}
                    // optionLabelProp="label"
                    >

                      {this.state.cities && this.state.cities.map(city => (
                        <Option value={city.cityName} key={city.cityName}>
                          <div className="demo-option-label-item">
                            {city.cityName}
                          </div>
                        </Option>
                      ))}

                    </Select>,



                  </div>
                  {/!* <RadioButtonList /> *!/}
                </div>
                <Button
                    type="primary"
                    className='bidding-btn-step--skip'
                    onClick={this.step3Clear}
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9996 3.99972L8.25842 0.214007C7.97607 -0.0717068 7.53489 -0.0717068 7.25254 0.214007C6.97018 0.499722 6.97018 0.946149 7.25254 1.23186L10.0055 4.01758L7.25254 6.78544C6.97018 7.07115 6.97018 7.51758 7.25254 7.80329C7.53489 8.08901 7.97607 8.08901 8.25842 7.80329L11.9996 3.99972Z" fill="black"/>
                    <path d="M3.68824 3.28578H0.705882C0.317647 3.28578 0 3.60721 0 4.00007C0 4.39293 0.317647 4.71436 0.705882 4.71436H3.68824C4.07647 4.71436 4.39412 4.39293 4.39412 4.00007C4.39412 3.60721 4.07647 3.28578 3.68824 3.28578Z" fill="black"/>
                    <path d="M10.9419 3.28578H6.65364C6.2654 3.28578 5.94775 3.60721 5.94775 4.00007C5.94775 4.39293 6.2654 4.71436 6.65364 4.71436H10.9419C11.3301 4.71436 11.6478 4.39293 11.6478 4.00007C11.6478 3.60721 11.3301 3.28578 10.9419 3.28578Z" fill="black"/>
                  </svg>
                  <span style={{ marginLeft: '8px' }}>Пропустить</span>
                </Button>
                {!this.state.checkboxTransAirCoontinent &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.step3}
                    disabled
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white"/>
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white"/>
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }
                {this.state.checkboxTransAirCoontinent &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.step3}
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white"/>
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white"/>
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }

                {/!*
                <Button
                  type="primary"
                  className='bidding-btn-step--back'
                  style={{ float: 'right', marginRight: '0px' }}
                  onClick={this.stepBack}
                >
                  <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0)">
                      <path d="M0 4.99996L4.36471 0.267814C4.69412 -0.0893292 5.20882 -0.0893292 5.53824 0.267814C5.86765 0.624957 5.86765 1.18299 5.53824 1.54013L2.32647 4.99996L5.53824 8.4821C5.86765 8.83924 5.86765 9.39728 5.53824 9.75442C5.20882 10.1116 4.69412 10.1116 4.36471 9.75442L0 4.99996Z" fill="white"/>
                      <path d="M14 4.99997C14 5.49104 13.6294 5.89282 13.1765 5.89282L1.2353 5.89282C0.782362 5.89282 0.411774 5.49104 0.411774 4.99997C0.411774 4.50889 0.782362 4.10711 1.2353 4.10711L13.1765 4.10711C13.6294 4.10711 14 4.50889 14 4.99997Z" fill="white"/>
                      </g>
                      <defs>
                      <clipPath id="clip0">
                      <rect width="10" height="14" fill="white" transform="translate(0 10) rotate(-90)"/>
                      </clipPath>
                      </defs>
                      </svg>
                    </span>
                </Button> *!/}
              </Card>
            </div>
          </div>*/
          < div className="dashBoardContainer">
            <div className="dashBoardContentDrag borderDesign">
              <Card
                size="small"
                bordered={false}
                className="userCardSlider"
              >
                <div className='newForm'>Новая Заявка &nbsp;
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z"
                      fill="#282828"
                    />
                    <path
                      d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z"
                      fill="#282828"
                    />
                  </svg>
                  <span className='newForm2'>&nbsp;&nbsp;&nbsp; 1. Направление полета</span> &nbsp;&nbsp;&nbsp;
                <span className='newForm3'>Выберите нужные варианты</span>
                  <Popover content={rulesCount} placement="bottom"><span className='newForm4'>{points}</span></Popover>
                </div>

                <div className="step-city-select">
                  <Select
                    showSearch
                    className="select-city"
                    placeholder="Введите название города"
                    onChange={this.handleSelect}
                    bordered={false}
                  >
                    {this.state.cities && this.state.cities.map(el => (
                      <Option value={el} key={el}>
                        <div className="demo-option-label-item">
                          {el}
                        </div>
                      </Option>
                    ))}
                  </Select>
                  <div className="area-tags" >
                    <span className="pref-city">Предпочтительные города ({this.state.areaTags.length} из 8) :</span>
                    <div className="area-tags--grid">
                      {this.state.areaTags && this.state.areaTags.map((el, id) => (
                        <div className="area-tags--city" >
                          {el}
                          <svg onClick={() => this.handleSelectClear(id)} style={{ marginTop: '2px' }} width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.49957 4.35524L0.187073 1.05746C-0.0629272 0.808575 -0.0629272 0.419686 0.187073 0.170797C0.437073 -0.0780913 0.827698 -0.0780913 1.0777 0.170797L3.5152 2.59746L5.92145 0.186353C6.17145 -0.0625358 6.56207 -0.0625358 6.81207 0.186353C7.06207 0.435242 7.06207 0.824131 6.81207 1.07302L3.49957 4.35524Z" fill="#1E1E1E" />
                            <path d="M6.37518 7.00082C6.21893 7.00082 6.06268 6.9386 5.93768 6.81415L3.50018 4.40304L1.06268 6.81415C0.812683 7.06304 0.422058 7.06304 0.172058 6.81415C-0.0779419 6.56526 -0.0779419 6.17637 0.172058 5.92749L3.50018 2.64526L6.81268 5.94304C7.06268 6.19193 7.06268 6.58082 6.81268 6.82971C6.68768 6.9386 6.53143 7.00082 6.37518 7.00082Z" fill="#1E1E1E" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  type="primary"
                  className='bidding-btn-step--skip'
                  onClick={this.step3Clear}
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9996 3.99972L8.25842 0.214007C7.97607 -0.0717068 7.53489 -0.0717068 7.25254 0.214007C6.97018 0.499722 6.97018 0.946149 7.25254 1.23186L10.0055 4.01758L7.25254 6.78544C6.97018 7.07115 6.97018 7.51758 7.25254 7.80329C7.53489 8.08901 7.97607 8.08901 8.25842 7.80329L11.9996 3.99972Z" fill="black" />
                    <path d="M3.68824 3.28578H0.705882C0.317647 3.28578 0 3.60721 0 4.00007C0 4.39293 0.317647 4.71436 0.705882 4.71436H3.68824C4.07647 4.71436 4.39412 4.39293 4.39412 4.00007C4.39412 3.60721 4.07647 3.28578 3.68824 3.28578Z" fill="black" />
                    <path d="M10.9419 3.28578H6.65364C6.2654 3.28578 5.94775 3.60721 5.94775 4.00007C5.94775 4.39293 6.2654 4.71436 6.65364 4.71436H10.9419C11.3301 4.71436 11.6478 4.39293 11.6478 4.00007C11.6478 3.60721 11.3301 3.28578 10.9419 3.28578Z" fill="black" />
                  </svg>
                  <span style={{ marginLeft: '8px' }}>Пропустить</span>
                </Button>
                {(this.state.areaTags.length === 0) &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.step3}
                    disabled
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }
                {(this.state.areaTags.length > 0) &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.step3}
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }

                {/*
                <Button
                  type="primary"
                  className='bidding-btn-step--back'
                  style={{ float: 'right', marginRight: '0px' }}
                  onClick={this.stepBack}
                >
                  <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0)">
                      <path d="M0 4.99996L4.36471 0.267814C4.69412 -0.0893292 5.20882 -0.0893292 5.53824 0.267814C5.86765 0.624957 5.86765 1.18299 5.53824 1.54013L2.32647 4.99996L5.53824 8.4821C5.86765 8.83924 5.86765 9.39728 5.53824 9.75442C5.20882 10.1116 4.69412 10.1116 4.36471 9.75442L0 4.99996Z" fill="white"/>
                      <path d="M14 4.99997C14 5.49104 13.6294 5.89282 13.1765 5.89282L1.2353 5.89282C0.782362 5.89282 0.411774 5.49104 0.411774 4.99997C0.411774 4.50889 0.782362 4.10711 1.2353 4.10711L13.1765 4.10711C13.6294 4.10711 14 4.50889 14 4.99997Z" fill="white"/>
                      </g>
                      <defs>
                      <clipPath id="clip0">
                      <rect width="10" height="14" fill="white" transform="translate(0 10) rotate(-90)"/>
                      </clipPath>
                      </defs>
                      </svg>
                    </span>
                </Button> */}
              </Card>
            </div>
          </div>
        }

        {
          (this.state.newWish && this.state.preference2) &&

          <div className="dashBoardContainer">
            <div className="dashBoardContentDrag borderDesign" style={{ borderColor: '4px double black;' }}>
              <Card
                size="small"
                bordered={false}
                className="userCardSlider"
              >
                <div className='newForm'>Новая Заявка &nbsp;
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z"
                      fill="#282828"
                    />
                    <path
                      d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z"
                      fill="#282828"
                    />
                  </svg>
                  <span className='newForm2'>&nbsp;&nbsp;&nbsp; 2. Выбор приоритетного времени вылета</span> &nbsp;&nbsp;&nbsp;
                  <span className='newForm3'>Переместите бокс по приоритету</span>
                  <Popover content={rulesCount} placement="bottom"><span className='newForm4'>{points}</span></Popover>
                </div>
                <ItemList_day func={this.timeDayPreference} />
                <Button
                  type="primary"
                  className='bidding-btn-step--skip'
                  onClick={this.step4Clear}
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9996 3.99972L8.25842 0.214007C7.97607 -0.0717068 7.53489 -0.0717068 7.25254 0.214007C6.97018 0.499722 6.97018 0.946149 7.25254 1.23186L10.0055 4.01758L7.25254 6.78544C6.97018 7.07115 6.97018 7.51758 7.25254 7.80329C7.53489 8.08901 7.97607 8.08901 8.25842 7.80329L11.9996 3.99972Z" fill="black" />
                    <path d="M3.68824 3.28578H0.705882C0.317647 3.28578 0 3.60721 0 4.00007C0 4.39293 0.317647 4.71436 0.705882 4.71436H3.68824C4.07647 4.71436 4.39412 4.39293 4.39412 4.00007C4.39412 3.60721 4.07647 3.28578 3.68824 3.28578Z" fill="black" />
                    <path d="M10.9419 3.28578H6.65364C6.2654 3.28578 5.94775 3.60721 5.94775 4.00007C5.94775 4.39293 6.2654 4.71436 6.65364 4.71436H10.9419C11.3301 4.71436 11.6478 4.39293 11.6478 4.00007C11.6478 3.60721 11.3301 3.28578 10.9419 3.28578Z" fill="black" />
                  </svg>
                  <span style={{ marginLeft: '8px' }}>Пропустить</span>
                </Button>
                {this.state.timeDay.length === 0 &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    disabled
                    onClick={this.step4}
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }

                {this.state.timeDay.length !== 0 &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}

                    onClick={this.step4}
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }

                <Button
                  type="primary"
                  className='bidding-btn-step--back'
                  style={{ float: 'right', marginRight: '0px' }}
                  onClick={this.step}
                >
                  <span style={{ marginLeft: '10px' }}>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0)">
                        <path d="M0 4.99996L4.36471 0.267814C4.69412 -0.0893292 5.20882 -0.0893292 5.53824 0.267814C5.86765 0.624957 5.86765 1.18299 5.53824 1.54013L2.32647 4.99996L5.53824 8.4821C5.86765 8.83924 5.86765 9.39728 5.53824 9.75442C5.20882 10.1116 4.69412 10.1116 4.36471 9.75442L0 4.99996Z" fill="white" />
                        <path d="M14 4.99997C14 5.49104 13.6294 5.89282 13.1765 5.89282L1.2353 5.89282C0.782362 5.89282 0.411774 5.49104 0.411774 4.99997C0.411774 4.50889 0.782362 4.10711 1.2353 4.10711L13.1765 4.10711C13.6294 4.10711 14 4.50889 14 4.99997Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="10" height="14" fill="white" transform="translate(0 10) rotate(-90)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </Button>
              </Card>
            </div>
          </div>
        }


        {
          (this.state.newWish && this.state.preference3) &&

          < div className="dashBoardContainer">
            <div className="dashBoardContentDrag borderDesign" style={{ borderColor: '4px double black;' }}>
              <Card
                size="small"
                bordered={false}
                className="userCardSlider"
              >
                <div className='newForm'>Новая Заявка &nbsp;
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z"
                      fill="#282828"
                    />
                    <path
                      d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z"
                      fill="#282828"
                    />
                  </svg>
                  <span className='newForm2'>&nbsp;&nbsp;&nbsp; 3. Преференции переработок</span> &nbsp;&nbsp;&nbsp;
                  <span className='newForm3'>Выберите одни из вариантов</span>
                  <Popover content={rulesCount} placement="bottom"><span className='newForm4'>{points}</span></Popover>
                </div>

                {/* <div style={{ textAlign: 'center', height: '300px' }}>
                  {this.props.flight_direction && (
                    <RadioButtonList_WorkDay dispatcher_func={SetFlightDirection} data={data_work_time} />
                  )}
                 
                </div> */}
                <div className={'main_radio_block'}>
                  <div className={'sub_radio_block unselectable'} style={{ backgroundColor: 'rgb(249,221,142)' }} onClick={this.checkboxWork}>
                    <div className={'radio_circle'} style={{ backgroundColor: this.state.colorWork }}></div>
                    <div className={'radio_text_wrapper'}>
                      <p className={'radio_text'} style={{ color: 'black' }}>Хочу работать с переработками</p>
                    </div>
                  </div>

                  <div className={'sub_radio_block unselectable'} style={{ backgroundColor: 'rgb(119,93,246)' }} onClick={this.checkboxLaziness}>
                    <div className={'radio_circle'} style={{ backgroundColor: this.state.colorLaziness }}></div>
                    <div className={'radio_text_wrapper'}>
                      <p className={'radio_text'} style={{ color: 'black' }}>Переработки неприемлимы</p>
                    </div>
                  </div>
                </div>


                <Button
                  type="primary"
                  className='bidding-btn-step--skip'
                  onClick={this.step5Clear}
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9996 3.99972L8.25842 0.214007C7.97607 -0.0717068 7.53489 -0.0717068 7.25254 0.214007C6.97018 0.499722 6.97018 0.946149 7.25254 1.23186L10.0055 4.01758L7.25254 6.78544C6.97018 7.07115 6.97018 7.51758 7.25254 7.80329C7.53489 8.08901 7.97607 8.08901 8.25842 7.80329L11.9996 3.99972Z" fill="black" />
                    <path d="M3.68824 3.28578H0.705882C0.317647 3.28578 0 3.60721 0 4.00007C0 4.39293 0.317647 4.71436 0.705882 4.71436H3.68824C4.07647 4.71436 4.39412 4.39293 4.39412 4.00007C4.39412 3.60721 4.07647 3.28578 3.68824 3.28578Z" fill="black" />
                    <path d="M10.9419 3.28578H6.65364C6.2654 3.28578 5.94775 3.60721 5.94775 4.00007C5.94775 4.39293 6.2654 4.71436 6.65364 4.71436H10.9419C11.3301 4.71436 11.6478 4.39293 11.6478 4.00007C11.6478 3.60721 11.3301 3.28578 10.9419 3.28578Z" fill="black" />
                  </svg>
                  <span style={{ marginLeft: '8px' }}>Пропустить</span>
                </Button>
                {!this.state.checkboxWorkLaziness &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.step5}
                    disabled
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }
                {this.state.checkboxWorkLaziness &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.step5}
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }


                <Button
                  type="primary"
                  className='bidding-btn-step--back'
                  style={{ float: 'right', marginRight: '0px' }}
                  onClick={this.step3}
                >
                  <span style={{ marginLeft: '10px' }}>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0)">
                        <path d="M0 4.99996L4.36471 0.267814C4.69412 -0.0893292 5.20882 -0.0893292 5.53824 0.267814C5.86765 0.624957 5.86765 1.18299 5.53824 1.54013L2.32647 4.99996L5.53824 8.4821C5.86765 8.83924 5.86765 9.39728 5.53824 9.75442C5.20882 10.1116 4.69412 10.1116 4.36471 9.75442L0 4.99996Z" fill="white" />
                        <path d="M14 4.99997C14 5.49104 13.6294 5.89282 13.1765 5.89282L1.2353 5.89282C0.782362 5.89282 0.411774 5.49104 0.411774 4.99997C0.411774 4.50889 0.782362 4.10711 1.2353 4.10711L13.1765 4.10711C13.6294 4.10711 14 4.50889 14 4.99997Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="10" height="14" fill="white" transform="translate(0 10) rotate(-90)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </Button>
              </Card>
            </div>
          </div>
        }


        {
          (this.state.newWish && this.state.preference4) &&

          < div className="dashBoardContainer">
            <div className="dashBoardContentDrag borderDesign" style={{ borderColor: '4px double black;' }}>
              <Card
                size="small"
                bordered={false}
                className="userCardSlider"
              >
                <div className='newForm'>Новая Заявка &nbsp;
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z"
                      fill="#282828"
                    />
                    <path
                      d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z"
                      fill="#282828"
                    />
                  </svg>
                  <span className='newForm2'>&nbsp;&nbsp;&nbsp; 4. Префренции длительности смены</span> &nbsp;&nbsp;&nbsp;
                  <span className='newForm3'>Выберите одни из вариантов</span>
                  <Popover content={rulesCount} placement="bottom"><span className='newForm4'>{points}</span></Popover>
                </div>

                {/* <div style={{ textAlign: 'center', height: '300px' }}>
                  {this.props.flight_direction && (
                    <RadioButtonList_WorkTime dispatcher_func={SetFlightDirection} data={data_work_day} />
                  )}
                  
                </div> */}

                <div className={'main_radio_block'}>
                  <div className={'sub_radio_block unselectable'} style={{ backgroundColor: 'rgb(119,93,246)' }} onClick={this.checkboxLongDay}>
                    <div className={'radio_circle'} style={{ backgroundColor: this.state.colorLongDay }}></div>
                    <div className={'radio_text_wrapper'}>
                      <p className={'radio_text'} style={{ color: 'black' }}>Длительная смена</p>
                    </div>
                  </div>

                  <div className={'sub_radio_block unselectable'} style={{ backgroundColor: 'rgb(242, 166, 137)' }} onClick={this.checkboxEasyDay}>
                    <div className={'radio_circle'} style={{ backgroundColor: this.state.colorEasyDay }}></div>
                    <div className={'radio_text_wrapper'}>
                      <p className={'radio_text'} style={{ color: 'black' }}>Короткая смена</p>
                    </div>
                  </div>
                </div>
                <Button
                  type="primary"
                  className='bidding-btn-step--skip'
                  onClick={this.step6Clear}
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9996 3.99972L8.25842 0.214007C7.97607 -0.0717068 7.53489 -0.0717068 7.25254 0.214007C6.97018 0.499722 6.97018 0.946149 7.25254 1.23186L10.0055 4.01758L7.25254 6.78544C6.97018 7.07115 6.97018 7.51758 7.25254 7.80329C7.53489 8.08901 7.97607 8.08901 8.25842 7.80329L11.9996 3.99972Z" fill="black" />
                    <path d="M3.68824 3.28578H0.705882C0.317647 3.28578 0 3.60721 0 4.00007C0 4.39293 0.317647 4.71436 0.705882 4.71436H3.68824C4.07647 4.71436 4.39412 4.39293 4.39412 4.00007C4.39412 3.60721 4.07647 3.28578 3.68824 3.28578Z" fill="black" />
                    <path d="M10.9419 3.28578H6.65364C6.2654 3.28578 5.94775 3.60721 5.94775 4.00007C5.94775 4.39293 6.2654 4.71436 6.65364 4.71436H10.9419C11.3301 4.71436 11.6478 4.39293 11.6478 4.00007C11.6478 3.60721 11.3301 3.28578 10.9419 3.28578Z" fill="black" />
                  </svg>
                  <span style={{ marginLeft: '8px' }}>Пропустить</span>
                </Button>
                {!this.state.checkboxLongDayEasyDay &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.step6}
                    disabled
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }
                {this.state.checkboxLongDayEasyDay &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.step6}
                  >
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>
                }


                <Button
                  type="primary"
                  className='bidding-btn-step--back'
                  style={{ float: 'right', marginRight: '0px' }}
                  onClick={this.step4}
                >
                  <span style={{ marginLeft: '10px' }}>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0)">
                        <path d="M0 4.99996L4.36471 0.267814C4.69412 -0.0893292 5.20882 -0.0893292 5.53824 0.267814C5.86765 0.624957 5.86765 1.18299 5.53824 1.54013L2.32647 4.99996L5.53824 8.4821C5.86765 8.83924 5.86765 9.39728 5.53824 9.75442C5.20882 10.1116 4.69412 10.1116 4.36471 9.75442L0 4.99996Z" fill="white" />
                        <path d="M14 4.99997C14 5.49104 13.6294 5.89282 13.1765 5.89282L1.2353 5.89282C0.782362 5.89282 0.411774 5.49104 0.411774 4.99997C0.411774 4.50889 0.782362 4.10711 1.2353 4.10711L13.1765 4.10711C13.6294 4.10711 14 4.50889 14 4.99997Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="10" height="14" fill="white" transform="translate(0 10) rotate(-90)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </Button>
              </Card>
            </div>
          </div>
        }


        {
          (this.state.newWish && this.state.preference5) &&

          < div className="dashBoardContainer">
            <div className="dashBoardContentDrag borderDesign" style={{ borderColor: '4px double black;' }}>
              <Card
                size="small"
                bordered={false}
                className="userCardSlider"
              >
                <div className='newForm'>Новая Заявка &nbsp;
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z"
                      fill="#282828"
                    />
                    <path
                      d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z"
                      fill="#282828"
                    />
                  </svg>
                  <span className='newForm2'>&nbsp;&nbsp;&nbsp; 5. Выбор желаемых выходных дней</span> &nbsp;&nbsp;&nbsp;
                  <span className='newForm3'>Выберите одни из вариантов</span>
                  <Popover content={rulesCount} placement="bottom"><span className='newForm4'>{points}</span></Popover>
                </div>

                <div className={'calendar_block'}>
                  <div style={{
                    display: 'flex', flexDirection: 'row',
                    justifyContent: 'center',
                  }}>

                    <div className="site-calendar-demo-card" style={{
                      backgroundColor: '#FFDE84',
                      width: '300px',
                      borderRadius: '10px',
                      marginRight: '21px',
                    }}>
                      <Calendar

                        value={this.state.selectedDates}
                        onChange={(dates) => this.setSelectedDates(dates)}
                        minimumDate={{ year: 2020, month: 9, day: 7 }}
                        maximumDate={{ year: 2020, month: 9, day: 27 }}

                      />
                    </div>
                    {/* <div className="site-calendar-demo-card" style={{ backgroundColor: '#C2D5FB', width: '300px', borderRadius: '10px', marginRight: '21px' }}>
                                            <CalendarWithButtonsPlusOneMonth onPanelChange={onPanelChange} />
                                        </div>
                                        <div className="site-calendar-demo-card" style={{ backgroundColor: '#C7F8CF', width: '300px', borderRadius: '10px' }}>
                                            <CalendarWithButtonsPlusTwoMonth onPanelChange={onPanelChange} />
                                        </div> */}
                  </div>
                </div>
                <Button
                  type="primary"
                  className='bidding-btn-step--skip'
                  onClick={this.dataComponent}
                  value={'clear'}
                >
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9996 3.99972L8.25842 0.214007C7.97607 -0.0717068 7.53489 -0.0717068 7.25254 0.214007C6.97018 0.499722 6.97018 0.946149 7.25254 1.23186L10.0055 4.01758L7.25254 6.78544C6.97018 7.07115 6.97018 7.51758 7.25254 7.80329C7.53489 8.08901 7.97607 8.08901 8.25842 7.80329L11.9996 3.99972Z" fill="black" />
                    <path d="M3.68824 3.28578H0.705882C0.317647 3.28578 0 3.60721 0 4.00007C0 4.39293 0.317647 4.71436 0.705882 4.71436H3.68824C4.07647 4.71436 4.39412 4.39293 4.39412 4.00007C4.39412 3.60721 4.07647 3.28578 3.68824 3.28578Z" fill="black" />
                    <path d="M10.9419 3.28578H6.65364C6.2654 3.28578 5.94775 3.60721 5.94775 4.00007C5.94775 4.39293 6.2654 4.71436 6.65364 4.71436H10.9419C11.3301 4.71436 11.6478 4.39293 11.6478 4.00007C11.6478 3.60721 11.3301 3.28578 10.9419 3.28578Z" fill="black" />
                  </svg>
                  <span style={{ marginLeft: '8px' }}>Пропустить</span>
                </Button>
                {this.state.selectedDates.length === 0 && <Button
                  type="primary"
                  className='bidding-btn-step'
                  style={{ float: 'right', marginRight: '0px' }}
                  disabled
                  onClick={this.dataComponent}
                >
                  <span style={{ marginLeft: '10px' }}>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                      <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                    </svg>
                  </span>
                  <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                </Button>

                }

                {this.state.selectedDates.length !== 0 &&
                  <Button
                    type="primary"
                    className='bidding-btn-step'
                    style={{ float: 'right', marginRight: '0px' }}
                    onClick={this.dataComponent}>
                    <span style={{ marginLeft: '10px' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5.00004L9.63529 9.73219C9.30588 10.0893 8.79118 10.0893 8.46176 9.73219C8.13235 9.37504 8.13235 8.81701 8.46176 8.45987L11.6735 5.00004L8.46176 1.5179C8.13235 1.16076 8.13235 0.602722 8.46176 0.245579C8.79118 -0.111564 9.30588 -0.111564 9.63529 0.245579L14 5.00004Z" fill="white" />
                        <path d="M-0.000100175 5.00003C-0.000100153 4.50896 0.370488 4.10718 0.82343 4.10718L12.7646 4.10718C13.2175 4.10718 13.5881 4.50896 13.5881 5.00003C13.5881 5.49111 13.2175 5.89289 12.7646 5.89289L0.82343 5.89289C0.370488 5.89289 -0.000100196 5.49111 -0.000100175 5.00003Z" fill="white" />
                      </svg>
                    </span>
                    <span style={{ marginLeft: '15px' }}>Подтвердить</span>
                  </Button>}

                <Button
                  type="primary"
                  className='bidding-btn-step--back'
                  style={{ float: 'right', marginRight: '0px' }}
                  onClick={this.step5}
                >
                  <span style={{ marginLeft: '10px' }}>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0)">
                        <path d="M0 4.99996L4.36471 0.267814C4.69412 -0.0893292 5.20882 -0.0893292 5.53824 0.267814C5.86765 0.624957 5.86765 1.18299 5.53824 1.54013L2.32647 4.99996L5.53824 8.4821C5.86765 8.83924 5.86765 9.39728 5.53824 9.75442C5.20882 10.1116 4.69412 10.1116 4.36471 9.75442L0 4.99996Z" fill="white" />
                        <path d="M14 4.99997C14 5.49104 13.6294 5.89282 13.1765 5.89282L1.2353 5.89282C0.782362 5.89282 0.411774 5.49104 0.411774 4.99997C0.411774 4.50889 0.782362 4.10711 1.2353 4.10711L13.1765 4.10711C13.6294 4.10711 14 4.50889 14 4.99997Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="10" height="14" fill="white" transform="translate(0 10) rotate(-90)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </Button>
              </Card>
            </div>
          </div>
        }


        {/* <ItemList dispatcher_func={SetPriority} data={this.props.priority_list_for_application}/>
                <RadioButtonList dispatcher_func={SetFlightDirection} data={this.props.flight_direction}/>
                <ItemList dispatcher_func={SetDayTime} data={this.props.daytime}/> */}


        <div className="dashBoardContainer">
          <div className="dashBoardContent">
            <div className='yourTrip'>Заявка на текущий период:</div>
            <Card
              color="primary"
              className="bidding-status-card"
              bordered={false}
            >
              <div className='status-month'>
                {(!this.props.user.wishForm &&
                  <img src={redCircle} className='status-month--icon'></img>)
                  ||
                  (this.props.user.wishForm &&
                    <img src={greenCircle} className='status-month--icon'></img>)}

                {(!this.props.user.wishForm &&
                  <span className='greyMediumText' >
                    Не заполнена
                    </span>) ||
                  (this.props.user.wishForm &&
                    <span>
                      Ноябрь
                      </span>)}
              </div>
              <div>
                {this.state.newWishForm &&
                  this.state.newWishForm.map((user, key) =>
                    <div className='bidding-status-prefs'>
                      <div className="bidding-prefs-card hoverCard ">
                        <span className='bidding-prefs-card--title'>Направление: </span>
                        <span>{typeof user.longFly === 'object' && user.longFly.join(', ')}</span>
                        <span>{(typeof user.longFly === 'string') && user.longFly}</span>

                      </div>
                      <div className="bidding-prefs-card hoverCard">
                        <span className='bidding-prefs-card--title'>Продолжительность смены: </span>
                        {user.timeFly}
                      </div>
                      <div className="bidding-prefs-card hoverCard ">
                        <span className='bidding-prefs-card--title'>Подработка: </span>
                        {user.otherTime}
                      </div>

                      <div className="bidding-prefs-card hoverCard">
                        <span className='bidding-prefs-card--title'>Предпочтительное время вылета: </span>
                        {user.preferenceTimeFly[0] === "Не заполнено" && "Не заполнено"}
                        {user.preferenceTimeFly[0] !== "Не заполнено" && ` ${user.preferenceTimeFly[0].name}, 
                      ${user.preferenceTimeFly[1].name}, ${user.preferenceTimeFly[2].name}, ${user.preferenceTimeFly[3].name}`}
                      </div>

                      <div className="bidding-prefs-card hoverCard">
                        <span className='bidding-prefs-card--title'>Выходные дни: </span>
                        {user.selectedDates[0] === "Не заполнено" && " Не заполнено"}
                        {user.selectedDates[0] !== "Не заполнено" &&
                          user.selectedDates.map((user, key) =>
                            <span style={{ color: 'red' }}>  {user.day}.{user.month}.{user.year} </span>
                          )}
                      </div>
                    </div>
                  )}
              </div>

              <div className='settings-icon' onClick={this.onNewWishList}
                style={{ position: 'absolute', bottom: '15px', right: '15px' }}>
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0)">
                    <path
                      d="M10.0608 0H8.93802C7.59503 0 6.50523 1.01931 6.4612 2.32833V2.36052C6.45019 2.55365 6.34011 2.71459 6.15297 2.80043C5.66861 3.01502 5.20627 3.27253 4.77696 3.57296C4.61183 3.69099 4.40268 3.70172 4.23756 3.61588L4.21554 3.60515C3.02667 2.99356 1.5736 3.39056 0.902101 4.5279L0.329679 5.4721C-0.341816 6.60944 0.0214521 8.03648 1.1663 8.72318C1.33142 8.81974 1.41948 9.00215 1.39747 9.20601C1.37545 9.46352 1.35343 9.73176 1.35343 9.98927C1.35343 10.2468 1.36444 10.515 1.39747 10.7725C1.41948 10.9657 1.33142 11.1588 1.1663 11.2554C0.0324601 11.9635 -0.341816 13.3906 0.329679 14.5279L0.891093 15.4828C1.56259 16.6202 3.01566 17.0172 4.20453 16.4056L4.22655 16.3948C4.39167 16.309 4.60083 16.3197 4.76595 16.4378C5.19526 16.7382 5.6576 16.9957 6.14196 17.2103C6.3291 17.2961 6.45019 17.4571 6.45019 17.6502V17.6824C6.50523 18.9807 7.59503 20 8.93802 20H10.0608C11.4038 20 12.4936 18.9807 12.5377 17.6717V17.5966C12.5487 17.4142 12.6588 17.2425 12.8459 17.1567C13.3082 16.9528 13.7486 16.6953 14.1669 16.4056C14.332 16.2876 14.5411 16.2768 14.7173 16.3627L14.7943 16.4056C15.9832 17.0172 17.4363 16.6202 18.1078 15.4828L18.6692 14.5279C19.3407 13.3906 18.9774 11.9635 17.8326 11.2768L17.7335 11.2232C17.5684 11.1266 17.4803 10.9442 17.5023 10.7511C17.5243 10.5043 17.5354 10.2575 17.5354 10.0215C17.5354 9.78541 17.5243 9.5279 17.5023 9.29185C17.4803 9.09871 17.5684 8.91631 17.7335 8.81974L17.8326 8.76609C18.9664 8.06867 19.3407 6.64163 18.6692 5.51502L18.1078 4.56009C17.4363 3.42275 15.9832 3.02575 14.7943 3.63734L14.7173 3.68026C14.5411 3.76609 14.332 3.75537 14.1669 3.63734C13.7486 3.34764 13.3082 3.09013 12.8459 2.88627C12.6588 2.80043 12.5487 2.63948 12.5377 2.44635V2.37124C12.4936 1.01931 11.4038 0 10.0608 0ZM4.45772 4.84979C4.80998 4.84979 5.16224 4.74249 5.47047 4.5279C5.83373 4.27039 6.23003 4.05579 6.64833 3.87339C7.25378 3.60515 7.65007 3.03648 7.67209 2.40343V2.37124C7.6941 1.70601 8.25552 1.18026 8.93802 1.18026H10.0608C10.7434 1.18026 11.3048 1.70601 11.3268 2.37124V2.44635C11.3488 3.0794 11.7341 3.63734 12.3285 3.91631C12.7248 4.09871 13.0991 4.3133 13.4513 4.56009C13.9907 4.94635 14.6953 4.98927 15.2787 4.68884L15.3557 4.64592C15.9612 4.33476 16.6987 4.53863 17.051 5.11803L17.6124 6.07296C17.9537 6.65236 17.7665 7.38197 17.1831 7.73605L17.084 7.7897C16.5336 8.12232 16.2254 8.73391 16.2914 9.37768C16.3135 9.58154 16.3245 9.79614 16.3245 10C16.3245 10.2039 16.3135 10.4185 16.2914 10.6223C16.2254 11.2661 16.5336 11.8777 17.084 12.2103L17.1831 12.2639C17.7665 12.618 17.9537 13.3476 17.6124 13.927L17.051 14.882C16.7097 15.4614 15.9612 15.6652 15.3557 15.3541L15.2787 15.3112C14.6953 15.0107 14.0018 15.0536 13.4513 15.4399C13.0991 15.6867 12.7248 15.9013 12.3285 16.0837C11.7341 16.3519 11.3488 16.9206 11.3268 17.5536V17.6288C11.3048 18.294 10.7544 18.8197 10.0608 18.8197H8.93802C8.25552 18.8197 7.6941 18.294 7.67209 17.6288V17.5966C7.65007 16.9528 7.25378 16.3841 6.64833 16.1266C6.24103 15.9442 5.84474 15.7296 5.47047 15.4721C4.93107 15.0966 4.23756 15.0536 3.65413 15.3541L3.63211 15.3648C3.02667 15.676 2.28912 15.4721 1.93686 14.8927L1.37545 13.9378C1.0342 13.3584 1.22134 12.6288 1.80477 12.2747C2.36618 11.9313 2.67441 11.3197 2.59735 10.676C2.57533 10.4506 2.56433 10.2253 2.56433 10.0107C2.56433 9.79614 2.57533 9.56009 2.59735 9.34549C2.6634 8.70172 2.35517 8.0794 1.80477 7.74678C1.22134 7.3927 1.0342 6.66309 1.37545 6.08369L1.93686 5.12875C2.27811 4.54936 3.02667 4.34549 3.63211 4.65665L3.65413 4.66738C3.90732 4.78541 4.18252 4.84979 4.45772 4.84979Z"
                      fill="#282828" />
                    <path
                      d="M9.45595 5.60085C11.9486 5.60085 13.9693 7.57042 13.9693 10C13.9693 12.4296 11.9486 14.3991 9.45595 14.3991C6.96331 14.3991 4.94263 12.4296 4.94263 10C4.94263 7.57042 6.96331 5.60085 9.45595 5.60085Z"
                      fill="#5459CD" />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="19" height="20" fill="white"
                        transform="matrix(1 0 0 -1 0 20)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>

            </Card>

            <div className='mediumText'>История заявок:</div>

            {this.props.user.arrWish &&
              this.props.user.arrWish.map((user, key) =>
                <Card
                  key={key}
                  color="primary"
                  className="bidding-status-card"
                  bordered={false}
                >
                  <div className='status-month'>
                    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="9" height="11" rx="1" fill="#464646" />
                      <rect x="1" y="2" width="7" height="4" fill="white" />
                    </svg>
                    <span>{user.month.description}</span>
                  </div>
                  <div>
                    <div className='history-status-prefs' id={"form" + key + "toggler1"}>
                      <div className="history-prefs-card hoverCard ">
                        <span className='bidding-prefs-card--title'>Направление: </span>
                        {user.longFly[0].fly}
                        <span className={user.longFly[0].flag ? "prefs-status-color --green hoverCard" : "prefs-status-color --red hoverCard"} />
                      </div>
                      <div className="history-prefs-card hoverCard" id={"form" + key + "toggler3"}>
                        <span className='bidding-prefs-card--title'>Продолжительность смены: </span>
                        {user.timeFly[0].flyTime}
                        <span className={user.timeFly[0].flag ? "prefs-status-color --green hoverCard" : "prefs-status-color --red hoverCard"} />
                      </div>
                      <div className="history-prefs-card hoverCard" id={"form" + key + "toggler2"}>
                        <span className='bidding-prefs-card--title'>Подработка: </span>
                        {user.otherTime[0].time}
                        <span className={user.otherTime[0].flag ? "prefs-status-color --green hoverCard" : "prefs-status-color --red hoverCard"} />
                      </div>

                      <div className="history-prefs-card hoverCard" id={"form" + key + "toggler4"}>
                        <span className='bidding-prefs-card--title'>Предпочтительное время вылета: </span>
                        {user.preferenceTimeFly[0].dayTime}
                        <span className={user.preferenceTimeFly[0].flag ? "prefs-status-color --green hoverCard" : "prefs-status-color --red hoverCard"} />
                      </div>

                      {/*<div className="history-prefs-card hoverCard">
                        <span className='bidding-prefs-card--title'>Выходные дни: </span>
                      </div>*/}
                    </div>
                  </div>
                    {user &&
                      <div className='bid-stat-info'>
                        <span>{this.showDiagram(user.longFly[0].flag, user.otherTime[0].flag, user.timeFly[0].flag, user.preferenceTimeFly[0].flag).text}</span>
                      </div>
                    }
                </Card>
              )}

          </div>


          <div className='modalWidth'>
            <Modal
              width={'80%'}
              title="Добро пожаловать"
              visible={this.state.visible4}
              onCancel={this.handleCancel4}

              footer={[]}
            >

              <div style={{ textAlign: 'center' }}>

                <Iframe className='iframe' url="/wow" width="100%" height={window.innerHeight - 70} />

                <div className='registerForm'>


                </div>
              </div>
            </Modal>
          </div>


          {
            this.state.modalUser && (
              <div className='modalWidth'>
                <Modal

                  title="Детали полета"
                  visible={this.state.visible2}
                  onCancel={this.handleCancel2}

                  footer={[]}
                >
                  <div style={{ textAlign: 'center' }}>
                    Детальная информация по полету
                    </div>
                </Modal>
              </div>
            )
          }

          {
            this.state.modalUser && (
              <Modal
                width='550px'
                title="Детальная информация по полету"

                visible={this.state.visible}
                onCancel={this.handleCancel}
                footer={[
                  <div style={{ height: 60 }}>
                    {/* <Icon
                                        type="close-circle"
                                        style={{ fontSize: "62px", float: "left" }}
                                        onClick={this.handleCancel}
                                    />
                                    <img style={{ width: '130px' }} src={logo} alt="" />
                                    <Icon
                                        type="heart"
                                        theme="twoTone"
                                        twoToneColor="#eb2f96"
                                        style={{ fontSize: "62px", float: "right" }}
                                        onClick={this.isLike}
                                    /> */}
                  </div>,
                ]}
              >
                <div style={{ textAlign: 'center' }} onClick={() => this.tryam()}>
                  {/* <Carousel autoplay>
                {this.state.modalUser.foto.map((f, i) =>
                    <div key={i}>
                        <Avatar size={180} src={f} />
                    </div>
                )}
            </Carousel> */}
                </div>

                <p>
                  <div style={{ height: '40%' }}>
                    <div className="card-container">
                      <br />
                      <Tag color="green">
                        <div style={{ color: 'black', fontSize: '16px' }}>
                          Маршрут: {this.state.modalUser.where_from} - {this.state.modalUser.where_to}
                        </div>
                      </Tag>
                      <br />
                      <Tabs type="card">
                        <TabPane tab="Общая информация" key="1">
                          <p>
                          </p>
                          <Alert message={
                            <p>
                              <div style={{ color: 'black' }}>Информация
                                </div>

                            </p>
                          } type="info" />
                          <Alert message={
                            <p>
                              <div style={{ color: 'black' }}>Заголовок</div>
                              <div className={'fontModal'}>Информация
                                </div>

                            </p>
                          } type="info" />
                          <Alert message={
                            <p>
                              <div style={{ color: 'black' }}>Заголовок</div>
                              <div
                                className={'fontModal'}>Информация
                                </div>
                            </p>
                          } type="info" />
                          <Alert message={
                            <p>
                              <div style={{ color: 'black' }}>Заголовок</div>
                              <div
                                className={'fontModal'}>Информация
                                </div>
                            </p>
                          } type="info" />
                        </TabPane>
                        <TabPane tab="Детали" key="2">
                          <p>
                          </p>
                          <Alert message={
                            <p>
                              <div style={{ color: 'black' }}>Информация
                                </div>

                            </p>
                          } type="info" />
                          <Alert message={
                            <p>
                              <div style={{ color: 'black' }}>Заголовок</div>
                              <div className={'fontModal'}>Информация
                                </div>

                            </p>
                          } type="info" />
                          <Alert message={
                            <p>
                              <div style={{ color: 'black' }}>Заголовок</div>
                              <div
                                className={'fontModal'}>Информация
                                </div>
                            </p>
                          } type="info" />
                          <Alert message={
                            <p>
                              <div style={{ color: 'black' }}>Заголовок</div>
                              <div
                                className={'fontModal'}>Информация
                                </div>
                            </p>
                          } type="info" />
                        </TabPane>

                      </Tabs>
                    </div>
                    {document.getElementById('container')}
                  </div>

                </p>
              </Modal>

            )
          }

          <div className='rightBar'>

            <div className="site-card-border-less-wrapper">

              <div className="site-calendar-demo-card" style={{ backgroundColor: '#F6F9FE' }}>


                <CalendarWithButtons highlighted={this.state.workingDays} />
              </div>
              <div className="userCardW" style={{ marginTop: '30px' }}>
                <div className='yourTrip1'>Ваши рейсы</div>
                <div className='sUserCard' onClick={this.showSort}>
                  <span className='sort-func-title'>Сортировка</span>
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 5.99994L0.241071 1.45709C-0.0803571 1.11423 -0.0803571 0.578516 0.241071 0.235659C0.5625 -0.107199 1.06473 -0.107199 1.38616 0.235659L4.52009 3.57852L7.61384 0.257087C7.93527 -0.0857701 8.4375 -0.0857701 8.75893 0.257087C9.08036 0.599944 9.08036 1.13566 8.75893 1.47852L4.5 5.99994Z" fill="#5459CD" />
                  </svg>
                </div>

                {this.state.showSortFilters &&
                  <div className="userCardWSort">
                    <div className="userCardFilter">
                      <span>Время полета, часы</span>
                      <div style={{ marginLeft: 'auto', marginRight: 'auto', width: 'auto' }}>
                        <Slider range value={[this.state.minTime, this.state.maxTime]} max={24}
                          onChange={this.onChangeTime}
                          defaultValue={[this.state.minTime, this.state.maxTime]}
                          marks={{ 0: 'min', 24: 'max' }} />
                      </div>
                    </div>
                    <div className="userCardFilter">
                      <span>Город</span>
                      <Select
                        style={{ width: '100%' }}
                        mode="multiple"
                        placeholder="Приоритетный город"
                        onChange={this.handleChangeSort}
                      >
                        {this.props.user.arrFlights && this.props.user.arrFlights.map(city => (
                          <Option value={city.where_to} key={city.where_to}>
                            <div className="demo-option-label-item">
                              {city.where_to}
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="userCardFilter">
                      <span>Сложность аэропорта, коэфициент</span>
                      <div style={{ marginLeft: 'auto', marginRight: 'auto', width: 'auto' }}>
                        <Slider range value={[this.state.minDifficulty, this.state.maxDifficulty]} max={10}
                          onChange={this.onChangeDifficulty}
                          defaultValue={[this.state.minDifficulty, this.state.maxDifficulty]}
                          marks={{ 0: 'min', 10: 'max' }} />
                      </div>
                    </div>
                  </div>
                }
                <Suspense fallback={<h1>Loading posts....</h1>}>
                  {this.props.user.arrFlights &&

                    this.props.user.arrFlights.map((user, i) => {

                      if (this.filterTime(user.flight_time) && this.filterCities(user.where_to) && this.filterDifficulty(user.level_flights)) {
                        if (user.city_photo) {

                          let srcImg;
                          if (!user.city_photo) {
                            srcImg = user.city_photo;
                          } else {
                            srcImg = plane;
                          }

                          let styl, depart, land;
                          let landing_blue = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAABmJLR0QA/wD/AP+gvaeTAAACeklEQVQ4jc2U309SYRjHn/ecQ6mAB0UOIOhOxQgRNb1Q07Vps5lrq4tcG2Nr3XnVTWtr6x/oH+imy26iq7ZuWpu2fm4unWL+gB1JzAGCASoECBw4bxcUHPklbV703Lzb+7zP532e7/s8L5q2LsFpGHEqlD8gMxvpM4RLHB3ML4M+itC/gIydh49si6qWpNhBSzNPZr48ffCeUSSrxJaBCMASSrBd48QOztvCZwlGkbROcFViy0ApngKAEcuuqfOg4OCzhNvXAgCjvQFWG6sPlCEBACGwTboIkfprHiUAIITvXHWfCCLNPTNaZfKyJQAAbXTq+tCOTpXAAOFoUzAiPSPJKZtT59ujDrd6P9ZQA0QBwPq2MnTQlBdb3pQZH/COD3jTPOnYZBZc6hdzJr0q3ipPAdAnZJTmyc+rOk1rUq+KF28gsZ6JD5mDN0e3dKr4fqwxEms4SlPVQEjc2cPdAesE196WqHgUY+T20wtOzYJLHQjLaoEAgCTwlT7/5OCOQX9YoxDvT/miS/3pm84fklUGFYzVRG2T3CVDqAYOY/Rmnn3+tgtjVHXWOtTxbjZSgwIACOEbI9v3ppxQcWgRgulx9/3bKxJKKGwKAnxw6J+97lnmGD57LGpqeEfTmih9BYoUZm6tjfX7RPnDV6f25TtjXo6xfp8/JHv10TBo3uu9EGqWZrYDzYmU5BhI2sg/tC5ZzhUrWvmuss9e9OzSYu5Rmprf0M5vaAGAJHBOQCAWm1EkH99d1P1tpU2fwj5rWvcoa8tULCW/nJXkCpQfQdo+Z1zmmDoReStmRBK4i90nCby6pcS47g+tJCMAyAmo/kLK7VT/7P8L9BvboetBm/GZ3QAAAABJRU5ErkJggg==';
                          let landing_purple = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAABmJLR0QA/wD/AP+gvaeTAAACaklEQVQ4jc2U309SYRjHn/f1QCmRIBwGQnlUGHkQlblJtraMEGutH5s31szL1mXrvq3/oeuuXeum2lwtQEc31XILiuMJUCxhSAKGuEzieE4XODkinU6bF33v3vd59tn3ed7nedH9CQEOQ/hQKLsgivpqtSbrAgZDzmLJIPQvoBMd6ZuTjzXaojigOvbj9p1Hd+891O6/lwIhEAiCGx2dFQdSKxaOI7Ta4gXvnFxQpaIEgF4nc7IjtRfgOCKdNgOAs48xmr7JApXLSgBACHy+IMa1R0wmKQBASPB4Qn8FNZ3rfaDTrTt6WQBo1ZSG3POkvgCANjZa1wtthKLSenzT1L66mLCVSmoJEAEAy8tU8bum2uyWli3XYNg1GP5VUSTiVpa1B/weA5lXqzelHaHqQKpUW1euztCOzwczeB6lUxaGoZloj4QpJJ5s2sF6vXN6stAwVRBQOt3OLpxiWXshr5MCAQDGfF//J7d73mzJSBSytkayC/aPEWcup28M2pPRmPWNzVptSxI4QUBv3wy9fDEqCOiPu2Yw5qjOLxIUAEBIGD7z7uKlV9BwaRGCEc/r8fGnBLGzd8nzKPyh//mzy/GYjeMIcf7p4fdtunWijtLUtHPt+syAKyLyD+xCTzAwUm3HgCuSz+lCobM0HevqTqpUW9lV4/bPo/tAzc3bEzeedHbVKlpMdAf85zMZk4iLyuUjTJRmojQAYMzzPAZxs7Xa4uTUNEnmq8dUyhz0e6pbIke7jpSKyq2paT2ZB4Bs1hjwj8RjNpmIqmqOMOYpagVjfmmpUxBkf2h1jgCA57H8Qg7qUP/s/wv0G9EW5yQKXtQFAAAAAElFTkSuQmCC';
                          let depart_blue = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAABmJLR0QA/wD/AP+gvaeTAAACUUlEQVQ4jc2UXW/SYBTHzwNF3UbpoGsoLw60cxqmqJkhW7KNGS92N7f5Fj+Bt+5r+AH8BBovvFiyi10Yo0uEjLgxsDI3KWVhoYAB9wJDysuoFyULlm7owoXnqj3Pv7/nPP+n56CHT4PQidB0hPJfgrAzf2nExZsDOX1XNbvfFYmTSpARF6fH4m4mF+YoH2vbThtaERayODPOT9wSMG1dzghZvRI0ej0z5UnosHq/uTA9Fheyen/E6metqVwPADjo/OwEPzqU0vxpiZDrUYKWVpxhjno2w7ocuwBAk0WKKEkSXLHvz3ljw1d/IKQs8PM3+uWCG6n+RwjBveEdB51f9DFm469Zb8zN5BQaSYJg1LywPBBN9sJJZksSvF/rdzO5549Dgxf3WlbRepR6+3GQF4jjJPZgknPShcAGvf7dXKpoAQAhacSVmZvknfSB6jav3l1b9F1WJDEuaXx0lxsZSldrmi88xe30em8nrX1FVYRcjp+1tOa1pG1eyOo9rgymlax9xRvMT7y72qwoV7WJjMFkKMuvmwlyKXCpFYQBwMqGpfYGzT8J6bB6084QTxHLIfsn1jblSTC2xjF9rFW10obZq1v0i9d37o/zlZpGyOq30wTLUweH5+RV0iDKD7UjTSCici5ovrVwjArHKFURSZSONYWSTlXzV01LEg2DVG3+B5AJLwFAuaJd2zKfHaTD6nh3BQBWN81i5cRp0R5kwkW5v3xfbafI2s8jEyHWjjQfgvYwp34Vcqg3bXMY8TJC0m7+wumy9hXtFc631UAHZ/ZvaYTXa4YHSp4AAAAASUVORK5CYII=';
                          let depart_purple = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAABmJLR0QA/wD/AP+gvaeTAAACO0lEQVQ4jc2UQW/SYBjHn5e+WzJmYZMaimyRUBxCWUaiwahQyHZWb84v44fwOxhv6sWTHiQDZIdNhQ46ug7cgAGWTQdkc4xaD53LhApKOPic3v777+/5p0+foiePVRhFGUZC+S9BeOgnSbLJuPLGie/fDs35bUc3iCSb90JJhilsiQyf9lUqdC/CYjkIcYkFP08QiqbUZaobxPqEQGAd447V+iUYStZliudZnmfrsgUArHSN4xKsL2sw/DZruW7pBq0mA5LEPHj42uHYBYBpy8GU+VD9gWZmylwk7naLCHUHFLI3Xr28j3S/I4Tg5q0PVrqWiN2dvvyV4+KMq9DlUVUQxbmVaLBYtAOAPkgrxlVYXIrOzpZ6EEjMuaLvwuWy7VzE4UiMttWyGY+Yu35yMg4ACKleVghHEjRd1W3w9s1SPHanS8Slkj2yuMKyQqeDt7edxV2735+mruz/KaaqonSK7dWJ+atP6zLl8eYwoVDUvpP5bJw8vuhon45Vq1aTqaVd7uxcW00GekEYADIbXkUhHi2/wFi50Bn29myfPi6kU/OB22t2e0XT+ZRPN+nZ+DcF9/Nny0HufaeDZZmqVOi85Gy1JrW7JlNDOygKkdnw9AMBgCQxksToms5BksQcHU/oev5qac1TTe2g+5r/AUSSDQA4bY/lNueGB2GsGI1HACAI7nZ7fHgQSTa0/eJ5/Xmd9RsIMpmbikKsr/m3RP1RaNVv134laiGkNhpkf9vgRM3mpYEeGOE/+yep49ifb88TZgAAAABJRU5ErkJggg==';
                          if (i % 2 == 0) {
                            styl = 'userCard hoverCard ';
                            depart = depart_purple;
                            land = landing_purple;
                          } else {
                            styl = 'userCard1 hoverCard ';
                            depart = depart_blue;
                            land = landing_blue;
                          }

                          return (
                            <div>
                              <div
                                id={"flight" + i + "toggler"}
                                className={styl}
                              >
                                <div className="flight-number">1234</div>
                                <div className='flight-info'>
                                  <span className='flight-trip'>Отбытие</span>
                                  <span className='flight-date'>
                                    {/*    <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.2774 1.10973C12.2246 1.02708 12.1586 0.971973 12.0794 0.91687C12.0794 0.91687 11.0893 0.544922 10.5348 0.544922C9.68988 0.544922 9.05619 0.889318 8.35649 1.31637C8.09246 1.48168 7.80201 1.66077 7.48517 1.85363C7.48517 1.85363 7.48517 1.85363 7.47197 1.85363L4.42234 1.30259C4.36953 1.28882 4.31673 1.30259 4.27712 1.31637L3.78865 1.55056C3.66983 1.60566 3.66983 1.78475 3.78865 1.83985L5.80854 2.85926C5.82174 2.85926 5.82174 2.87304 5.80854 2.88682C4.68638 3.58938 3.70944 4.18175 3.70944 4.18175C3.69624 4.18175 3.68304 4.19552 3.68304 4.19552C3.28698 4.42971 2.82492 4.51237 2.37605 4.40216L1.2935 4.14042C1.24069 4.12664 1.17468 4.12664 1.12188 4.14042C0.92385 4.2093 0.871042 4.47104 1.02946 4.62257L2.24403 5.77974C2.42886 5.95883 2.7061 6.01393 2.94373 5.9175L3.55102 5.65576L6.9703 4.15419L11.8418 2.06026C12.317 1.85363 12.5019 1.44035 12.2774 1.10973Z" fill="#FFDC82"/>
                                    <path d="M7.90797 4.23682L6.46897 4.87051L6.19173 6.11033C6.17853 6.17921 6.23134 6.24809 6.29735 6.24809H6.44257C6.6406 6.24809 6.81222 6.15166 6.91784 5.97257L7.90797 4.23682Z" fill="#FFDC82"/>
                                  </svg>*/}
                                    {user.time_of_departure}
                                  </span>
                                </div>
                                <div className='flight-divider'>
                                </div>
                                <div className='flight-info'>
                                  <span className='flight-trip'>Прибытие</span>
                                  <span className='flight-date'>
                                    {/*              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.917 8.74699C11.9381 8.6512 11.9304 8.56556 11.9133 8.47059C11.9133 8.47059 11.4762 7.50745 11.0841 7.11537C10.4867 6.51793 9.79507 6.31337 8.99833 6.12057C8.69474 6.05076 8.36273 5.97203 8.00232 5.88436C8.00232 5.88436 8.00232 5.88436 7.99298 5.87502L6.22621 3.32897C6.19861 3.28189 6.15153 3.25429 6.11378 3.23602L5.60279 3.05622C5.47981 3.01117 5.35317 3.1378 5.39822 3.26078L6.10566 5.40989C6.115 5.41922 6.10526 5.42896 6.08618 5.42937C4.79591 5.13268 3.68625 4.86074 3.68625 4.86074C3.67691 4.8514 3.65783 4.85181 3.65783 4.85181C3.21218 4.73735 2.82701 4.46907 2.58754 4.07375L2.00714 3.12319C1.97954 3.07611 1.93287 3.02943 1.88578 3.00183C1.69705 2.91051 1.47463 3.05825 1.4795 3.27742L1.52009 4.9545C1.52415 5.21182 1.68122 5.44682 1.91744 5.54667L2.53194 5.791L6.0115 7.14703L10.9368 9.11106C11.419 9.30101 11.8419 9.13947 11.917 8.74699Z" fill="#FFDC82"/>
                                    <path d="M6.61613 7.86857L5.15051 7.29913L4.07779 7.97978C4.01975 8.01915 4.00838 8.1052 4.05506 8.15187L4.15774 8.25456C4.29777 8.39458 4.48731 8.44775 4.68863 8.3958L6.61613 7.86857Z" fill="#FFDC82"/>
                                  </svg>*/}
                                    {user.time_of_arrival}
                                  </span>
                                </div>

                              </div>
                              <UncontrolledCollapse toggler={"#flight" + i + "toggler"}>
                                <Cardr className="userCardW">
                                  <CardBody>
                                    <span>Маршрут:</span> {user.where_from + ' - ' + user.where_to} <br />
                                    <span>Аэропорт:</span> {user.airport_name}<br />
                                    <span>Время в полете:</span> {user.flight_time}<br />
                                    <span>Сложность аэропорта:</span> {user.level_flights}
                                  </CardBody>
                                </Cardr>
                              </UncontrolledCollapse>
                            </div>
                          );
                        }
                      }
                    })}
                </Suspense>
              </div>
            </div>

          </div>

        </div >



        <footer className='footer-users'

          align={'center'}>
          <p>Зарегистрировано пользователей IBMiX : {this.state.usersLength}</p>

          <div dangerouslySetInnerHTML={{ __html: this.ym() }} />
        </footer>
      </div >


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


const Form_You = Form.create({ name: 'form_you' })(DashBoard)
export default connect(mapStateToProps, mapDispatchToProps)(Form_You)