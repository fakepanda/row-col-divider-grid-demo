import React, { Component } from 'react';

import Column from './Column';
import Divider from './Divider';

class Row extends Component {
  renderColumns() {
    return this.props.row.reduce(
      (obj, column, idx, row) => {
        if (idx) {
          obj.arr.push(
            <Divider
              key={'div' + (idx - 1)}
              idx={idx - 1}
              onCalcSnapWidths={this.onCalcSnapWidths.bind(this)}
              onDrag={this.onDragDivider.bind(this)}
              onDragEnd={this.onDragDividerEnd.bind(this)}
            />
          );
        }

        //figure out grid start/end
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
         * In our grid defined by the Row's columnContainer, the even numbers are used for Dividers.
         */
        let start = obj.end + 1;
        let end = obj.end + column.width * 2;

        obj.end = end;
        obj.arr.push(
          <Column key={column.id} {...column} start={start} end={end} />
        );
        return obj;
      },
      // seed
      { arr: [], end: 0 }
      // returning the arr
    ).arr;
  }

  onCalcSnapWidths(colIdx, startingX) {
    // givin the divider's idx, figure out the width of the snap grid in pixels
    const clientRect = this.refs.columnContainer.getBoundingClientRect();
    const width = clientRect.width;
    // the snapWidth is the distance we need to drag before resizing, this width should
    // approximately match the distance between 2 gutters in our css grid
    const snapWidth = width / 12;
    const row = this.props.row;

    // tying to instance instead of setting the state and rerendering
    this.dragDividerIdx = colIdx;
    this.snapWidth = snapWidth;
    this.startingX = startingX;
    this.canResizeLeft = row.slice(0, colIdx + 1).some(col => col.width > 1);
    this.canResizeRight = row.slice(colIdx + 1).some(col => col.width > 1);
  }

  onDragDivider(idx, clientX) {
    const moveWidth = clientX - this.startingX;

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
      // we want to reduce width from the column directly to the left of the divider
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
        // remove 1 width from column
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
    display: 'grid',
    gridTemplateColumns: 'repeat(11, 1fr 10px) 1fr',
    margin: 10
  }
};

export default Row;
