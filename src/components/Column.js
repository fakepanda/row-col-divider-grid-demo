import React, { Component } from 'react';

class Column extends Component {
  render() {
    const classNames = ['col'];
    classNames.push(this.props.id ? `row-${this.props.id}` : '');
    const style = styles.colStyle;
    style.flexGrow = this.props.width;
    return (
      <div className={classNames.join(' ')} style={style}>
        {'Col' + this.props.id}
      </div>
    );
  }
}

const styles = {
  colStyle: {
    backgroundColor: '#ffa69e',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#333',
    padding: 5
  }
};

export default Column;
