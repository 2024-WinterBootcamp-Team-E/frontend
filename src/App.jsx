import './App.css';
import Router from './Router';
import GlobalStyle from './GlobalStyle';
import { ThemeProvider } from 'styled-components';

function App() {
	return (
		<>
			<GlobalStyle />
			<Router />
		</>
	);
}

export default App;
