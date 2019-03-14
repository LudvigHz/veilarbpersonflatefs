import React from 'react';
import TabMenu, { Tab } from './tab-menu/tab-menu';
import './side-innhold-ny-layout.less';

interface SideInnholdNyLayoutProps {
    visittkort: React.ReactElement;
    mao: React.ReactElement;
    aktivitetsplan: React.ReactElement;
}

class SideInnholdNyLayout extends React.Component<SideInnholdNyLayoutProps> {

    constructor(props: SideInnholdNyLayoutProps) {
        super(props);
        this.setPageBackground();
    }

    setPageBackground = () => {
        const page = document.getElementsByClassName("veilarbpersonflatefs")[0];
        page.classList.add("grey-background");
    };

    render () {
        const { visittkort, aktivitetsplan, mao } = this.props;

        const tabs: Tab[] = [
            { title: 'Aktivitetsplan og dialog', content: aktivitetsplan },
            { title: 'Detaljer', content: <div className="tab-content__mao">{mao}</div> }
        ];

        const visDetaljer = window.location.search.indexOf('visRegistreringDetaljer') >= 0;
        const defaultSelectedTab = visDetaljer ? 1 : 0;

        return (
            <>
                <div className="visittkort-wrapper">
                    {visittkort}
                </div>
                <TabMenu tabs={tabs} defaultSelectedTab={defaultSelectedTab}/>
            </>
        );
    }
}

export default SideInnholdNyLayout;
