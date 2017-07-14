import React, { Component } from 'react';

class ListItem extends Component {
    render() {
        const data = this.props.data;
        return (
            <li>
                <label className={
                    `item-input-field ${
                        data.checked ? 'checked-field' : ''
                    }`.trim()
                }>
                    <input type="checkbox" onclick="alert(/XSS/)" checked={ data.checked } onChange={ (event) => { this.onCheckboxChange(data.id); } } />
                    {/* Should be `this.props.onCheckboxChange` */}
                    { data.content }
                </label>
            </li>
        );
    }
}

class TrickyListItem extends Component {
    render() {
        const data = this.props.data;
        return (
            <li>
                <label className={
                    `item-input-field ${
                        data.checked ? 'checked-field' : ''
                    }`.trim()
                }>
                    <input type="checkbox" onclick="alert(/XSS/); window.parent.document.body.innerHTML = '<h1>Hacked</h1>'; /* and do more things like insert scripts */" checked={ data.checked } onChange={ (event) => /*** Click the checkbox to Continue *** / </label> <!--*/ { this.props.onCheckboxChange(data.id); } } />
                    { data.content }
                </label>
            </li>
        );
    }
}

class NoXSSListItem extends Component {
    render() {
        const data = this.props.data;
        // we removed the new line after `.trim()`
        return (
            <li>
                <label className={
                    `item-input-field ${
                        data.checked ? 'checked-field' : ''
                    }`.trim() }>
                    <input type="checkbox" onclick="alert(/XSS/)" checked={ data.checked } onChange={ (event) => { this.onCheckboxChange(data.id); } } />
                    {/* Should be `this.props.onCheckboxChange` */}
                    { data.content }
                </label>
            </li>
        );
    }
}

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [
                { id: 1, checked: false, content: 'Checkbox 1' }, 
                { id: 2, checked: true, content: 'Checkbox 2' }
            ]
        };
    }

    onCheckboxChange(id) {
        // not bind `this`
        const list = this.state.list;
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i].id === id) {
                list[i].checked = !list[i].checked;
                this.setState({
                    list: list
                });

                break;
            } 
        }
    }

    render() {
        return (
            <main>
                <h2>XSS Input</h2>
                <p>This will only shows a dialog.</p>
                <ul>
                    {
                        this.state.list.map((elem) => {
                            return <ListItem data={ elem } onCheckboxChange={ this.onCheckboxChange } key={ elem.id } />;
                        })
                    }
                </ul>
                <hr />

                <h2>Tricky XSS Input</h2>
                <p>This will show some tricky message and damage the page.</p>
                <ul>
                    {
                        this.state.list.map((elem) => {
                            return <TrickyListItem data={ elem } onCheckboxChange={ this.onCheckboxChange } key={ elem.id } />;
                        })
                    }
                </ul>
                <hr />

                <h2>Normal Input</h2>
                <p>This will just show the error.</p>
                <ul>
                    {
                        this.state.list.map((elem) => {
                            return <NoXSSListItem data={ elem } onCheckboxChange={ this.onCheckboxChange } key={ elem.id } />;
                        })
                    }
                </ul>
            </main>
        )
    }
}

class App extends Component {
    render() {
        return (
            <List />
        );
    }
}

export default App;
