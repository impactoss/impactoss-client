/**
*
* EntityView
*
*/
import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import { find } from 'lodash/collection';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import { PUBLISH_STATUSES } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import asArray from 'utils/as-array';
import A from 'components/basic/A';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import DocumentView from 'components/DocumentView';

import ViewWrapper from './ViewWrapper';
import ViewPanel from './ViewPanel';

const Section = styled.div`
  display: inline-block;
  vertical-align: top;
`;
const ToggleAllDates = styled(Button)`
  padding: 0;
  font-size: 0.85em;
  color: ${palette('primary', 0)};
  &:hover {
    color: ${palette('primary', 1)};
  }
`;
const Main = styled(Section)`
  width: ${(props) => props.aside ? '66%' : '100%'};
`;
// TODO improve styling
const Aside = styled(Section)`
  width: 34%;
  border-left: 1px solid ${palette('greyscaleLight', 0)};
  margin: 0 -1px;
`;
const FieldGroup = styled.div`
  background-color: ${(props) => props.type === 'dark' ? palette('greyscaleLight', 0) : 'transparent'}
  padding: 20px 40px;
`;
const FieldGroupLabel = styled.div`
  position: relative;
  display: block;
  width: 100%;
  border-bottom: 2px solid ${palette('greyscaleLight', 3)};
  padding: 10px 0 3px;
  font-weight: bold;
  color: ${palette('greyscaleDark', 1)};
`;
const Field = styled.div`
  padding: 20px 0;
`;
const ValueWrap = styled.div`
  display: block;
  position: relative;
`;
const GroupIcon = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  color: ${palette('greyscaleDark', 4)}
`;
const FieldIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  color: ${palette('greyscaleDark', 4)}
`;
const ReferenceWrap = styled.span`
  display: inline-block;
  min-width: 100px;
  vertical-align: top;
`;
const StatusWrap = styled.span`
  display: inline-block;
  vertical-align: top;
`;
const Status = styled.div`
  text-transform: uppercase;
  font-weight: bold;
`;
const Title = styled.h1`
  margin: 0;
`;
const Label = styled.div`
  color: ${palette('greyscaleDark', 4)}
  font-weight: 500;
  font-size: 0.85em;
  width: 100%;
`;
const ShortTitleTag = styled.span`
  display: inline-block;
  color: ${palette('primary', 4)};
  background-color: ${(props) => palette('taxonomies', parseInt(props.pIndex, 10) || 0)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
`;
const MetaField = styled.div`
  font-size: 0.85em;
  color: ${palette('greyscaleDark', 4)}
`;
const Reference = styled.div`
  font-weight: bold;
`;
const ReferenceLarge = styled(Reference)`
  font-size: 2em;
  color: ${palette('greyscaleDark', 4)}
`;

const Url = styled(A)`
  color: ${palette('greyscaleDark', 1)}
  font-weight: bold;
  font-size: 0.85em;
`;
const DateField = styled.div`
  color: ${palette('greyscaleDark', 1)}
  font-weight: bold;
  font-size: 1.2em;
`;
const EmptyHint = styled.span`
  color: ${palette('greyscaleDark', 4)};
  font-style: italic;
  font-size: 0.85em;
`;
const Manager = styled.span`
  color: ${palette('greyscaleDark', 2)};
  font-weight: bold;
`;

