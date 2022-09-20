import { useEffect, useState } from 'react';
import { fetchAntallUlesteDialoger, fetchSistOppdatert } from '../../../api/api';
import { useEventListener } from '../../../util/utils';

export enum UpdateTypes {
	Dialog = 'DIALOG'
}

interface UpdateEventType {
	uppdate: string;
	avsender?: string;
}

function windowEvent(update: UpdateTypes) {
	/*
        Jeg regner med at 'uppdate' er en skrivefeil, men jeg ser at det samme navnet blir brukt i aktivitetsplanen og arbeidsrettet-dialog,
        så jeg gjør ikke noe med det inntil videre.
    */

	const updateEvent = new CustomEvent<UpdateEventType>('uppdate', {
		detail: { uppdate: update, avsender: 'veilarbpersonflatefs' }
	});

	window.dispatchEvent(updateEvent);
}

const DIALOG_LEST_EVENT = 'aktivitetsplan.dialog.lest';

export default function useUlesteDialoger(fnr: string): number | undefined {
	const [antallUleste, setAntallUleste] = useState<number | undefined>(undefined);
	const [localSistOppdatert, setLocalSistOppdatert] = useState(new Date());
	const [sistOppdatert, setSistOppdatert] = useState<string | undefined>();

	useEventListener(DIALOG_LEST_EVENT, () => {
		setAntallUleste(prevState => (prevState ? prevState - 1 : 0));
	});

	useEffect(() => {
		let interval: NodeJS.Timeout;
		interval = setInterval(
			() =>
				fetchSistOppdatert(fnr)
					.then(result => setSistOppdatert(result.data.sistOppdatert))
					.catch(() => clearInterval(interval)),
			10000
		);
		return () => clearInterval(interval);
	}, [fnr]);

	useEffect(() => {
		fetchAntallUlesteDialoger(fnr).then(result => setAntallUleste(result.data.antallUleste));
	}, [fnr, setAntallUleste]);

	useEffect(() => {
		if (sistOppdatert) {
			const remoteSistOppdatert = new Date(sistOppdatert);

			if (remoteSistOppdatert > localSistOppdatert) {
				windowEvent(UpdateTypes.Dialog);
				fetchAntallUlesteDialoger(fnr).then(result => setAntallUleste(result.data.antallUleste));
				setLocalSistOppdatert(new Date());
			}
		}
	}, [fnr, localSistOppdatert, sistOppdatert]);

	return antallUleste;
}
