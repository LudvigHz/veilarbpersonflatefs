import { useEffect, useState } from 'react';
import SideInnhold from '../component/side-innhold';
import {
	FeilmeldingManglerFnr,
	FeilUnderLastingAvData,
	IngenTilgangTilBruker
} from '../component/alertstriper/alertstriper';
import PageSpinner from '../component/page-spinner/page-spinner';
import { InternflateDecorator } from '../component/internflate-decorator/internflate-decorator';
import { useFetchAktivEnhet, useFetchFeatures, useFetchFeaturesForTeamValp, useFetchTilgangTilBruker } from '../api/api';
import { hasAnyFailed, isAnyLoading } from '../api/utils';
import { Features } from '../api/features';
import { useModiaContext } from '../store/modia-context-store';
import { UtloptSesjonAdvarsel } from '../component/utlopt-sesjon-advarsel/utlopt-sesjon-advarsel';
import { SesjonStatus, useSesjonStatus } from '../hooks/use-sesjon-status';

interface AppInnholdProps {
	features?: Features;
	enableArbeidsmarkedstiltakForTeamValp?: boolean;
}

export const PersonflatePage = () => {
	const { aktivBrukerFnr, aktivEnhetId, setAktivEnhetId, setAktivBrukerFnr, setRenderKey, renderKey } =
		useModiaContext();
	const { sesjonStatus } = useSesjonStatus();

	const fetchTilgangTilBruker = useFetchTilgangTilBruker(aktivBrukerFnr, { manual: true });
	const fetchFeature = useFetchFeatures();
	const fetchFeatureForTeamValp = useFetchFeaturesForTeamValp()
	const fetchAktivEnhet = useFetchAktivEnhet();

	// Hack used because internflatedecorator does not update onFnrChanged function so comparison on fnr can not
	// be done inside that function because it alwaus closes the first value
	const [nextFnr, setNextFnr] = useState<null | string>(aktivBrukerFnr);
	useEffect(() => {
		if (nextFnr && nextFnr !== aktivBrukerFnr) {
			window.history.pushState('', '', `/${nextFnr}`);
			setAktivBrukerFnr(nextFnr);
			setRenderKey(renderKey + 1); // Forces all the micro frontends to be remounted so that their state is reset
		}
	}, [nextFnr]);

	const onAktivBrukerChanged = (newFnr: string | null) => setNextFnr(newFnr);

	const onAktivEnhetChanged = (newEnhetId: string | null) => {
		if (newEnhetId && newEnhetId !== aktivEnhetId) {
			setAktivEnhetId(newEnhetId);
		}
	};

	useEffect(() => {
		if (aktivBrukerFnr) {
			fetchTilgangTilBruker.fetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [aktivBrukerFnr]);

	useEffect(() => {
		if (fetchAktivEnhet.data && fetchAktivEnhet.data.aktivEnhet) {
			setAktivEnhetId(fetchAktivEnhet.data.aktivEnhet);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAktivEnhet]);

	let innhold;

	if (!aktivBrukerFnr) {
		innhold = <FeilmeldingManglerFnr />;
	} else if (isAnyLoading(fetchTilgangTilBruker, fetchFeature, fetchAktivEnhet)) {
		innhold = <PageSpinner />;
	} else if (hasAnyFailed(fetchTilgangTilBruker, fetchFeature)) {
		innhold = <FeilUnderLastingAvData />;
	} else if (!fetchTilgangTilBruker.data) {
		innhold = <IngenTilgangTilBruker />;
	} else {
		innhold = <Innhold features={fetchFeature.data} enableArbeidsmarkedstiltakForTeamValp={fetchFeatureForTeamValp} />;
	}

	return (
		<>
			<InternflateDecorator
				enhetId={aktivEnhetId}
				fnr={aktivBrukerFnr ?? null}
				onEnhetChanged={onAktivEnhetChanged}
				onFnrChanged={onAktivBrukerChanged}
			/>
			{sesjonStatus === SesjonStatus.UTLOPT && <UtloptSesjonAdvarsel />}
			{innhold}
		</>
	);
};

const Innhold = ({ features, enableArbeidsmarkedstiltakForTeamValp }: AppInnholdProps) => {
	return <SideInnhold features={features} enableArbeidsmarkedstiltakForTeamValp={enableArbeidsmarkedstiltakForTeamValp} />;
};
