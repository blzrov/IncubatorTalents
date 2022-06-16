import { MantineProvider } from '@mantine/core';
import '../styles/globals.scss'

import { Header } from '/components/Header';

const MyApp = ({ Component, pageProps }) => {
	return <MantineProvider
		withGlobalStyles
		withNormalizeCSS
		theme={{
			colorScheme: 'light',
		}}
	>
		<Header />
		<Component {...pageProps} />
	</MantineProvider>

}

export default MyApp
