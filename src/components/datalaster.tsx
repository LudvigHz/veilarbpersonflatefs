import * as React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';
import { fetchToJson } from '../utils/rest-utils';

interface DatalasterProps<D> {
    url: string;
    feilmelding?: React.ReactElement;
    spinner?: React.ReactElement;
    children: (data: D) => React.ReactElement;
}

interface DatalasterState<D> {
    data?: D;
    harFeilet?: boolean;
}

class Datalaster<D> extends React.Component<DatalasterProps<D>, DatalasterState<D>> {

    constructor(props: DatalasterProps<D>) {
        super(props);

        this.state = {
            harFeilet: false,
        };

        fetchToJson(props.url)
            .then(this.handleDataLastet)
            .catch(this.handleDatalastFeilet);

    }

    handleDataLastet = (data: any) => {
        this.setState({ data });
    };

    handleDatalastFeilet = () => {
        this.setState({ harFeilet: true })
    };

    render() {

        const { data, harFeilet } = this.state;
        const { children, feilmelding, spinner } = this.props;

        if (harFeilet) {
            return feilmelding ? feilmelding : (
                <AlertStripeAdvarselSolid>
                    Kunne ikke laste data, prøv på nytt ...
                </AlertStripeAdvarselSolid>
            );
        } else if (data == null) {
            return spinner ? spinner : (
                <NavFrontendSpinner type="XL"/>
            );
        }

        return children(data);
    }
}

export default Datalaster;
