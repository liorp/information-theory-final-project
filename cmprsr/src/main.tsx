import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from 'App'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { registerSW } from 'virtual:pwa-register'
import './index.css'

registerSW()

const MAX_RETRIES = 1
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Number.POSITIVE_INFINITY,
			retry: MAX_RETRIES
		}
	}
})

const rootElement = document.querySelector('#root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</StrictMode>,
	rootElement
)
