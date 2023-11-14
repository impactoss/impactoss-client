/**
 * Unauthorised
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import ContentHeader from 'components/ContentHeader';
import Container from 'components/styled/Container';
import ContainerWrapper from 'components/styled/Container/ContainerWrapper';
import Footer from 'containers/Footer';

import messages from './messages';

const ViewContainer = styled(Container)`
  min-height: 100vH;
`;

export class Unauthorised extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl } = this.context;
    return (
      <div>
        <Helmet
          title={intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <ContainerWrapper>
          <ViewContainer>
            <ContentHeader
              title={intl.formatMessage(messages.pageTitle)}
            />
            <p>
              <FormattedMessage {...messages.info} />
            </p>
          </ViewContainer>
          <Footer />
        </ContainerWrapper>
      </div>
    );
  }
}

Unauthorised.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default Unauthorised;
