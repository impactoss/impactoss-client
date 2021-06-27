import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import styled from 'styled-components';

import { startsWith } from 'utils/string';
import { updatePath } from 'containers/App/actions';
import { getNextQueryString } from 'containers/App/sagas';
import { selectFrameworkQuery } from 'containers/App/selectors';

// const A = styled.a``;

const Link = ({
  to, children, onClick, frameworkId, args, ...p
}) => {
  const external = !startsWith(to, '/');
  // make sure to set the fw query for href default link (i.e. open in new tab)
  const query = (args && args.query) || {};
  if (!query.fw) {
    query.fw = frameworkId;
  }
  const href = `${to}?${getNextQueryString(query)}`;
  return (
    <a
      href={href}
      target={external ? '_blank' : '_self'}
      onClick={(e) => {
        if (!external) {
          if (e) e.preventDefault();
          onClick(to, args);
        }
      }}
      {...p}
    >
      {children}
    </a>
  );
};

Link.propTypes = {
  to: PropTypes.string,
  args: PropTypes.object,
  frameworkId: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  onClick: PropTypes.func,
};


const mapStateToProps = (state) => ({
  frameworkId: selectFrameworkQuery(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onClick: (path, args) => {
      dispatch(updatePath(path, args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Link);
