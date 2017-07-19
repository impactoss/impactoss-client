import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from 'react-intl';

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

    return (
      <FieldWrap>
        <LabelLarge>
          <FormattedMessage {...appMessages.entities.progress_reports.plural} />
        </LabelLarge>
        { field.button &&
          <ButtonWrap>
            <ButtonFactory button={field.button} />
          </ButtonWrap>
        }
        <EntityListItemsWrap>
          { field.values.map((value, i) => (this.state.showAllReports || i < REPORTSMAX) && (
            <ReportListLink key={i} to={value.linkTo}>
              <ReportListItem>
                <ListItemIcon>
                  <Icon name="report" />
                </ListItemIcon>
                { value.dueDate &&
                  <ReportDueDate>
                    <FormattedDate value={new Date(value.dueDate)} />
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
          <EmptyHint>
            <FormattedMessage {...appMessages.entities.progress_reports.empty} />
          </EmptyHint>
        }
      </FieldWrap>
    );
  }
}

ReportsField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ReportsField;