const ListLink = styled(Link)`
  font-weight: bold;
  font-size: 1.2em;
  color: ${palette('greyscaleDark', 1)};
  display: block;
`;
const ListLabel = styled(Label)`
  padding-bottom: 8px;
  border-bottom: 1px solid ${palette('greyscaleLight', 0)};
`;
const ListItem = styled.div`
  padding: 1em 0 0;
`;
const Dot = styled.div`
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  display: block;
  border-radius: 999px;
  width: 14px;
  height: 14px;
`;
const DotWrapper = styled.div`
  padding: 2px 5px;
  float: right;
`;
const ScheduleItemStatus = styled.div`
  display: inline-block;
  padding-left: 1em;
`;
const ScheduleItem = styled.div`
  font-weight: bold;
  color:  ${(props) => props.overdue ? palette('primary', 0) : palette('greyscaleDark', 2)};
`;
class EntityView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      showAllDates: false,
    };
  }

  renderList = (field) => (
    <ValueWrap>
      <ListLabel>
        {field.label}
        {field.entityType &&
          <DotWrapper>
            <Dot palette={field.entityType} pIndex={parseInt(field.id, 10)} />
          </DotWrapper>
        }
      </ListLabel>
      {field.values.map((value, i) => (
        <ListItem key={i}>
          {value.linkTo
            ? <ListLink key={i} to={value.linkTo}>{value.label}</ListLink>
            : <p>{value.label}</p>
          }
        </ListItem>
      ))}
      { (!field.values || field.values.length === 0) &&
        <EmptyHint>{field.showEmpty}</EmptyHint>
      }
    </ValueWrap>
  );
  renderSchedule = (field) => (
    <ValueWrap>
      <Label>
        {field.label}
      </Label>
      {
        field.values.map((value, i) => (this.state.showAllDates || i < 3) && (
          <ScheduleItem key={i} overdue={value.overdue}>
            {value.label}
            {
              value.overdue &&
              <ScheduleItemStatus>
                <FormattedMessage {...appMessages.entities.due_dates.overdue} />
              </ScheduleItemStatus>
            }
            {
              value.due &&
              <ScheduleItemStatus>
                <FormattedMessage {...appMessages.entities.due_dates.due} />
              </ScheduleItemStatus>
            }
          </ScheduleItem>
        ))
      }
      { field.values && field.values.length > 3 &&
        <ToggleAllDates
          onClick={() =>
            this.setState({ showAllDates: !this.state.showAllDates })
          }
        >
          { this.state.showAllDates &&
            <span>Show less</span>
          }
          { !this.state.showAllDates &&
            <span>Show all</span>
          }
        </ToggleAllDates>
      }
      { (!field.values || field.values.length === 0) &&
        <EmptyHint>{field.showEmpty}</EmptyHint>
      }
    </ValueWrap>
  );
  renderText = (field) => (
    <ValueWrap>
      <Label>
        {field.label}
      </Label>
      <p>{field.value}</p>
    </ValueWrap>
  );
  renderTitle = (field) => (
    <ValueWrap>
      {field.isManager &&
        <Label>
          {field.label || this.context.intl.formatMessage(appMessages.attributes.title)}
        </Label>
      }
      <Title>{field.value}</Title>
    </ValueWrap>
  );
  renderShortTitle = (field) => (
    <ValueWrap>
      <Label>
        {field.label || this.context.intl.formatMessage(appMessages.attributes.short_title)}
      </Label>
      <ShortTitleTag pIndex={field.taxonomyId}>{field.value}</ShortTitleTag>
    </ValueWrap>
  );
  renderDescription = (field) => (
    <ValueWrap>
      <Label>
        {field.label || this.context.intl.formatMessage(appMessages.attributes.description)}
      </Label>
      <ReactMarkdown source={field.value} />
    </ValueWrap>
  );
  renderLink = (field) => (
    <ValueWrap>
      <Label>
        {field.label || this.context.intl.formatMessage(appMessages.attributes.url)}
      </Label>
      <Url target="_blank" href={field.value}>
        {field.anchor}
      </Url>
    </ValueWrap>
  );
  renderDate = (field) => (
    <ValueWrap>
      <FieldIcon>
        <Icon name="calendar" />
      </FieldIcon>
      <Label>
        {field.label || this.context.intl.formatMessage(appMessages.attributes.date)}
      </Label>
      { field.value &&
        <DateField>
          {field.value}
        </DateField>
      }
      { !field.value &&
        <EmptyHint>{field.showEmpty}</EmptyHint>
      }
    </ValueWrap>
  );
  renderMeta = (field) => (
    <ValueWrap>
      <Label>
        {field.label || this.context.intl.formatMessage(appMessages.attributes.meta.title)}
      </Label>
      {
        field.fields.map((metaField, i) => (
          <MetaField key={i}>
            {`${metaField.label}: ${metaField.value}`}
          </MetaField>
        ))
      }
    </ValueWrap>
  );
  renderReference = (field) => (
    <ReferenceWrap>
      <Label>
        {field.label || this.context.intl.formatMessage(appMessages.attributes.reference)}
      </Label>
      { field.large &&
        <ReferenceLarge>{field.value}</ReferenceLarge>
      }
      { !field.large &&
        <Reference>{field.value}</Reference>
      }
    </ReferenceWrap>
  );
  renderStatus = (field) => (
    <StatusWrap>
      <Label>
        {field.label || this.context.intl.formatMessage(appMessages.attributes.status)}
      </Label>
      <Status>
        {
          find(PUBLISH_STATUSES, { value: field.value }).label
        }
      </Status>
    </StatusWrap>
  );
  renderRole = (field) => (
    <StatusWrap>
      <Label>
        {field.label || 'Role'}
      </Label>
      <Status>
        {
          field.value // TODO
        }
      </Status>
    </StatusWrap>
  );
  renderReferenceStatus = (field) => (
    <ValueWrap>
      {
        field.fields.map((rsField, i) => (
          <span key={i}>
            { rsField.type === 'reference' &&
              this.renderReference(rsField)
            }
            { rsField.type === 'status' &&
              this.renderStatus(rsField)
            }
          </span>
        ))
      }
    </ValueWrap>
  );
  renderReferenceRole = (field) => (
    <ValueWrap>
      {
        field.fields.map((rsField, i) => (
          <span key={i}>
            { rsField.type === 'reference' &&
              this.renderReference(rsField)
            }
            { rsField.type === 'role' &&
              this.renderRole(rsField)
            }
          </span>
        ))
      }
    </ValueWrap>
  );
  renderManager = (field) => (
    <ValueWrap>
      <Label>
        {this.context.intl.formatMessage(appMessages.attributes.manager_id.categories)}
      </Label>
      { field.value &&
        <Manager>{field.value}</Manager>
      }
      { !field.value &&
        <EmptyHint>{field.showEmpty}</EmptyHint>
      }
    </ValueWrap>
  );

  renderDownload = (field) => (
    <ValueWrap>
      <Label>
        {this.context.intl.formatMessage(appMessages.attributes.document_url)}
      </Label>
      { field.value &&
        <DocumentView url={field.value} isManager={field.isManager} status={field.public} />
      }
      { !field.value &&
        <EmptyHint>{field.showEmpty}</EmptyHint>
      }
    </ValueWrap>
  )
  renderField = (field) => {
    if (field.value
      || (field.values && field.values.length)
      || (field.fields && field.fields.length)
      || field.showEmpty
    ) {
      switch (field.type) {
        case 'title':
          return this.renderTitle(field);
        case 'short_title':
          return this.renderShortTitle(field);
        case 'meta':
          return this.renderMeta(field);
        case 'referenceStatus':
          return this.renderReferenceStatus(field);
        case 'referenceRole':
          return this.renderReferenceRole(field);
        case 'link':
          return this.renderLink(field);
        case 'date':
          return this.renderDate(field);
        case 'manager':
          return this.renderManager(field);
        case 'description':
          return this.renderDescription(field);
        case 'list':
          return this.renderList(field);
        case 'schedule':
          return this.renderSchedule(field);
        case 'download':
          return this.renderDownload(field);
        // case 'connections':
        //   return this.renderConnections(field);
        // case 'reports':
        //   return this.renderCategories(field);
        case 'text':
        default:
          return this.renderText(field);
      }
    }
    return null;
  };

  renderGroup = (group) => (
    <FieldGroup type={group.type}>
      { group.label &&
        <FieldGroupLabel>
          { group.icon &&
            <GroupIcon>
              <Icon name={group.icon} />
            </GroupIcon>
          }
          <Label>
            {group.label}
          </Label>
        </FieldGroupLabel>
      }
      {
        group.fields.map((field, i) => field
          ? (
            <Field key={i}>
              {
                this.renderField(field)
              }
            </Field>
          )
          : null
        )
      }
    </FieldGroup>
  )

  renderHeaderMain = (fieldGroups, aside) => (
    <Main aside={aside}>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => fieldGroup.fields && (
          <ViewPanel key={i} borderRight={aside} borderBottom={i < (list.length - 1)}>
            {this.renderGroup(fieldGroup)}
          </ViewPanel>
        ))
      }
    </Main>
  );
  renderHeaderAside = (fieldGroups) => (
    <Aside>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => (
          <ViewPanel key={i} borderBottom={i < (list.length - 1)}>
            {this.renderGroup(fieldGroup)}
          </ViewPanel>
        ))
      }
    </Aside>
  );
  renderHeader = (fields) => (
    <ViewPanel borderBottom>
      { fields.main &&
        this.renderHeaderMain(fields.main, fields.aside)
      }
      { fields.aside &&
        this.renderHeaderAside(fields.aside)
      }
    </ViewPanel>
  )

  renderBodyMain = (fieldGroups) => (
    <Main aside>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => (
          <ViewPanel key={i} borderRight borderBottom={i < (list.length - 1)}>
            {this.renderGroup(fieldGroup)}
          </ViewPanel>
        ))
      }
    </Main>
  );
  renderBodyAside = (fieldGroups) => (
    <Aside>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => (
          <ViewPanel key={i} borderBottom={i < (list.length - 1)}>
            {this.renderGroup(fieldGroup)}
          </ViewPanel>
        ))
      }
    </Aside>
  );
  renderBody = (fields) => (
    <ViewPanel>
      { fields.main &&
        this.renderBodyMain(fields.main)
      }
      { fields.aside &&
        this.renderBodyAside(fields.aside)
      }
    </ViewPanel>
  )

  render() {
    const { fields } = this.props;
    return (
      <ViewWrapper>
        { fields.header &&
          this.renderHeader(fields.header)
        }
        { fields.body &&
          this.renderBody(fields.body)
        }
      </ViewWrapper>
    );
  }
}

EntityView.propTypes = {
  fields: React.PropTypes.object,
};
EntityView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};
export default EntityView;
