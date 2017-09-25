import { expect } from 'chai';
import { personErSattIURL } from './eventhandtering';

describe('person er satt i URL', () => {

    it('fnr i URL skal gi true', () => {
        global.window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912'
            }
        };



        const personIUrl = personErSattIURL();
        expect(!!personIUrl).to.be.true;
    });


    it('fnr ikke i URL skal gi false', () => {
        global.window = {
            location: {
                pathname: '/veilarbpersonflatefs/'
            }
        };

        const personIUrl = personErSattIURL();
        expect(!!personIUrl).to.be.false;
    });

    it('støtter å sjekke fnr i dype urls', () => {
        global.window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912/aktivitet/123'
            }
        };

        const personIUrl = personErSattIURL();
        expect(!!personIUrl).to.be.true;
    });

});

describe('hent Fodselsnummer Fra URL', () => {
    it('hente fnr fra url', () => {
        global.window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912'
            }
        };

        const personIUrl = personErSattIURL();
        expect(personIUrl[1]).to.equal('12345678912');
    });

    it('hente fnr fra url uten fnr', () => {
        global.window = {
            location: {
                pathname: '/veilarbpersonflatefs/'
            }
        };

        const personIUrl = personErSattIURL();
        expect(personIUrl).to.equal(null);
    });

    it('hente fnr fra dyp url', () => {
        global.window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912/aktivitet/123'
            }
        };

        const personIUrl = personErSattIURL();
        expect(personIUrl[1]).to.equal('12345678912');
    });
});
