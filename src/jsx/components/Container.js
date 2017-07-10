import React from 'react'

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      setting: false
    };
  }

  render() {
    let {loading, setting} = this.state;
    let i = 0;
    return(
      <div id="content">
        Electron MenuBar React Test
      </div>
    );
    }
}

