import React, { Component } from 'react';

class Column extends Component {
  onMouseDown(event) {
    // console.log('mouse down');
    // console.log(event.screenX);
    // this.props.onCalcSnapWidths(this.props.idx, event.screenX);
  }
  onMouseUp(event) {
    // mouse up fires another drag event...with poor results let's kill it
    //event.stopPropagation();
  }
  onDragStart(event) {
    console.log('drag start');
    console.log(event.screenX);
    this.props.onCalcSnapWidths(this.props.idx, event.screenX);
  }
  onDrag(event) {
    // when the user lets go of the mouse, drag event is fired with screenX of 0, ignore this case
    if (event.screenX !== 0) {
      this.props.onDrag(this.props.idx, event.screenX);
    }
  }

  onDragEnd(event) {
    console.log('drag end');
    this.props.onDragEnd(this.props.idx, event.screenX);
  }

  render() {
    const { props } = this;
    const classNames = ['divider'];

    return (
      <div
        className={classNames.join(' ')}
        style={styles.dividerStyle}
        draggable
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={event => this.onMouseUp(event)}
        onDragStart={this.onDragStart.bind(this)}
        onDrag={this.onDrag.bind(this)}
        onDragEnd={this.onDragEnd.bind(this)}
      >
        |
      </div>
    );
  }
}

// ba7973
const styles = {
  dividerStyle: {
    margin: 0,
    alignSelf: 'center',
    backgroundColor: 'F9CDAD',
    padding: 3,
    cursor: 'ew-resize'
  }
};

export default Column;
