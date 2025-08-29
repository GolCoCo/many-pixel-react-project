import { createBrowserHistory } from 'history'

const history = createBrowserHistory();

export default history;
export const goTo = (route) => history.push(route);
