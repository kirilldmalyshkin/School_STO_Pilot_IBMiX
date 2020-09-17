import React, { Suspense, Component } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar as ModernCalendar } from "react-modern-calendar-datepicker";
import './Calendar.css'
class Calendar extends Component {

    render() {
        const myCustomLocale = {
            // months list by order
            months: [
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь',
            ],

            // week days by order
            weekDays: [

                {
                    name: 'Понедельник',
                    short: 'Пн',
                },
                {
                    name: 'Вторник',
                    short: 'Вт',
                },
                {
                    name: 'Среда',
                    short: 'Ср',
                },
                {
                    name: 'Четверг',
                    short: 'Чт',
                },
                {
                    name: 'Пятница',
                    short: 'Пт',
                },
                {
                    name: 'Суббота',
                    short: 'Сб',
                    isWeekend: true,
                },
                {
                    name: 'Воскресенье', // used for accessibility 
                    short: 'Вс', // displayed at the top of days' rows
                    isWeekend: true, // is it a formal weekend or not?
                },
            ],

            // just play around with this number between 0 and 6
            weekStartingIndex: 6,

            // return a { year: number, month: number, day: number } object
            getToday(gregorainTodayObject) {
                return gregorainTodayObject;
            },

            // return a native JavaScript date here
            toNativeDate(date) {
                return new Date(date.year, date.month - 1, date.day);
            },

            // return a number for date's month length
            getMonthLength(date) {
                return new Date(date.year, date.month, 0).getDate();
            },

            // return a transformed digit to your locale
            transformDigit(digit) {
                return digit;
            },

            // texts in the date picker
            nextMonth: 'Следующий месяц',
            previousMonth: 'Предыдущий месяц',
            openMonthSelector: 'Открыть выбор месяца',
            openYearSelector: 'Открыть выбор года',
            closeMonthSelector: 'Закрыть выбор месяца',
            closeYearSelector: 'Закрыть выбор года',
            defaultPlaceholder: 'Выбрать...',

            // for input range value
            from: 'с',
            to: 'до',


            // used for input value when multi dates are selected
            digitSeparator: ',',

            // if your provide -2 for example, year will be 2 digited
            yearLetterSkip: 0,

        }

        let days = this.props.highlighted;
        console.log('Снова видны даты', days)
        if (days) {
            days.forEach(day => {
                day.className = 'workDay'
            });
        }
        return (
            <ModernCalendar value={this.props.value} colorPrimary="#7D58FF" onChange={this.props.onChange} minimumDate={this.props.minimumDate} maximumDate={this.props.maximumDate} calendarClassName='responsive-calendar' customDaysClassName={days} locale={myCustomLocale} />

            // <ModernCalendar value={this.props.value} colorPrimary="#7D58FF" minimumDate={this.props.minimumDate} maximumDate={this.props.maximumDate} calendarClassName='responsive-calendar' customDaysClassName={days} locale={myCustomLocale} />
        )
    }
}
export default Calendar;