/*
 *
 * Taxonomies
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

// containers
import { loadEntitiesIfNeeded } from 'containers/App/actions';
import {
  entitiesSelect,
} from 'containers/App/selectors';

// components
import Page from 'components/Page';

// relative
import messages from './messages';

export class Taxonomies extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // make sure to load all data from server
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { taxonomies } = this.props;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !taxonomies &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        {taxonomies &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={[]}
          >
          </Page>
        }
      </div>
    );
  }
}

Taxonomies.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  taxonomies: PropTypes.object,
};

Taxonomies.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  taxonomies: entitiesSelect(
    state,
    {
      path: 'taxonomies',
      extend: {
        type: 'count',
        path: 'categories',
        on: 'taxonomy_id',
      },
      out: 'js',
    }
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Taxonomies);
