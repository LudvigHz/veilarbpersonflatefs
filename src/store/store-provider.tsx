import React, { useEffect, useReducer, useState } from 'react';
import { useEventListener } from '../util/utils';
import { createInitialStore, ModiaContext, reducer, SET_RENDER_KEY } from './modia-context-store';
import { synkroniserManuellStatusMedDkif, useFetchAktivBruker } from '../api/api';

interface StoreProviderProps {
	children: React.ReactNode;
}

export const DispatchContext = React.createContext({});

const StoreProvider = (props: StoreProviderProps) => {
	const [state, dispatch] = useReducer(reducer, '', createInitialStore);
	const [klarForAaRendreChildren, setKlarForAaRendreChildren] = useState(false);
	const fnr = state.aktivBrukerFnr;
	const fetchAktivBruker = useFetchAktivBruker();

	useEffect(() => {
		if (!klarForAaRendreChildren) {
			const fikkFnrFraContext: boolean = fnr !== null && fnr !== undefined && fnr.length > 0;

			if (fikkFnrFraContext) {
				setKlarForAaRendreChildren(true);
			}

			if (!fikkFnrFraContext) {
				fetchAktivBruker.fetch().finally(() => setKlarForAaRendreChildren(true));
			}
		}
	}, [klarForAaRendreChildren, setKlarForAaRendreChildren, fetchAktivBruker]);

	const forceRerender = () => dispatch({ type: SET_RENDER_KEY, renderKey: state.renderKey + 1 });
	useEventListener('rerenderMao', forceRerender);
	useEventListener('oppfolgingAvslutet', forceRerender);
	useEventListener('eskaleringsVarselSendt', forceRerender);

	useEffect(() => {
		/*
            Siden det ikke er mulig å få endringer på kontaktinfo fra DKIF asynkront, så må vi gjøre regelmessige spørringer for å holde dataen i synk.
            Tidligere så ble dette gjort som en sideeffekt på et urelatert endepunkt, men det har nå blitt flyttet ut til et eget endepunkt.
            Vi må derfor kalle dette endepunktet hver gang en veileder går inn på en bruker i veilarbpersonflatefs.
            Det trengs ikke å vente på svar fra synkroniseringen før vi går videre med rendring av personflate.
         */
		if (fnr) {
			synkroniserManuellStatusMedDkif(fnr).catch();
		}
	}, [fnr]);

	return (
		<DispatchContext.Provider value={dispatch}>
			<ModiaContext.Provider value={state}>{props.children}</ModiaContext.Provider>
		</DispatchContext.Provider>
	);
};

export default StoreProvider;
