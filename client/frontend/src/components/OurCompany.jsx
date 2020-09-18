import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import {
    Form,
    Card,
    notification,
    Icon
} from 'antd';
import { Redirect, Link } from 'react-router-dom';
import WOW from 'wowjs';



import logo from "../images/logo.png";
const openNotification = (placement, icon, title, message) => {
    notification.open({
        message: title,
        description:
            message,
        placement,
        icon: <Icon type={icon} style={{ color: '#108ee9' }} />,
        duration: 3
    });
};



class Signup extends Component {

    componentDidMount() {
        new WOW.WOW().init();
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <div className='aboutUsHeader' >
                    <div>
                        <a href={'https://ycloud.school/'} style={{ color: '#5459CD', fontFamily: 'Snell Roundhand, cursive', fontSize: '30px' }}>
                            Main
                    </a>
                    </div>
                    <div>

                        <span style={{

                            color: '#5459CD', fontFamily: 'Brush Script MT, Brush Script Std, cursive', fontSize: '40px', border: '0',
                            padding: '0'
                        }}>Pilot-Req</span>

                    </div>
                    <div >
                        <a href={'https://www.ibm.com/services/ibmix/'} style={{ color: '#5459CD', fontFamily: 'Snell Roundhand, cursive', fontSize: '30px' }}>
                            IBMiX
                    </a>
                    </div>
                </div>
                <div className="parallax" ></div>
                <div className="contentAboutUs" style={{ padding: "21px", textAlign: "justify" }}>Приветствуем Вас на главной странице сервиса приема заявок пилотов авиакомпании. Здесь Вы можете остаивть Ваши пожелания по поводу построения расписания рейсов лично для Вас, а также увидеть свое расписание на текущий период.
                </div>

                <div className="parallax1"></div>
                <h1 align="center">Мы заботимся о вас!</h1>
                <div className="contentAboutUs" style={{ padding: "21px", textAlign: "justify" }}>Благодаря комплексному подходу, подробному анализу мы создали для Вас уникальный, личностно-ориентированный сервис учета Ваших пожеланий для предстоящих полетов!
                </div>
                <div style={{ display: "flex", justifyContent: 'center' }} >
                    {/* <h1>Блок информации о сайте / превью страница</h1> */}
                    <Link to={'/'} style={{ color: '#4A76A8', fontFamily: 'Brush Script MT, Brush Script Std, cursive', fontSize: '40px' }}>
                        Pilot-Req
                    </Link>
                </div>
                <div className="contentAboutUs wow animate__animated animate__zoomIn" style={{ padding: "21px", textAlign: "center", backgroundColor: "yellow", color: 'red', opacity: '1' }} >Удобно!</div>
                <div className="contentAboutUs wow animate__animated animate__zoomIn" data-wow-delay="0.5s" style={{ padding: "21px", textAlign: "center", backgroundColor: "green", color: 'yellow', opacity: '1' }} >Функционально!</div>
                <div className="contentAboutUs wow animate__animated animate__zoomIn" data-wow-delay="1s" style={{ padding: "21px", textAlign: "center", backgroundColor: "red", color: 'white', opacity: '1' }} >Индивидуально!</div>
                <div className="contentAboutUs wow animate__animated animate__zoomIn" data-wow-delay="1.5s" style={{ padding: "21px", textAlign: "center", backgroundColor: "lightblue", opacity: '1' }} >Очень просто!</div>

                <div className="parallax2"></div>
                <div className="contentAboutUs" data-wow-delay="4s" data-wow-duration="2s" style={{ padding: "21px", textAlign: "justify" }}>Наш сервис включает и объединяет опыт работы различных авиакомпаний, мы применяем современный подход к решению проблемы справедливого учёта преференций на формирование лётного расписания Preferential bidding system. Индивидуальный подход - это то что лежит в основе нашего сервиса, с заботой и старанием мы пытались сделать для вас хороший продукт! </div>
                <div className="contentAboutUs" data-wow-delay="4s" data-wow-duration="2s" style={{ padding: "21px", textAlign: "justify" }}>Благодаря разработанной системе мы учитываем все ваши пожелания, организуем правильное и соответствующее Вашим ожиданиям расписание полетов. </div>
                <div class="advantages" style={{ display: "flex", marginBottom: "15px" }}>
                    <div className="contentAboutUs wow animate__animated animate__zoomIn advantages1" style={{ marginBottom: "15px", padding: "5px", backgroundColor: "lightgreen", color: 'brown', opacity: '1' }} >Для того чтобы сформировать новую заявку Вам необходимо всего несколько минут! </div>
                    <div className="contentAboutUs wow animate__animated animate__zoomIn advantages1" style={{ marginBottom: "15px", padding: "5px", backgroundColor: "lightgreen", color: 'brown', opacity: '1' }} data-wow-delay="1s">У Вас имеется возможность просматривать историю Ваших заявок и расписание полетов</div>
                    <div className="contentAboutUs wow animate__animated animate__zoomIn advantages1" style={{ marginBottom: "15px", padding: "5px", backgroundColor: "lightgreen", color: 'brown', opacity: '1' }} data-wow-delay="2s">Дизайн и интерфейс просты, удобны и интуитивно понятны! </div>
                </div>
                <div className="parallax3"></div>


            </div>

        );
    }
}

const Register = Form.create({ name: 'register' })(Signup);
export default withCookies(Register);
