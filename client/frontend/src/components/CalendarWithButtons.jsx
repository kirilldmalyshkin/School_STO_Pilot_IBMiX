import React, { Suspense, Component } from "react";
import moment from 'moment';
import Calendar from './Calendar';
import {
  Card,
  Button
} from "antd";
class CalendarMenu extends Component {
  constructor(props) {
    super(props);
    // const fadeAnim = useRef(new Animated.Value(0)).current
    this.fillerRef = React.createRef();
  }

  componentDidMount() {
    // const filler = this.fillerRef.current;
    // filler.classList.toggle('filled');
  }
  render() {
    return (
      <div>
        <div className='calendar' ref={this.fillerRef}></div>
        <Card style={{ position: "relative" }}>
          <Button style={{ position: 'absolute', width: '30px', height: '30px', top: '20px', right: '20px', cursor: 'pointer' }} onClick={this.props.onExit}>X</Button>
          <p>Здесь будут предпочтения</p>
          <p>на этот день</p>
          <Button>Создать предпочтение</Button>
        </Card>
      </div>

    )
  }
}

const lastDate = moment(new Date().setMonth(new Date().getMonth() + 0))
class CalendarWithButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenu: false
    }
  }
  componentDidMount() {

  }

  render() {
    return (
      <div>
        {this.state.isMenu ? <CalendarMenu onExit={() => { this.setState({ isMenu: false }) }} /> : <Calendar highlighted={this.props.highlighted} onChange={() => { this.setState({ isMenu: true }); }} />}
      </div>
    )
  }
}

export default CalendarWithButtons;