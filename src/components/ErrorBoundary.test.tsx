import * as React from 'react';
import * as enzyme from 'enzyme';
import ErrorBoundary from './ErrorBoundary';

function MyWidget(props: { name: string | null }) {
    if (!props.name) {
        throw new Error('Oh no!');
    }
    return <div className="myWidget">{`Hi ${props.name}!`}</div>;
}

describe('ErrorBoundary', () => {
    it('renders the child if child does not throw', () => {
        const c = enzyme.mount(<ErrorBoundary><MyWidget name="Bibo"/></ErrorBoundary>);
        expect(c.find('.myWidget').text()).toEqual('Hi Bibo!');
    });

    it('renders the correct text when a child throws', () => {
        const c = enzyme.mount(<ErrorBoundary><MyWidget name={null}/></ErrorBoundary>);
        expect(c.find('.errorBoundary-header').text()).toEqual('Something went wrong.');
        expect(c.find('.errorBoundary-details').text()).toContain('Oh no!');
    });

    it('throws when no children given', () => {
        expect(() => {
            enzyme.shallow(<ErrorBoundary/>);
        }).toThrow();
    });
});
