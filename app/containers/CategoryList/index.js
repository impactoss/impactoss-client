/*
 *
 * Taxonomies
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import { mapToTaxonomyList } from 'utils/taxonomies';

// containers
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectEntities,
  selectReady,
  selectIsUserManager,
} from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

// components
import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';
import Sidebar from 'components/styled/Sidebar';
import Scrollable from 'components/styled/Scrollable';
import Loading from 'components/Loading';

import ContentHeader from 'components/ContentHeader';
import CategoryListItems from 'components/categoryList/CategoryListItems';
import TaxonomySidebar from 'components/categoryList/TaxonomySidebar';

// relative
import messages from './messages';
import { DEPENDENCIES, SORT_OPTIONS } from './constants';
import { selectTaxonomy, selectCategories } from './selectors';
import { updateSort } from './actions';

const Content = styled.div`
  padding: 0 4em;
`;
const UsersOnly = styled.h4`
  margin-top: 4em;
`;

export class CategoryList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // make sure to load all data from server
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }
  getTaxTitle = (id) => this.context.intl.formatMessage(appMessages.entities.taxonomies[id].plural);

  render() {
    const { taxonomy, taxonomies, categories, dataReady, isManager, onPageLink, params } = this.props;
    const reference = typeof params.id !== 'undefined' ? params.id : '1';
    const contentTitle = this.getTaxTitle(reference);

    const buttons = dataReady && isManager
      ? [{
        type: 'add',
        title: this.context.intl.formatMessage(messages.add),
        onClick: () => this.props.handleNew(reference),
      }]
      : null;

    // //
    // console.log('categoryList render')
    // // console.log(listColumns)
    const userCategories = categories ? categories.filter((cat) => cat.getIn(['attributes', 'user_only'])) : null;
    const hasUserCategories = isManager && dataReady && userCategories && userCategories.size > 0;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.supTitle)}: ${contentTitle}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Sidebar>
          <Scrollable>
            <TaxonomySidebar
              taxonomies={mapToTaxonomyList(taxonomies, onPageLink, reference, false)}
            />
          </Scrollable>
        </Sidebar>
        <ContainerWithSidebar>
          <Container>
            <Content>
              <ContentHeader
                type={CONTENT_LIST}
                icon="categories"
                supTitle={this.context.intl.formatMessage(messages.supTitle)}
                title={contentTitle}
                buttons={buttons}
              />
              { !dataReady &&
                <Loading />
              }
              { dataReady && taxonomy &&
                <CategoryListItems
                  taxonomy={taxonomy}
                  reference={reference}
                  categories={categories.filter((cat) => !cat.getIn(['attributes', 'user_only']))}
                  onPageLink={onPageLink}
                  onSort={this.props.onSort}
                  sortOptions={SORT_OPTIONS}
                  sortBy={this.props.location.query && this.props.location.query.sort}
                  sortOrder={this.props.location.query && this.props.location.query.order}
                />
              }
              { hasUserCategories &&
                <UsersOnly>
                  <FormattedMessage {...messages.usersOnly} />
                </UsersOnly>
              }
              { dataReady && taxonomy && hasUserCategories &&
                <CategoryListItems
                  taxonomy={taxonomy}
                  reference={reference}
                  categories={userCategories}
                  onPageLink={onPageLink}
                  onSort={this.props.onSort}
                  sortOptions={SORT_OPTIONS}
                  sortBy={this.props.location.query && this.props.location.query.sort}
                  sortOrder={this.props.location.query && this.props.location.query.order}
                  userOnly
                />
              }
            </Content>
          </Container>
        </ContainerWithSidebar>
      </div>
    );
  }
}
CategoryList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func,
  onSort: PropTypes.func,
  handleNew: PropTypes.func,
  taxonomy: PropTypes.object,
  taxonomies: PropTypes.object,
  categories: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  params: PropTypes.object,
  location: PropTypes.object,
};

CategoryList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectEntities(state, 'taxonomies'),
  taxonomy: selectTaxonomy(state, { id: props.params.id }),
  categories: selectCategories(
    state,
    {
      id: typeof props.params.id !== 'undefined' ? props.params.id : 1,
      query: fromJS(props.location.query),
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: (taxonomyId) => {
      dispatch(updatePath(`/categories/${taxonomyId}/new`));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
    onSort: (sort, order) => {
      dispatch(updateSort({ sort, order }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
