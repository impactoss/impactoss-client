/*
 *
 * PageView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import {
  loadEntitiesIfNeeded,
  updatePath,
  // closeEntity
} from 'containers/App/actions';

import { PATHS, CONTENT_PAGE } from 'containers/App/constants';

import Footer from 'components/Footer';
import Loading from 'components/Loading';
import Container from 'components/styled/Container';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserAdmin,
  selectIsUserContributor,
} from 'containers/App/selectors';

import {
  getStatusField,
  getMetaField,
  getMarkdownField,
} from 'utils/fields';

import appMessages from 'containers/App/messages';
import messages from './messages';
import { selectViewEntity } from './selectors';
import { DEPENDENCIES } from './constants';

const Styled = styled(ContainerWrapper)`
  background-color: ${palette('primary', 4)}
`;

const ViewContainer = styled(Container)`
  min-height: 100vH;
`;

export class PageView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getBodyAsideFields = (entity) => ([{
    fields: [
      getStatusField(entity),
      getMetaField(entity, appMessages),
    ],
  }]);
  getBodyMainFields = (entity) => ([{
    fields: [getMarkdownField(entity, 'content', false, appMessages)],
  }]);

  getFields = (entity, isContributor) => ({
    body: {
      main: this.getBodyMainFields(entity),
      aside: isContributor
        ? this.getBodyAsideFields(entity)
        : null,
    },
  })


  render() {
    const { page, dataReady, isAdmin, isContributor } = this.props;

    const buttons = isAdmin
    ? [{
      type: 'edit',
      onClick: this.props.handleEdit,
    }]
    : [];

    return (
      <div>
        <Helmet
          title={page ? page.getIn(['attributes', 'title']) : `${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Styled className={`content-${CONTENT_PAGE}`}>
          <ViewContainer isNarrow={!isContributor}>
            <ContentHeader
              title={page ? page.getIn(['attributes', 'title']) : ''}
              supTitle={page ? page.getIn(['attributes', 'menu_title']) : ''}
              type={CONTENT_PAGE}
              buttons={buttons}
            />
            { !dataReady &&
              <Loading />
            }
            { !page && dataReady &&
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            }
            { page && dataReady &&
              <EntityView
                fields={this.getFields(page, isContributor)}
                seamless
              />
            }
          </ViewContainer>
          <Footer />
        </Styled>
      </div>
    );
  }
}

PageView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  // handleClose: PropTypes.func,
  page: PropTypes.object,
  dataReady: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isContributor: PropTypes.bool,
  params: PropTypes.object,
};

PageView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isAdmin: selectIsUserAdmin(state),
  isContributor: selectIsUserContributor(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  page: selectViewEntity(state, props.params.id),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: () => {
      dispatch(updatePath(`${PATHS.PAGES}${PATHS.EDIT}/${props.params.id}`, { replace: true }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageView);
