import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { find } from 'lodash/collection';
import { Map, List } from 'immutable';
import asList from 'utils/as-list';
import { COLUMN_WIDTHS } from 'themes/config';

import Messages from 'components/Messages';
import Component from 'components/styled/Component';

import EntityListItemMain from './EntityListItemMain';
import EntityListItemSelect from './EntityListItemSelect';
import EntityListItemExpandable from './EntityListItemExpandable';

import messages from './messages';

const Styled = styled.span`
  display: inline-block;
  vertical-align: top;
  width: 100%;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    width: ${(props) => props.expanded ? COLUMN_WIDTHS.HALF * 100 : 100}%;
  }
  @media print {
    width: ${(props) => props.expanded ? COLUMN_WIDTHS.HALF * 100 : 100}%;
  }
`;
const Item = styled(Component)`
  display: table;
  width: 100%;
  color: ${palette('mainListItem', 0)};
  background-color: ${palette('mainListItem', 1)};
  border-bottom: ${(props) => props.error ? '1px solid' : 0};
  border-left: ${(props) => props.error ? '1px solid' : 0};
  border-right: ${(props) => props.error ? '1px solid' : 0};
  border-color: ${palette('error', 0)};
`;
const MainWrapper = styled(Component)`
  width:100%;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    display: table-cell;
    width: ${(props) => props.expandable ? COLUMN_WIDTHS.MAIN * 100 : 100}%;
    border-right: ${(props) => props.expandable ? '3px solid' : '0'};
    border-right-color: ${palette('background', 1)};
  }
  @media print {
    border: none;
    display: table-cell;
    width: ${(props) => props.expandable ? COLUMN_WIDTHS.MAIN * 100 : 100}%;
  }
`;
const MainInnerWrapper = styled(Component)`
  display: table;
  width: 100%;
`;

class EntityListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    return this.props.entity !== nextProps.entity
      || this.props.isSelected !== nextProps.isSelected
      || this.props.wrapper !== nextProps.wrapper
      || this.props.error !== nextProps.error
      || this.props.expandNo !== nextProps.expandNo;
  }

  transformMessage = (type, msg) => {
    const { intl } = this.context;
    if (type === 'delete') {
      return intl
        ? intl.formatMessage(messages.associationNotExistent)
        : msg;
    }
    if (type === 'new') {
      return intl
        ? intl.formatMessage(messages.associationAlreadyPresent)
        : msg;
    }
    return msg;
  }

  render() {
    const {
      entity,
      isManager,
      isSelected,
      onSelect,
      entityIcon,
      config,
      taxonomies,
      onExpand,
      onEntityClick,
      expandNo,
      entityPath,
      connections,
      error,
      isConnection,
    } = this.props;

    return (
      <Styled expanded={expandNo > 0}>
        { error && error.map((updateError, i) => (
          <Messages
            key={i}
            type="error"
            messages={
              updateError
                .getIn(['error', 'messages'])
                .map((msg) => this.transformMessage(updateError.get('type'), msg))
                .valueSeq()
                .toArray()
            }
            onDismiss={() => this.props.onDismissError(updateError.get('key'))}
            preMessage={false}
            details
          />
        ))}
        <Item error={error}>
          <MainWrapper expandable={entity.get('expandable')}>
            <MainInnerWrapper>
              {isManager
                && <EntityListItemSelect checked={isSelected} onSelect={onSelect} />
              }
              <EntityListItemMain
                entity={entity}
                taxonomies={taxonomies}
                connections={connections}
                entityIcon={entityIcon}
                config={config}
                entityPath={entityPath}
                onEntityClick={onEntityClick}
                wrapper={this.props.wrapper}
                isManager={isManager}
                isConnection={isConnection}
              />
            </MainInnerWrapper>
          </MainWrapper>
          {
            entity.get('expandable')
            && asList(entity.get('expandable')).map((attribute, i, list) => (
              <EntityListItemExpandable
                key={i}
                column={find(config.expandableColumns, (col) => col.type === attribute)}
                count={entity.get(attribute) ? entity.get(attribute).size : 0}
                dates={attribute === 'reports' ? entity.get('dates').toJS() : null}
                onClick={() => onExpand(expandNo > i ? i : i + 1)}
                colWidth={COLUMN_WIDTHS.OTHER / list.size}
              />
            ))
          }
        </Item>
      </Styled>
    );
  }
}

EntityListItem.propTypes = {
  entity: PropTypes.instanceOf(Map).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  error: PropTypes.instanceOf(List),
  isManager: PropTypes.bool,
  isSelected: PropTypes.bool,
  isConnection: PropTypes.bool,
  onSelect: PropTypes.func,
  expandNo: PropTypes.number,
  onExpand: PropTypes.func,
  entityIcon: PropTypes.func,
  entityPath: PropTypes.string,
  config: PropTypes.object,
  onEntityClick: PropTypes.func,
  onDismissError: PropTypes.func,
  wrapper: PropTypes.object,
};

EntityListItem.defaultProps = {
  isSelected: false,
  expandNo: 0,
};

EntityListItem.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListItem;
