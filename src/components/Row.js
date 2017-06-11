import React, { Component } from 'react';

import Column from './Column';
import Divider from './Divider';

class Row extends Component {
  renderColumns() {
    return this.props.row.reduce((arr, column, idx, row) => {
      if (idx) {
        arr.push(
          <Divider
            key={'div' + (idx - 1)}
            idx={idx - 1}
            onCalcSnapWidths={this.onCalcSnapWidths.bind(this)}
            onDrag={this.onDragDivider.bind(this)}
            onDragEnd={this.onDragDividerEnd.bind(this)}
          />
        );
      }
      arr.push(<Column key={column.id} {...column} />);
      return arr;
    }, []);
  }

  onCalcSnapWidths(colIdx, startingX) {
    // givin the divider's idx, figure out the width of the snap grid
    const clientRect = this.refs.columnContainer.getBoundingClientRect();
    const width = clientRect.width;
    const snapWidth = width / 12;
    const row = this.props.row;

    this.dragDividerIdx = colIdx;
    this.snapWidth = snapWidth;
    this.startingX = startingX;
    this.canResizeLeft = row.slice(0, colIdx + 1).some(col => col.width > 1);
    this.canResizeRight = row.slice(colIdx + 1).some(col => col.width > 1);
  }

  onDragDivider(idx, clientX) {
    const moveWidth = clientX - this.startingX;

    const row = this.props.row;

    // if moved to the left, moveWidth is negative
    if (this.canResizeLeft && moveWidth < 0 && moveWidth < -this.snapWidth) {
      console.log('snap left');
      this.snapLeft(idx);
      this.onCalcSnapWidths(idx, clientX);
    } else if (
      this.canResizeRight &&
      moveWidth > 0 &&
      moveWidth > this.snapWidth
    ) {
      console.log('snap right');
      this.snapRight(idx);
      this.onCalcSnapWidths(idx, clientX);
    }
  }

  onDragDividerEnd() {
    this.startingX = undefined;
    this.canResizeLeft = undefined;
    this.canResizeRight = undefined;
    this.snapWidth = undefined;
  }

  snapLeft(idx) {
    let resized = false;
    const leftCols = this.props.row
      .slice(0, idx + 1)
      .reverse()
      .map(col => {
        if (!resized && col.width > 1) {
          col.width -= 1;
          resized = true;
        }
        return col;
      })
      .reverse();
    const resizingCol = this.props.row[idx + 1];
    resizingCol.width += 1;
    const newRow = [...leftCols, resizingCol, ...this.props.row.slice(idx + 2)];
    this.props.updateRow(this.props.id, newRow);
  }

  snapRight(idx) {
    let resized = false;
    const rightCols = this.props.row.slice(idx + 1).map(col => {
      if (!resized && col.width > 1) {
        col.width -= 1;
        resized = true;
      }
      return col;
    });
    const resizingCol = this.props.row[idx];
    resizingCol.width += 1;
    const newRow = [...this.props.row.slice(0, idx), resizingCol, ...rightCols];
    this.props.updateRow(this.props.id, newRow);
  }

  render() {
    const classNames = ['row'];
    classNames.push(this.props.id ? `row-${this.props.id}` : '');
    return (
      <div className={classNames.join(' ')} style={styles.rowStyle}>
        <div className="header" style={styles.headerStyle}>
          <span style={{ padding: 5 }}>Row</span>
          <button onClick={() => this.props.onAddColPress(this.props.id)}>
            Add Column
          </button>
          <button onClick={() => this.props.onRemoveColPress(this.props.id)}>
            Remove Column
          </button>
        </div>
        <div
          ref="columnContainer"
          className="columnContainer"
          style={styles.colContainerStyle}
        >
          {this.renderColumns()}
        </div>
      </div>
    );
  }
}

const styles = {
  headerStyle: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 0
  },
  rowStyle: {
    display: 'flex',
    flexDirection: 'column',
    height: 250,
    backgroundColor: '#F9CDAD',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#333',
    margin: 10
  },
  colContainerStyle: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'stretch',
    margin: 10
  }
};

export default Row;
