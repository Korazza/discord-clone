"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren, useState } from "react"

export const QueryProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}
