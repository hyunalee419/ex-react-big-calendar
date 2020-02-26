import React from 'react'
import {Calendar, momentLocalizer, Views} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from "moment";
import './calendar.scss';

const DragAndDropCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

class Dnd extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            events: [
                {
                    id: 0,
                    title: 'All Day Event very long title',
                    allDay: true,
                    start: new Date(2015, 3, 0),
                    end: new Date(2015, 3, 1),
                },
                {
                    id: 1,
                    title: 'Long Event',
                    start: new Date(2015, 3, 7),
                    end: new Date(2015, 3, 10),
                },

                {
                    id: 2,
                    title: 'DTS STARTS',
                    start: new Date(2016, 2, 13, 0, 0, 0),
                    end: new Date(2016, 2, 20, 0, 0, 0),
                }
            ]
        }

        this.moveEvent = this.moveEvent.bind(this)
        this.newEvent = this.newEvent.bind(this)
    }

    eventStyleGetter = (event, start, end, isSelected) => {
        console.log(event);
        let backgroundColor = '#' + event.hexColor;
        let style = {
            backgroundColor: backgroundColor,
            borderRadius: '0px',
            opacity: 0.8,
            color: 'black',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    }

    moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
        const { events } = this.state

        const idx = events.indexOf(event)
        let allDay = event.allDay

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false
        }

        const updatedEvent = { ...event, start, end, allDay }

        const nextEvents = [...events]
        nextEvents.splice(idx, 1, updatedEvent)

        this.setState({
            events: nextEvents,
        })

        // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
    }

    resizeEvent = ({ event, start, end }) => {
        const { events } = this.state

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id == event.id
                ? { ...existingEvent, start, end }
                : existingEvent
        })

        this.setState({
            events: nextEvents,
        })

        //alert(`${event.title} was resized to ${start}-${end}`)
    }

    newEvent = (event) => {
        console.log(event.start.toUTCString())
        let hour = {
          id: this.state.events.length,
          title: 'New Event',
          allDay: event.slots.length === 1,
          start: event.start,
          end: event.end,
        }
        this.setState({
          events: this.state.events.concat([hour]),
        })
    }

    render() {
        return (
            <DragAndDropCalendar
                selectable
                localizer={localizer}
                events={this.state.events}
                onEventDrop={this.moveEvent}
                resizable
                onEventResize={this.resizeEvent}
                onSelectSlot={this.newEvent}
                onDragStart={console.log}
                defaultView={Views.MONTH}
                defaultDate={new Date(2015, 3, 12)}
                eventPropGetter={this.eventStyleGetter}
                style={{ height: 500 }}
            />
        )
    }
}

export default Dnd;
