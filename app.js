const CommandRow = {
    view: (vnode) => {
        const { command, dateString } = vnode.attrs
        return (
            m('tr', [
                m('td', dateString),
                m('td', command),
                m('td',
                    m('button', { onclick: () => navigator.clipboard.writeText(command)}, "Copy")
                )
            ])
        )
    }

}

const CommandList = {
    timestamp: null,
    setTimestamp: (ts) => {
        CommandList.timestamp = ts
        m.redraw()
    },
    formatDate(format) {
        if (format === 'offset') {
            return dayjs.unix(CommandList.timestamp).fromNow()
        } else {
            return dayjs.unix(CommandList.timestamp).format(format)
        }
        
    },
    view: () =>
        m('.commands', [
            CommandList.timestamp && [
                m('table', [
                    m('thead', [
                        m('th', "Text"),
                        m('th', "Command"),
                        m('th', "")
                    ]),
                    m(CommandRow, { command: `<t:${CommandList.timestamp}>`, dateString: `${CommandList.formatDate('D MMMM YYYY HH:mm')}`}),
                    m(CommandRow, { command: `<t:${CommandList.timestamp}:F>`, dateString: `${CommandList.formatDate('dddd D MMMM YYYY HH:mm')}`}),
                    m(CommandRow, { command: `<t:${CommandList.timestamp}:D>`, dateString: `${CommandList.formatDate('D MMMM YYYY')}`}),
                    m(CommandRow, { command: `<t:${CommandList.timestamp}:R>`, dateString: `${CommandList.formatDate('offset')}`}),
                ])
            ]
        ])
}

const DatePicker = {
    oncreate: () => {
        flatpickr('#datepicker', {
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
            altInput: true,
            altFormat: 'h:iK D J M',
            onChange: (selectedDates) => {
                if (selectedDates && selectedDates.length > 0) {
                    const selectedDate = selectedDates[0]
                    const d = new Date(selectedDate)
                    const timestamp = Math.floor(d/1000)
                    CommandList.setTimestamp(timestamp)
                }
            }
        })
    },
    view: () =>
        m('.datepicker', [
            m('.picker-label', "Enter a date and choose a command:"),
            m('input#datepicker', { placeholder: 'Select Date...' })
        ])
        
}

const App = {
    view: () =>
        m('.container', [
            m(DatePicker),
            m(CommandList)
        ])
}

dayjs.extend(window.dayjs_plugin_relativeTime)
m.mount(document.getElementById('app'), App)