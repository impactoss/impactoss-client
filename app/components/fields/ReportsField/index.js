import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { orderBy } from 'lodash/collection';

import { getEntitySortIteratee } from 'utils/sort';

import appMessages from 'containers/App/messages';

import Icon from 'components/Icon';
import ButtonFactory from 'components/buttons/ButtonFactory';

import FieldWrap from 'components/fields/FieldWrap';
import LabelLarge from 'components/fields/LabelLarge';
import ButtonWrap from 'components/fields/ButtonWrap';
import EntityListItemsWrap from 'components/fields/EntityListItemsWrap';
import ReportListLink from 'components/fields/ReportListLink';
import ReportListItem from 'components/fields/ReportListItem';
import ListItemIcon from 'components/fields/ListItemIcon';
import ReportDueDate from 'components/fields/ReportDueDate';
import ToggleAllItems from 'components/fields/ToggleAllItems';
import EmptyHint from 'components/fields/EmptyHint';

const REPORTSMAX = 5;

class ReportsField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      showAllReports: false,
    };
  }
  render() {
    const { field } = this.props;
    const sortedValues = orderBy(field.values, getEntitySortIteratee('id'), 'asc');
    return (
      <FieldWrap>
        <LabelLarge>
          {field.label}
        </LabelLarge>
        { field.button &&
          <ButtonWrap>
            <ButtonFactory button={field.button} />
          </ButtonWrap>
        }
        <EntityListItemsWrap>
          { sortedValues.map((value, i) => (this.state.showAllReports || i < REPORTSMAX) && (
            <ReportListLink key={i} to={value.linkTo}>
              <ReportListItem>
                <ListItemIcon>
                  <Icon name="report" />
                </ListItemIcon>
                { value.dueDate &&
                  <ReportDueDate>
                    {value.dueDate}
                  </ReportDueDate>
                }
                { !value.dueDate &&
                  <ReportDueDate>
                    <FormattedMessage {...appMessages.entities.progress_reports.unscheduled} />
                  </ReportDueDate>
                }
                {value.label}
              </ReportListItem>
            </ReportListLink>
          ))}
        </EntityListItemsWrap>
        { field.values && field.values.length > REPORTSMAX &&
          <ToggleAllItems
            onClick={() =>
              this.setState({ showAllReports: !this.state.showAllReports })
            }
          >
            { this.state.showAllReports &&
              <FormattedMessage {...appMessages.entities.progress_reports.showLess} />
            }
            { !this.state.showAllReports &&
              <FormattedMessage {...appMessages.entities.progress_reports.showAll} />
            }
          </ToggleAllItems>
        }
        { (!field.values || field.values.length === 0) &&
          <EmptyHint>{field.showEmpty}</EmptyHint>
        }
      </FieldWrap>
    );
  }
}

ReportsField.propTypes = {
  field: PropTypes.object.isRequired,
};
ReportsField.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ReportsField;
