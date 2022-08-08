import { routes } from "@/src/utils/routes";
import { Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

export function Transition() {
  
  return (
    <div className="page">
        {routes.map(({ path, Component }) => (
          <Route key={path} exact path={path}>
            {({ match }) => (
              <CSSTransition
                in={match != null}
                timeout={300}
                classNames="page"
                mountOnEnter
                unmountOnExit
              >
                <div className="page-container">
                  <Component />
                </div>
              </CSSTransition>
            )}
          </Route>
        ))}
      </div>
  )
}