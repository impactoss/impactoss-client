import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PROGRESS_CATEGORY_ID } from 'themes/config';
import { qe } from 'utils/quasi-equals';
import ButtonTagCategory from 'components/buttons/ButtonTagCategory';
import ButtonTagCategoryInverse from 'components/buttons/ButtonTagCategoryInverse';

const Status = styled.div`
  float: right;
  padding-left: 5px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-left: 13px;
  }
`;
const StyledButtonTagCategoryInverse = styled((p) => <ButtonTagCategoryInverse {...p} />)`
border-width: 1px;
`;
class ItemProgress extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { status } = this.props;
    return status
      ? (
        <Status>
          {
            qe(status.id, PROGRESS_CATEGORY_ID.COMPLETED)
              ? (
                <ButtonTagCategory
                  title={status.attributes.title}
                  taxId={parseInt(status.attributes.taxonomy_id, 10)}
                  disabled
                >
                  {status.attributes.title}
                </ButtonTagCategory>
              )
              : (
                <StyledButtonTagCategoryInverse
                  taxId={parseInt(status.attributes.taxonomy_id, 10)}
                  disabled
                  title={status.attributes.title}
                >
                  {status.attributes.title}
                </StyledButtonTagCategoryInverse>
              )
          }
        </Status>
      )
      : null;
  }
}

ItemProgress.propTypes = {
  status: PropTypes.object,
};

export default ItemProgress;
