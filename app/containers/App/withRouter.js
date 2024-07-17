import React from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        location={location}
        navigate={navigate}
        params={params}
      />
    );
  };
  return ComponentWithRouterProp;
}
export default withRouter;