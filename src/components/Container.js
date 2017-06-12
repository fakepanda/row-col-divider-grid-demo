import React, { Component } from 'react';
import _ from 'lodash';

import Row from './Row';
import sampleRows from '../sampleRows';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: sampleRows
    };
  }

  renderRows() {
    return this.state.rows.map((row, idx) =>
      <Row
        row={row}
        key={idx}
        id={idx}
        onAddColPress={_idx => this.onAddColPress(_idx)}
        onRemoveColPress={_idx => this.onRemoveColPress(_idx)}
        updateRow={(_idx, row) => this.updateRow(_idx, row)}
      />
    );
  }

  onAddRowPress() {
    this.setState({ rows: [...this.state.rows, []] });
  }
  onRemoveRowPress() {
    const { rows } = this.state;
    this.setState({ rows: rows.slice(0, rows.length - 1) });
  }

  onAddColPress(idx) {
    const rows = this.state.rows;
    const row = rows[idx];

    if (row.length === 0) {
      // if no columns exist, take up whole space
      row.push({ id: row.length, width: 12 });
      this.setState({ rows: rows });
    } else if (row.length < 12) {
      // take 1 width from a column wider than 1
      let reducedWidth = false;
      const arr = row.map(col => {
        if (!reducedWidth && col.width > 1) {
          col.width = col.width - 1;
          reducedWidth = true;
        }
        return col;
      });
      arr.push({ id: row.length, width: 1 });
      rows[idx] = arr;
      this.setState({ rows: rows });
    }

    // if 12 or more columns exist, we can't add any more
  }

  onRemoveColPress(idx) {
    const rows = this.state.rows;
    const row = rows[idx];
    if (row.length === 1) {
      rows[idx] = [];
      this.setState({ rows });
    } else if (row.length > 1) {
      // new row with one less column
      const newRow = row.slice(0, row.length - 1);
      // add back width of removed column to 2nd from last column
      newRow[newRow.length - 1].width += row[row.length - 1].width;
      // update single row instance represented by row[idx]
      rows[idx] = newRow;
      this.setState({ rows });
    }
  }

  updateRow(idx, row) {
    const rows = this.state.rows;
    rows[idx] = row;
    //console.log(JSON.stringify(row, null, 2));
    this.setState({ rows });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.onAddRowPress()}>Add Row</button>
        <button onClick={() => this.onRemoveRowPress()}>Remove Row</button>
        {this.renderRows()}

        <pre>{JSON.stringify(this.state.rows, null, 2)}</pre>
      </div>
    );
  }
}

export default Container;
