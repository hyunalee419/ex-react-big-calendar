import React from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import './App.css';
import './calendar.scss';

const DragAndDropCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

function App() {
    const [ events, setEvents ] = React.useState([{
        title: <>hello 오후 2시</>,
        start: moment(),
        end: moment(),
        allDay: true,
        // resource?: any,
    }, {
        title: '타임 일정',
        start: moment().add(1, 'day'),
        end: moment().add(1, 'day').add(2, "hour"),
        resource: 'resource'
    }]);

    const eventStyleGetter = (event, start, end, isSelected) => {
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
    };

    const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
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

        setEvents(nextEvents);

        // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
    }

    const resizeEvent = ({ event, start, end }) => {
        for (let i = 0, eventLen = events.length; i < eventLen; i++) {
            if (events[i].id === event.id) {
                events[i] = { ... events[i], start, end };
                break;
            }
        }
        // const nextEvents = events.map(existingEvent => {
        //     return existingEvent.id == event.id
        //         ? { ...existingEvent, start, end }
        //         : existingEvent
        // })

        setEvents(events);

        //alert(`${event.title} was resized to ${start}-${end}`)
    }

    const newEvent = (event) => {
        console.log(event)
        // let idList = this.state.events.map(a => a.id)
        // let newId = Math.max(...idList) + 1
        let hour = {
            // id: newId,
            title: 'New Event',
            allDay: event.slots.length === 1,
            start: moment(event.start),
            end: moment(event.end),
        }
        events.push(hour);
        setEvents(events);
        // this.setState({
        //   events: this.state.events.concat([hour]),
        // })
    }
    return (
        <div className="App">
            <DragAndDropCalendar
                selectable
                onEventDrop={moveEvent}
                resizable
                onEventResize={resizeEvent}
                onSelectSlot={newEvent}
                onDragStart={console.log}
                // defaultView={Views.MONTH}
                // defaultDate={new Date(2015, 3, 12)}

                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                style={{ height: 500 }}
            />
        </div>
    );
}

export default App;
