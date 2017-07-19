import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import Column from './Column';
import ColumnSelect from './ColumnSelect';
import ColumnExpand from './ColumnExpand';

const Styled = styled.div`
  width:100%;
  background-color: ${palette('light', 1)};
`;
const ColumnNestedWrap = styled.div`
  width:${(props) => props.width * 100}%;
  background-color: ${palette('light', 1)};
  display: inline-block;
`;
const WIDTH_FULL = 1;
const WIDTH_MAIN = 0.66;
const WIDTH_HALF = 0.5;
const WIDTH_OTHER = 0.34;

class EntityListHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getListHeaderLabel = (entityTitle, selectedTotal) => {
    if (selectedTotal === 1) {
      return `${selectedTotal} ${entityTitle.single} selected`;
    }
    if (selectedTotal > 1) {
      return `${selectedTotal} ${entityTitle.plural} selected`;
    }
    return entityTitle.plural;
  }
  getSelectedState = (selectedTotal, pageTotal) => {
    if (selectedTotal === 0) {
      return CHECKBOX_STATES.UNCHECKED;
    }
    if (selectedTotal > 0 && selectedTotal === pageTotal) {
      return CHECKBOX_STATES.CHECKED;
    }
    return CHECKBOX_STATES.INDETERMINATE;
  }
  getFirstColumnWidth = (expandableColumns, expandNo) => {
    // TODO figure out a betterway to determine column widths.
    const hasNested = expandableColumns && expandableColumns.length > 0;
    const isNestedExpand = expandNo > 0;
    if (!hasNested && !isNestedExpand) {
      return WIDTH_FULL;
    }
    if (hasNested && !isNestedExpand) {
      return WIDTH_MAIN;
    }
    return WIDTH_HALF;
  }
  // TODO figure out a betterway to determine column widths
  getExpandableColumnWidth = (i, total, expandNo) => {
    const onlyItem = total === 1;
    const isParentExpand = expandNo <= i;
    const isExpand = expandNo > i;
    const isNestedExpand = expandNo > (i + 1);
    const hasNested = total > (i + 1);
    // if only item
    if (onlyItem) {
      return WIDTH_FULL;
    }
    if (isExpand && hasNested && !isNestedExpand) {
      return WIDTH_MAIN;
    }
    if (!isExpand && !hasNested && isParentExpand) {
      return WIDTH_OTHER;
    }
    return WIDTH_HALF;
  };

  render() {
    const {
      selectedTotal,
      pageTotal,
      entityTitle,
      isManager,
      expandNo,
      expandableColumns,
      onExpand,
      onSelect,
    } = this.props;

    const firstColumnWidth = this.getFirstColumnWidth(expandableColumns, expandNo);
    return (
      <Styled>
        { !isManager &&
          <Column width={firstColumnWidth}>
            {this.getListHeaderLabel(entityTitle, selectedTotal)}
          </Column>
        }
        { isManager &&
          <ColumnSelect
            width={firstColumnWidth}
            isSelected={this.getSelectedState(selectedTotal, pageTotal)}
            label={this.getListHeaderLabel(entityTitle, selectedTotal)}
            onSelect={onSelect}
          />
        }
        { expandableColumns && expandableColumns.length > 0 &&
          <ColumnNestedWrap width={1 - firstColumnWidth}>
            { expandableColumns.map((col, i, list) =>
              <ColumnExpand
                key={i}
                isExpand={expandNo > i}
                onExpand={() => onExpand(expandNo > i ? i : i + 1)}
                label={col.label}
                width={this.getExpandableColumnWidth(i, list.length, expandNo)}
              />
            )}
          </ColumnNestedWrap>
        }
      </Styled>
    );
  }
}
EntityListHeader.propTypes = {
  selectedTotal: PropTypes.number,
  pageTotal: PropTypes.number,
  expandNo: PropTypes.number,
  isManager: PropTypes.bool,
  expandableColumns: PropTypes.array,
  entityTitle: PropTypes.object,
  onExpand: PropTypes.func,
  onSelect: PropTypes.func,
};

export default EntityListHeader;
