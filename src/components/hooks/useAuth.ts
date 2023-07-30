import { useCurUserContext } from '../utils/CurUserContext';

export function useAuth() {
	const ctx = useCurUserContext();

	if (!ctx) {
		throw new Error('useAuth must be used within a CurUserContextProvider.');
	}

	return ctx;
}
