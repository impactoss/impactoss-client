import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { ROUTES } from 'containers/App/constants';

import ItemStatus from 'components/ItemStatus';
import Label from 'components/styled/Label';
import Component from 'components/styled/Component';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import {
  PUBLISH_STATUSES,
  IS_CURRENT_STATUSES,
  IS_ARCHIVE_STATUSES,
} from 'themes/config';

import { lowerCase } from 'utils/string';
import appMessages from 'containers/App/messages';

const Styled = styled((p) => <Component {...p} />)`
  background-color: ${palette('mainListItem', 1)};
  position: relative;
  padding-left: 0;
  border-left: 3px solid ${palette('background', 1)};
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-left: ${(props) => props.theme.sizes.mainListItem.paddingHorizontal}px;
  }
  @media print {
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;
  }
`;

const Wrapper = styled((p) => <Component {...p} />)`
  position: relative;
  padding-right: 6px;
  padding-top: 4px;
  padding-bottom: 6px;
  box-shadow: ${({ isConnection }) => isConnection ? '0px 0px 6px 0px rgba(0,0,0,0.2)' : 'none'};
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-right: ${(props) => (!props.theme.sizes)
    ? 0
    : props.theme.sizes.mainListItem.paddingHorizontal
}px;
    padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
    padding-bottom: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingBottom}px;
  }
  @media print {
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;
  }
`;

const EntityListItemMainTitleWrap = styled.a`
  text-decoration: none;
  display: block;
  padding: 6px 15px 8px 0;
  margin-top: 15px;
  color: ${palette('mainListItem', 0)};
  &:hover {
    color: ${palette('mainListItemHover', 0)};
  }
  @media print {
    padding: 1px 15px 5px 0;
  }
`;

const EntityListItemMainTopWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-top: 4px;
  padding-right: 6px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}){
    padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
    padding-right: ${(props) => (!props.theme.sizes)
    ? 0
    : props.theme.sizes.mainListItem.paddingHorizontal
}px;
  }
`;

const Reference = styled(Label)`
  float: left;
  text-decoration: none;
  text-transform: none;
`;
const Title = styled.div`
  text-decoration: none;
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.nestedListItem};
  @media print {
    font-size: ${(props) => props.theme.sizes.print.nestedListItem};
  }
`;

class EntityListNestedReportItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { report, onEntityClick, intl } = this.props;
    return (
      <Styled>
        <Wrapper>
          <EntityListItemMainTitleWrap
            onClick={(evt) => {
              evt.preventDefault();
              onEntityClick(report.get('id'), 'reports');
            }}
            href={`${ROUTES.PROGRESS_REPORTS}/${report.get('id')}`}
          >
            <Title>
              { report.getIn(['attributes', 'title']) }
            </Title>
          </EntityListItemMainTitleWrap>
          <EntityListItemMainTopWrap>
            {report.getIn(['attributes', 'draft']) && (
              <ItemStatus
                value={report.getIn(['attributes', 'draft']).toString()}
                options={PUBLISH_STATUSES}
                float="left"
              />
            )}
            {report.getIn(['attributes', 'is_archive']) && (
              <ItemStatus
                value={report.getIn(['attributes', 'is_archive']).toString()}
                options={IS_ARCHIVE_STATUSES}
                float="left"
              />
            )}
            {!report.getIn(['attributes', 'is_current']) && (
              <ItemStatus
                value={report.getIn(['attributes', 'is_current'])
                  ? report.getIn(['attributes', 'is_current']).toString()
                  : 'false'
                }
                options={IS_CURRENT_STATUSES}
                float="left"
              />
            )}
            {report.get('date')
              && (
                <Reference>
                  { intl && `${intl.formatMessage(appMessages.entities.progress_reports.singleShort)} ${intl.formatDate(new Date(report.getIn(['date', 'attributes', 'due_date'])))}`}
                </Reference>
              )
            }
            {!report.get('date')
              && (
                <Reference>
                  { intl && `${intl.formatMessage(appMessages.entities.progress_reports.singleShort)} (${lowerCase(intl.formatMessage(appMessages.entities.progress_reports.unscheduled_short))})` }
                </Reference>
              )
            }
          </EntityListItemMainTopWrap>
        </Wrapper>
      </Styled>
    );
  }
}

EntityListNestedReportItem.propTypes = {
  report: PropTypes.object.isRequired,
  onEntityClick: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EntityListNestedReportItem);
