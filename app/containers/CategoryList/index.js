/*
 *
 * Taxonomies
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import { mapToTaxonomyList } from 'utils/taxonomies';

// containers
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectEntities,
  isReady,
  isUserManager,
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
import { DEPENDENCIES } from './constants';
import { selectTaxonomy, selectCategories } from './selectors';

const Content = styled.div`
  padding: 0 4em;
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
  getTaxTitle = (id) =>
    this.context.intl.formatMessage(appMessages.entities.taxonomies[id].plural);


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

    //
    // console.log('category list render')
    // console.log(listColumns)
    // categories && console.log(categories.toJS())

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
                  categories={categories}
                  onPageLink={onPageLink}
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
  handleNew: PropTypes.func,
  taxonomy: PropTypes.object,
  taxonomies: PropTypes.object,
  categories: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  params: PropTypes.object,
};

CategoryList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: DEPENDENCIES }),
  taxonomies: selectEntities(state, 'taxonomies'),
  taxonomy: selectTaxonomy(state, props.params.id),
  categories: selectCategories(state, typeof props.params.id !== 'undefined' ? props.params.id : 1),
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
