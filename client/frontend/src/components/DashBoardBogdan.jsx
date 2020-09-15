import React, { Suspense, Component } from "react";
// import avatar from "../images/avatar.png";
import plane from "../images/plane.jpg";
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import StepD1 from './stepsPreference/StepD1'
import StepD2 from './stepsPreference/StepD2'
import ItemList from './DnD/itemList';

import CalendarWithButtons from './CalendarWithButtons';

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

import { AddPhotoAC, AddUserAC, AddUsersDashBoard } from "../redux/action";

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
        newWishForm: ''
    });
};


function onPanelChange(value, mode) {
    console.log(value, mode);
}

class DashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalUser: null,
            loading: false,

            showLongWork: true,
            showShortWork: true,

            minTime: 0,
            maxTime: 50000,

            visible: false,
            visible2: false,
            // isRedirect: false,
            usersLength: null,
            visibleWant: false
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
            visible: true
        });
    };


    showWant = () => {
        this.setState({
            visibleWant: true
        });
    }

    handleCancelWant = e => {
        this.setState({
            visibleWant: false,
        });
    };

    async componentDidMount() {

        const reqUsersLength = await fetch("/api/usersLength", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        let usersLength = await reqUsersLength.json();


        this.setState({ usersLength: usersLength.usersLength });


        if (this.props.users.length === 0) {
            this.setState({ loading: true });
        }

        const response = await fetch('/api/profilePilot', {
            headers: { 'Content-Type': 'application/json' }
        })
        const result = await response.json();
        if (result.response !== 'fail') {

            await this.props.addUser(result.response);


        }

        console.log('есть', this.props.user)

        const reqComparison = await fetch("/api/getAllFly", {

            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                id: this.props.user.id
            })
        });
        let users = await reqComparison.json();


        this.setState({ loading: false });

        this.props.AddUsersDashBoard(users);
        console.log("есть ", users, this.props.users, this.props.users.response);

    }


    handleSubmit = async event => {
        event.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            // if (!err) {
            console.log(values)
            const { longFly, otherTime, timeFly, preferenceTimeFly } = values;
            console.log(longFly, otherTime, timeFly, preferenceTimeFly)
            const wishForm = [{ longFly: longFly, otherTime: otherTime, timeFly, preferenceTimeFly }]
            const response = await fetch('/newWishForm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.props.user.email,
                    wishForm: wishForm
                })
            })

            const result = await response.json();
            console.log(result)
            if (result.response === 'success') {
                message.success(`Ваша заявка на полет успешно сохранена`, 5)
                // this.setState({
                //     newWishForm: result.wishForm,

                //             })
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
        })
    };


    onChangeLongWork = (checked) => {
        this.setState({ showLongWork: checked })
    };

    onChangeShortWork = (checked) => {
        this.setState({ showShortWork: checked })
    };

    onChangeTime = value => {
        this.setState({
            minPrice: value[0],
            maxPrice: value[1],
        });
    };


    filterTime = (time) => {
        return this.state.minTime <= time && time <= this.state.maxTime;
    };

    tryam = () => {
        this.setState({
            visible2: true,
        });

    }
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

    onNewWishList = () => {
        this.setState({
            newWish: true,
        });
    };

    ym = () => {
        return (
            "<script src='https://mc.yandex.ru/metrika/watch.js' type='text/javascript'></script>\
            <script type='text/javascript'>\
                  try {\
                        var yaCounter57428827 = new Ya.Metrika({\
                        id:57428827,\
                        clickmap:true,\
                        trackLinks:true,\
                        accurateTrackBounce:true,\
                        webvisor:true,\
                        trackHash:true\
                        });\
                  } catch(e) {console.log('error') }\
            </script>"
        );
    };

    render() {
        const { TabPane } = Tabs;
        const { cities } = this.state;
        const userMainInfo = JSON.parse(localStorage.getItem('userMainInfo'));
        let searchFlag;
        const { getFieldDecorator } = this.props.form;
        return (


            <div>
                {(this.state.loading || !this.props.users) && (
                    <div style={{ textAlign: "center", marginTop: '10px' }}>
                        <Spin size="small" tip="Загрузка..." />
                    </div>
                )}
                {this.props.users && (
                    <p style={{ fontSize: "25px" }} align={"center"}>
                        {/* {this.props.user.crewRole === 'капитан' && ('Приветственное сообщение для капитана')}   {this.props.user.crewRole === 'пилот' && ('Приветственное сообщение для пилота')} */}
                        Добро пожаловать, {this.props.user.firstName}!
                    </p>


                )}



                <button onClick={this.onNewWishList}>Новая заявка</button>
                {this.state.newWish && (
                    < div className="dashBoardContainer">

                        <div className="dashBoardContentDrag borderDesign" style={{ borderColor: "4px double black;" }}>


                            <Card size="small"
                                className="userCardSlider"
                            >
                                <div style={{ textAlign: "left", height: '300px' }}>
                                    <ItemList />
                                </div>
                                {/* <div className='buttonCardSlider'>Кнопка</div> */}

                                <button className='buttonCardSlider' style={{ float: 'right', marginRight: '10px' }} onClick={this.stepWishD2} ><span style={{ marginLeft: '10px' }}>🡲</span><span style={{ marginLeft: '35px' }}>Далее</span> </button>
                                {/* <Button className='buttonCardSlider'>Кнопка</Button> */}

                            </Card>
                        </div>
                    </div >
                )
                }
                <Collapse>
                    <Panel header="Фильтры по моему расписанию" key="1">
                        <div className="dashBoardContainerMoreFiltres">
                            <div className="dashBoardContentMoreFiltres">
                                <Card size="small" title="Длительность смены"
                                    className="userCard"
                                >
                                    <div style={{ textAlign: "left" }}>
                                        <Switch defaultChecked onChange={this.onChangeLongWork} /> Трансатлантические рейсы
                                    </div>
                                    <div style={{ textAlign: "left" }}>
                                        <Switch defaultChecked onChange={this.onChangeShortWork} /> Короткие разворотные рейсы
                                    </div>

                                </Card>
                                <Card size="small" title="Время полета" className="userCard">
                                    <div style={{ marginLeft: 'auto', marginRight: 'auto', width: 'auto' }}>
                                        <Slider range value={[this.state.minPrice, this.state.maxPrice]} max={24}
                                            onChange={this.onChangeTime}
                                            defaultValue={[this.state.minTime, this.state.maxTime]}
                                            marks={{ 0: 'ч', 24: 'ч.' }} />
                                    </div>
                                </Card>

                                <Card size="small" title="Время полета" className="userCard">
                                    <div style={{ textAlign: "left" }}>
                                        <Switch defaultChecked onChange={this.onChangeMorning} /> Утро
                                    </div>
                                    <div style={{ textAlign: "left" }}>
                                        <Switch defaultChecked onChange={this.onChangeDay} /> День
                                    </div>

                                </Card>

                                <Card size="small" title="Время полета" className="userCard">
                                    <div style={{ textAlign: "left" }}>
                                        <Switch defaultChecked onChange={this.onChangeEvening} /> Вечер
                                    </div>
                                    <div style={{ textAlign: "left" }}>
                                        <Switch defaultChecked onChange={this.onChangeNight} /> Ночь
                                    </div>

                                </Card>
                            </div>
                        </div>
                    </Panel>


                </Collapse>


                <div className="dashBoardContainer">

                    <div className="dashBoardContent">
                        <Suspense fallback={<h1>Loading posts...</h1>}>
                            {this.props.users.response &&


                                this.props.users.response.map((user, i) => {

                                    // if (this.filterPrise(user.time)) {
                                    if (user.city_photo) {
                                        let srcImg;
                                        if (!user.city_photo) {
                                            srcImg = user.city_photo;
                                        } else {
                                            srcImg = plane;
                                        }
                                        return (

                                            <div key={i}>

                                                <Card width='100%'
                                                    onClick={() => this.showModal(user)}
                                                    className="userCard hoverCard"
                                                    cover={
                                                        <img
                                                            style={{ borderRadius: "10px 10px 0px 0px" }}
                                                            alt="example"
                                                            src={srcImg}
                                                        />
                                                    }
                                                    type="inner" title="Рейс"
                                                >
                                                    <div>
                                                        <h3 style={{ float: "left" }}>
                                                            {user.where_from} - {user.where_to}
                                                        </h3>
                                                    </div>
                                                </Card>
                                            </div>
                                        );
                                    }
                                })}
                        </Suspense>
                    </div>

                    {this.state.modalUser && (
                        <div className='modalWidth'>
                            <Modal

                                title="Детали полета"
                                visible={this.state.visible2}
                                onCancel={this.handleCancel2}

                                footer={[

                                ]}
                            >
                                <div style={{ textAlign: 'center' }} >
                                    Детальная информация по полету
                                </div>
                            </Modal>
                        </div>
                    )}

                    {this.state.modalUser && (
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
                                    
                                    <Icon
                                        type="heart"
                                        theme="twoTone"
                                        twoToneColor="#eb2f96"
                                        style={{ fontSize: "62px", float: "right" }}
                                        onClick={this.isLike}
                                    /> */}
                                </div>
                            ]}
                        >
                            <div style={{ textAlign: 'center' }} onClick={() => this.tryam()} >
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
                                        <div style={{ textAlign: 'center' }}>
                                            <img style={{ width: '130px', align: 'center' }} src={logo} alt="" />
                                        </div>

                                        <br />
                                        <Tag color="green">
                                            <div style={{ color: 'black', fontSize: '18px' }}>
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

                                                        <div style={{ color: 'black' }}>Время в полете:</div>
                                                        <div className={'fontModal'}>{this.state.modalUser.flight_time}
                                                        </div>

                                                    </p>
                                                } type="info" />
                                                <Alert message={
                                                    <p>
                                                        <div style={{ color: 'black' }}>Название аэропорта</div>
                                                        <div
                                                            className={'fontModal'}>{this.state.modalUser.airport_name
                                                            }
                                                        </div>
                                                    </p>
                                                } type="info" />
                                                <Alert message={
                                                    <p>
                                                        <div style={{ color: 'black' }}>Уровень сложности аэропорта</div>
                                                        <div className={'fontModal'}>{this.state.modalUser.level_flights
                                                        }
                                                        </div>

                                                    </p>
                                                } type="info" />

                                                <Alert message={
                                                    <p>
                                                        <div style={{ color: 'black' }}>Отправление - прибытие</div>
                                                        <div
                                                            className={'fontModal'}>{this.state.modalUser.time_of_departure
                                                            } - {this.state.modalUser.time_of_arrival
                                                            }</div>
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
                                                            className={'fontModal'}>Информация</div>
                                                    </p>
                                                } type="info" />
                                            </TabPane>

                                        </Tabs>
                                    </div>
                                    {document.getElementById('container')}
                                </div>

                            </p>
                        </Modal>

                    )}

                    <div className="site-card-border-less-wrapper" style={{ backgroundColor: '#EDEEF0', padding: '21px' }}>
                        <div className="site-calendar-demo-card" style={{ backgroundColor: 'lightblue' }}>
                            <CalendarWithButtons onPanelChange={onPanelChange} />
                        </div>

                        <Card className="userCard hoverCard" onClick={() => this.showWant()} bordered={false} style={{ width: 200, backgroundColor: '#4975A7', color: 'white' }}   >
                            <div style={{ textAlign: 'center', fontSize: '21px', paddingBottom: '5px' }}>
                                Новая заявка
                            </div>
                        </Card>

                        <Card width='100%'
                            // onClick={() => this.showModal()}
                            className="userCard hoverCard"
                            // cover={
                            //     <img
                            //         style={{ borderRadius: "10px 10px 0px 0px" }}
                            //         alt="example"
                            //         src={'https://avatars.mds.yandex.net/get-kinopoisk-post-img/1362954/454f9731e6c530fbb8eb903620d30df1/960x540'}
                            //     />
                            // }
                            type="inner" title="Заявка на октябрь 2020 г."
                        >


                            {this.props.user.wishForm &&


                                this.props.user.wishForm.map((user, key) =>
                                    <h3 style={{ float: "left" }}>

                                        <div>
                                            <h5 style={{ float: "left" }}>
                                                Направление
                                            </h5>
                                            <h3 style={{ float: "left", color: 'blue' }}>
                                                {user.longFly}
                                            </h3>

                                            <h5 style={{ float: "left" }}>
                                                Продолжительность рабочей смены
                                            </h5>
                                            <h3 style={{ float: "left", color: 'blue' }}>
                                                {user.timeFly}
                                            </h3>

                                            <h5 style={{ float: "left" }}>
                                                Желание дополнительной подработки
                                            </h5>

                                            <h3 style={{ float: "left", color: 'blue' }}>
                                                {user.otherTime}
                                            </h3>

                                            <h5 style={{ float: "left" }}>
                                                Предпочтительное время вылета
                                            </h5>
                                            <h3 style={{ float: "left", color: 'blue' }}>
                                                {user.preferenceTimeFly}
                                            </h3>
                                        </div>
                                    </h3>
                                )}

                            {/* {this.props.user.wishForm.map((user, i) => {

                                return (<div key={i}>


                                    <h3 style={{ float: "left" }}>
                                        {user.preferenceTimeFly} - {user.preferenceTimeFly}
                                    </h3>

                                </div>
                                );
                            })
                            } */}


                        </Card>

                        <Card className="userCard" title="Заявка на сентябрь 2020 г." bordered={false} style={{ width: 300 }}>
                            <p>Короткие разворотные рейсы</p>
                            <p>Длительная смена</p>
                            <p>Хочу работать с переработками</p>
                            <p>Ночь</p>

                        </Card>
                        <Card className="userCard" title="Заявка на август 2020 г." bordered={false} style={{ width: 300 }}>
                            <p>Трансатлантические рейсы</p>
                            <p>Короткая смена</p>
                            <p>Переработки в этом месяце не нужны</p>
                            <p>Вечер</p>

                        </Card>
                    </div>
                </div>



                <div className='modalWidth'>
                    <Modal
                        width="800px"
                        title="Новая заявка"
                        visible={this.state.visibleWant}
                        onCancel={this.handleCancelWant}

                        footer={[

                        ]}
                    >
                        <div style={{ textAlign: 'center' }} >
                            <div className="wantForm">
                                <Card style={{ borderRadius: '20px', marginTop: '0%', marginBottom: '0%', width: '450px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        {/* <img style={{ width: '130px' }} src={logo} alt="" /> */}
                                        <h2 style={{ color: '#4a76a8', margin: '0 !important' }}>Форма учета Ваших пожеланий на октябрь 2020 г.</h2>
                                        <h3 style={{ color: '#4a76a8', margin: '0 !important' }}>Пожалуйста, заполните и проверьте все поля</h3>
                                    </div>
                                    <br />
                                    <Form onSubmit={this.handleSubmit}>
                                        {/* <Form.Item>
                            {getFieldDecorator('town', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Пожалуйста, введите город!',
                                    },
                                ],
                            })(
                                <Select
                                    showSearch
                                    placeholder="Ваш город"
                                    style={{ width: 260 }}
                                >
                                    <Option value="Москва">Москва</Option>
                                    <Option value="Санкт-Петербург">Санкт-Петербург</Option>
                                    <Option value="Казань">Казань</Option>
                                    <Option value="Екатеринбург">Екатеринбург</Option>
                                    <Option value="Нижний Новгород">Нижний Новгород</Option>
                                    <Option value="Новосибирск">Новосибирск</Option>
                                    <Option value="Самара">Самара</Option>
                                    <Option value="Хабаровск">Хабаровск</Option>
                                    <Option value="Чита">Чита</Option>
                                </Select>

                            )}
                        </Form.Item> */}
                                        <h3 style={{ color: 'black', margin: '0 !important' }}>Направление полета</h3>

                                        <Form.Item style={{ color: 'black', margin: '0 !important' }}>
                                            {getFieldDecorator('longFly', {
                                                rules: [{ required: true, message: 'Пожалуйста, укажите направление полета' }],
                                            })(
                                                <Select
                                                    showSearch
                                                    placeholder="Направление"

                                                >
                                                    <Option value="Трансатлантические рейсы">Трансатлантические рейсы</Option>
                                                    <Option value="Короткие разворотные рейсы">Короткие разворотные рейсы</Option>

                                                </Select>

                                            )}
                                        </Form.Item>
                                        <h3 style={{ color: 'black' }}>Продолжительность рабочей смены</h3>
                                        <Form.Item>
                                            {getFieldDecorator('timeFly', {
                                                rules: [{ required: true, message: 'Пожалуйста, укажите продолжительность рабочей смены' }],
                                            })(
                                                <Select
                                                    showSearch
                                                    placeholder="Продолжительность смены"

                                                >
                                                    <Option value="Длительная смена">Длительная</Option>
                                                    <Option value="Короткая смена">Короткая</Option>

                                                </Select>

                                            )}
                                        </Form.Item>
                                        <h3 style={{ color: 'black' }}>Переработка</h3>
                                        <Form.Item>
                                            {getFieldDecorator('otherTime', {
                                                rules: [{ required: true, message: 'Пожалуйста, укажите время переработки' }],
                                            })(
                                                <Select
                                                    showSearch
                                                    placeholder="Переработка"

                                                >
                                                    <Option value="Хочу работать с переработкой">Хочу работать с переработкой</Option>
                                                    <Option value="Переработки в этом месяце не нужны">Переработки в этом месяце не нужны</Option>

                                                </Select>

                                            )}
                                        </Form.Item>
                                        <h3 style={{ color: 'black' }}>Предпочтительное время вылета</h3>
                                        <Form.Item>
                                            {getFieldDecorator('preferenceTimeFly', {
                                                rules: [{ required: true, message: 'Пожалуйста, укажите предпочтительное время вылета' }],
                                            })(
                                                <Select
                                                    showSearch
                                                    placeholder="Время вылета"

                                                >
                                                    <Option value="Утро">Утро</Option>
                                                    <Option value="Вечер">Вечер</Option>
                                                    <Option value="День">День</Option>
                                                    <Option value="Ночь">Ночь</Option>
                                                </Select>

                                            )}
                                        </Form.Item>
                                        <Form.Item>
                                            <Button style={{ backgroundColor: '#4A76A8', color: '#ffffff' }} htmlType="submit" className="login-form-button" loading={this.state.iconLoading} icon='login'>
                                                Отправить
                            </Button>
                                            <div style={{ textAlign: 'center' }}>

                                            </div>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </div >
                        </div>
                    </Modal>
                </div>



                {/* <div className="dashBoardContainer">

                    <div className="dashBoardContent">

                        <div className="site-card-border-less-wrapper">
                            <Card title="Рейс" bordered={false} style={{ width: 300 }}>
                                <p>Откуда: Москва</p>
                                <p>Куда: Париж</p>
                                <p>Дата: 25.08.2020</p>
                            </Card>
                        </div>

                        <div className="site-card-border-less-wrapper">
                            <Card title="Рейс" bordered={false} style={{ width: 300 }}>
                                <p>Откуда: Москва</p>
                                <p>Куда: Париж</p>
                                <p>Дата: 25.08.2020</p>
                            </Card>
                        </div>
                        <div className="site-card-border-less-wrapper">
                            <Card title="Рейс" bordered={false} style={{ width: 300 }}>
                                <p>Откуда: Москва</p>
                                <p>Куда: Париж</p>
                                <p>Дата: 25.08.2020</p>
                            </Card>
                        </div>
                        <div className="site-card-border-less-wrapper">
                            <Card title="Рейс" bordered={false} style={{ width: 300 }}>
                                <p>Откуда: Москва</p>
                                <p>Куда: Париж</p>
                                <p>Дата: 25.08.2020</p>
                            </Card>
                        </div>

                        <div className="site-card-border-less-wrapper">
                            <Card title="Рейс" bordered={false} style={{ width: 300 }}>
                                <p>Откуда: Москва</p>
                                <p>Куда: Париж</p>
                                <p>Дата: 25.08.2020</p>
                            </Card>
                        </div>
                        <div className="site-card-border-less-wrapper">
                            <Card title="Рейс" bordered={false} style={{ width: 300 }}>
                                <p>Откуда: Москва</p>
                                <p>Куда: Париж</p>
                                <p>Дата: 25.08.2020</p>
                            </Card>
                        </div>
                        <div className="site-card-border-less-wrapper">
                            <Card title="Рейс" bordered={false} style={{ width: 300 }}>
                                <p>Откуда: Москва</p>
                                <p>Куда: Париж</p>
                                <p>Дата: 25.08.2020</p>
                            </Card>
                        </div>

                        <div className="site-card-border-less-wrapper">
                            <Card title="Рейс" bordered={false} style={{ width: 300 }}>
                                <p>Откуда: Москва</p>
                                <p>Куда: Париж</p>
                                <p>Дата: 25.08.2020</p>
                            </Card>
                        </div>
                        <div className="site-card-border-less-wrapper">
                            <Card title="Рейс" bordered={false} style={{ width: 300 }}>
                                <p>Откуда: Москва</p>
                                <p>Куда: Париж</p>
                                <p>Дата: 25.08.2020</p>
                            </Card>
                        </div>

                    </div>


                    <div className="site-card-border-less-wrapper">
                        <div className="site-calendar-demo-card" style={{ backgroundColor: 'lightblue' }}>
                            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                        </div>
                        <Card title="Хотелки на ноябрь" bordered={false} style={{ width: 300 }}>
                            <p>Короткие полеты</p>
                            <p>Утром</p>
                            <p>В Рио-де-Жанейро</p>
                        </Card>
                        <Card title="Хотелки на октябрь" bordered={false} style={{ width: 300 }}>
                            <p>Длительные полеты</p>
                            <p>Вечером</p>
                            <p>В Хабаровск</p>
                        </Card>
                    </div>
                </div> */}



                <footer style={{ backgroundColor: '#4A76A8', color: '#ffffff', margin: '0 auto', width: "80%" }}
                    align={"center"}>
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
        user: store.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addUser: user => {
            dispatch(AddUserAC(user));
        },
        addPhotos: photos => {
            dispatch(AddPhotoAC(photos))
        },
        AddUsersDashBoard: users => {
            dispatch(AddUsersDashBoard(users));
        }
    };
}

const WantForm = Form.create({ name: 'dashBoard' })(DashBoard);
export default connect(mapStateToProps, mapDispatchToProps)(WantForm);