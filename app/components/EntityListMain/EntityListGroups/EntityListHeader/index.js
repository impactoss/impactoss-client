import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { getSortOption } from 'utils/sort';
import appMessage from 'utils/app-message';

import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';
import { SORT_ORDER_OPTIONS } from 'containers/App/constants';

import messages from 'components/EntityListMain/EntityListGroups/messages';

import ColumnSelect from './ColumnSelect';
import ColumnExpand from './ColumnExpand';

const Styled = styled.div`
  width:100%;
  background-color: ${palette('light', 1)};
  display: table;
`;

const WIDTH_FULL = 1;
const WIDTH_MAIN = 0.66;
const WIDTH_HALF = 0.5;
const WIDTH_OTHER = 0.34;

class EntityListHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getListHeaderLabel = (entityTitle, selectedTotal, pageTotal, entitiesTotal, allSelected, allSelectedOnPage) => {
    if (selectedTotal > 0) {
      if (allSelected) {
        // return `All ${selectedTotal} ${selectedTotal === 1 ? entityTitle.single : entityTitle.plural} selected. `;
        return this.context.intl && this.context.intl.formatMessage(messages.entityListHeader.allSelected, {
          total: selectedTotal,
          type: selectedTotal === 1 ? entityTitle.single : entityTitle.plural,
        });
      }
      if (allSelectedOnPage) {
        // return `All ${selectedTotal} ${selectedTotal === 1 ? entityTitle.single : entityTitle.plural} on this page are selected. `;
        return this.context.intl && this.context.intl.formatMessage(messages.entityListHeader.allSelectedOnPage, {
          total: selectedTotal,
          type: selectedTotal === 1 ? entityTitle.single : entityTitle.plural,
        });
      }
      // return `${selectedTotal} ${selectedTotal === 1 ? entityTitle.single : entityTitle.plural} selected. `;
      return this.context.intl && this.context.intl.formatMessage(messages.entityListHeader.selected, {
        total: selectedTotal,
        type: selectedTotal === 1 ? entityTitle.single : entityTitle.plural,
      });
    }
    if (pageTotal && (pageTotal < entitiesTotal)) {
      return this.context.intl && this.context.intl.formatMessage(messages.entityListHeader.noneSelected, {
        pageTotal,
        entitiesTotal,
        type: entityTitle.plural,
      });
    }
    // console.log((entitiesTotal === 1) ? entityTitle.single : entityTitle.plural)
    return this.context.intl && this.context.intl.formatMessage(messages.entityListHeader.notPaged, {
      entitiesTotal,
      type: (entitiesTotal === 1) ? entityTitle.single : entityTitle.plural,
    });
  }
  getSelectedState = (selectedTotal, allSelected) => {
    if (selectedTotal === 0) {
      return CHECKBOX_STATES.UNCHECKED;
    }
    if (selectedTotal > 0 && allSelected) {
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
    const isParentExpand = expandNo === i;
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
      entitiesTotal,
      allSelected,
      allSelectedOnPage,
      entityTitle,
      isManager,
      expandNo,
      expandableColumns,
      onExpand,
      onSelect,
      onSelectAll,
      sortOptions,
    } = this.props;

    const firstColumnWidth = this.getFirstColumnWidth(expandableColumns, expandNo);

    const sortOption = getSortOption(sortOptions, this.props.sortBy);

    return (
      <Styled>
        <ColumnSelect
          width={firstColumnWidth}
          isSelect={isManager}
          isSelected={this.getSelectedState(selectedTotal, allSelected || allSelectedOnPage)}
          label={this.getListHeaderLabel(entityTitle, selectedTotal, pageTotal, entitiesTotal, allSelected, allSelectedOnPage)}
          onSelect={onSelect}
          hasSelectAll={allSelectedOnPage && !allSelected}
          onSelectAll={onSelectAll}
          entitiesTotal={entitiesTotal}
          sortBy={sortOption ? sortOption.attribute : null}
          sortOrder={this.props.sortOrder || (sortOption ? sortOption.order : null)}
          sortOptions={sortOptions}
          sortOrderOptions={SORT_ORDER_OPTIONS}
          onSortBy={this.props.onSortBy}
          onSortOrder={this.props.onSortOrder}
        />
        { expandableColumns && expandableColumns.length > 0 &&
          expandableColumns.map((col, i, list) =>
            <ColumnExpand
              key={i}
              isExpand={expandNo > i}
              onExpand={() => onExpand(expandNo > i ? i : i + 1)}
              label={col.message
                ? appMessage(this.context.intl, col.message)
                : col.label
              }
              width={(1 - firstColumnWidth) * this.getExpandableColumnWidth(i, list.length, expandNo)}
            />
          )
        }
      </Styled>
    );
  }
}
EntityListHeader.propTypes = {
  selectedTotal: PropTypes.number,
  pageTotal: PropTypes.number,
  entitiesTotal: PropTypes.number,
  allSelected: PropTypes.bool,
  allSelectedOnPage: PropTypes.bool,
  expandNo: PropTypes.number,
  isManager: PropTypes.bool,
  expandableColumns: PropTypes.array,
  entityTitle: PropTypes.object,
  sortOptions: PropTypes.array,
  sortOrder: PropTypes.string,
  sortBy: PropTypes.string,
  onExpand: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSortBy: PropTypes.func,
  onSortOrder: PropTypes.func,
};

EntityListHeader.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListHeader;
