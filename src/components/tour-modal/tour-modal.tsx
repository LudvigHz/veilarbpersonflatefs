import * as React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import ChevronLenke, { Retning } from '../chevron-lenke/chevron-lenke';
import Stegviser from '../stegviser/stegviser';
import step1Bilde from './step-1.jpg';
import step2Bilde from './step-2.jpg';
import step3Bilde from './step-3.jpg';
import TourModalMetrics from './tour-modal-metrics';
import { hasStored } from '../../utils/utils';
import './tour-modal.less';

const modalName = 'TOUR_MODAL-NY_LAYOUT_ENDRING';

const steps: Step[] = [
    { tittel: 'Visittkort', bilde: step1Bilde, tekst: 'Visittkortet øverst viser nøkkelinformasjon om brukeren.'},
    { tittel: 'Veilederverktøy', bilde: step2Bilde, tekst: 'Her ligger funksjonene som før lå under tannhjulet i aktivitetsplanen.'},
    { tittel: 'Faner', bilde: step3Bilde, tekst: 'Du kan veksle mellom aktivitetsplanen og detaljer ved å klikke på fanene.'},
];

interface Step {
    tittel: string;
    tekst: string;
    bilde: string;
}

interface TourModalState {
    selectedStepIdx: number;
    modalOpen: boolean;
}

class TourModal extends React.Component<{}, TourModalState> {

    state = {
        modalOpen: !hasStored(modalName),
        selectedStepIdx: 0
    };

    private metrics: TourModalMetrics = new TourModalMetrics(steps.length);

    lagreIkkeVisModal = () => {
        window.localStorage.setItem(modalName, 'true');
    };

    lukkModal = (finishedTour: boolean) => {
        this.metrics.setTimeSpent(this.state.selectedStepIdx);
        this.metrics.log(finishedTour);

        this.setState({ modalOpen: false });
        this.lagreIkkeVisModal();
    };

    handleOnRequestClose = () => {
        this.lukkModal(false);
    };

    handlePreviousBtnClicked = () => {
        this.setState((state: TourModalState) => {
            return { selectedStepIdx: state.selectedStepIdx - 1 }
        });
    };

    handleNextBtnClicked = () => {
        this.setState((state: TourModalState) => {
            this.metrics.setTimeSpent(state.selectedStepIdx);
            return { selectedStepIdx: state.selectedStepIdx + 1 }
        });
    };

    handleFinishBtnClicked = () => {
        this.lukkModal(true);
    };

    render() {
        const { selectedStepIdx, modalOpen } = this.state;
        const step = steps[selectedStepIdx];
        const isFinalStep = selectedStepIdx === steps.length - 1;

        const hidePrevBtn = selectedStepIdx === 0;
        const nextBtnText = isFinalStep ? "Ferdig" : "Neste";
        const nextBtnHandleClick = isFinalStep ?
            this.handleFinishBtnClicked : this.handleNextBtnClicked;

        return (
            <NavFrontendModal
                className="tour-modal"
                contentLabel="TourModal"
                isOpen={modalOpen}
                closeButton={true}
                shouldCloseOnOverlayClick={false}
                onRequestClose={this.handleOnRequestClose}
            >
                <div className="tour-modal__header--wrapper">
                <header className="tour-modal__header">
                    <Systemtittel>Ny oppdatering</Systemtittel>
                </header>
                </div>
                <main className="tour-modal__main">
                    <div className="tour-modal__main--bilde-wrapper">
                        <img src={step.bilde} className="tour-modal__main--bilde"/>
                    </div>
                    <div className="tour-modal__main--beskrivelse">
                        <Undertittel className="blokk-xxxs">{step.tittel}</Undertittel>
                        <Normaltekst className="tour-modal__main--tekst">{step.tekst}</Normaltekst>
                    </div>
                </main>
                <footer className="tour-modal__footer">
                    <ChevronLenke retning={Retning.VENSTRE} hide={hidePrevBtn} tekst="Forrige" onClick={this.handlePreviousBtnClicked}/>
                    <Stegviser antallSteg={steps.length} valgtSteg={selectedStepIdx}/>
                    <ChevronLenke retning={Retning.HOYRE} tekst={nextBtnText} onClick={nextBtnHandleClick}/>
                </footer>
            </NavFrontendModal>
        );
    }
}

export default TourModal;