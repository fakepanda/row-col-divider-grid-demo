import React, { Component } from 'react';

class Column extends Component {
  render() {
    const classNames = ['col'];
    classNames.push(this.props.id ? `row-${this.props.id}` : '');
    const style = styles.colStyle;

    /**
     * see css-grid specs
     * grid-column: <start-column> / <end-column>
     * 
     * 0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20
     * --------+-------+-------+-------+-------+-------+-------+-------+-------+-------+
     * |       |               |                       |                       |       |
     * | 1 / 2 |     3 / 6     |         7 / 12        |         13 / 18       | 19/20 |
     * |       |               |                       |                       |       |
     * --------+-------+-------+-------+-------+-------+-------+-------+-------+-------+
     * 
     * In our grid defined by the Row's columnContainer, the even numbers are used for the Dividers.
     */
    style.gridColumn = this.props.start + '/' + this.props.end;
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
