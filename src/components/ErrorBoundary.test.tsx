import React from 'react';
import { render } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function MyWidget(props: { name: string | null }) {
    if (!props.name) {
        throw new Error('Oh no!');
    }
    return <div className="myWidget">{`Hi ${props.name}!`}</div>;
}

describe('ErrorBoundary', () => {
    it('renders the child if child does not throw', () => {
        const {getByText} = render(<ErrorBoundary><MyWidget name="Bibo"/></ErrorBoundary>);
        const element = getByText(/Hi Bibo!/i);
        expect(element).toBeInTheDocument();
    });

    it('renders the correct text when a child throws', () => {
        const {getByText} = render(<ErrorBoundary><MyWidget name={null}/></ErrorBoundary>);
        const element1 = getByText(/Something went wrong/i);
        expect(element1).toBeInTheDocument();
        const element2 = getByText(/Oh no/i);
        expect(element2).toBeInTheDocument();
    });

    it('throws when no children given', () => {
        expect(() => {
            render(<ErrorBoundary/>);
        }).toThrow();
    });
});
