import React from 'react';
import PropTypes from 'prop-types';
import { PATHS } from 'containers/App/constants';
import Clear from 'components/styled/Clear';
import ItemStatus from 'components/ItemStatus';
import Label from 'components/styled/Label';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import { lowerCase } from 'utils/string';
import appMessages from 'containers/App/messages';

const Styled = styled.a`
  padding-right: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
  padding-left: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
  padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
  padding-bottom: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingBottom}px;
  position: relative;
  background-color: ${palette('mainListItem', 1)};
  margin-bottom: 1px;
  display: block;
  color: ${palette('mainListItem', 0)};
  &:hover {
    color: ${palette('mainListItemHover', 0)};
  }
`;
const Top = styled.div`
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.listItemTop};
  line-height: ${(props) => props.theme.sizes && props.theme.sizes.lineHeights.mainListItem};
`;

const Reference = styled(Label)`
  float: left;
  text-decoration: none;
  text-transform: none;
`;
const Title = styled.div`
  text-decoration: none;
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.nestedListItem};
`;

class EntityListNestedReportItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { report, onEntityClick } = this.props;

    return (
      <Styled
        onClick={(evt) => {
          evt.preventDefault();
          onEntityClick(report.get('id'), 'reports');
        }}
        href={`${PATHS.PROGRESS_REPORTS}/${report.get('id')}`}
      >
        <Top>
          {report.get('date') &&
            <Reference>
              { this.context.intl && `${this.context.intl.formatMessage(appMessages.entities.progress_reports.singleShort)} ${this.context.intl.formatDate(new Date(report.getIn(['date', 'attributes', 'due_date'])))}`}
            </Reference>
          }
          {!report.get('date') &&
            <Reference>
              { this.context.intl && `${this.context.intl.formatMessage(appMessages.entities.progress_reports.singleShort)} (${lowerCase(this.context.intl.formatMessage(appMessages.entities.progress_reports.unscheduled_short))})` }
            </Reference>
          }
          <ItemStatus draft={report.getIn(['attributes', 'draft'])} />
        </Top>
        <Clear />
        <Title>
          {
            report.getIn(['attributes', 'title'])
          }
        </Title>
      </Styled>
    );
  }
}

EntityListNestedReportItem.propTypes = {
  report: PropTypes.object.isRequired,
  onEntityClick: PropTypes.func,
};


EntityListNestedReportItem.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListNestedReportItem;
