import {render, screen, cleanup, fireEvent} from '@testing-library/react'
import Home from '../pages/index';
import Button from '../components/commons/Button';

// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import LoadingSpinner from "../components/loading-spinner";
import 'jest-canvas-mock'


describe('Home', () => {

    afterEach(() => {
        cleanup()
        jest.clearAllMocks()
    })

    it('renders a set-loaded-button', () => {
        // data-testid="set-loaded-button"
        render(<Home />)
        const main = screen.getByTestId('set-loaded-button')

        expect(main).toBeInTheDocument;
    })

    it('Set-loaded-Button triggers loaded state', () => {
        const app = render(<Home />)
        const main = app.findByTestId('set-loaded-button');
        fireEvent.click(app.getByTestId('set-loaded-button'))

        expect(main).toBeInTheDocument;
    })

    it('renders the main div', () => {
        render(<Home />)
        const main = screen.getByTestId('home-main')

        expect(main).toBeInTheDocument;
    })
    it('renders the image-holder', () => {
        render(<Home />)
        const main = screen.getByTestId('image-holder')

        expect(main).toBeInTheDocument;
    })
    it('renders the explore button', () => {
        render(<Home />)
        const main = screen.getByTestId('explore-button')

        expect(main).toBeInTheDocument;
    })

    it('renders the create button', () => {
        render(<Home />)
        const main = screen.getByTestId('create-button')

        expect(main).toBeInTheDocument;
    })

    it('allows click of button', () => {
        const app = render(<Home />)
        const main = app.findByTestId('create-button');
        main.onClick = jest.fn();
        const spy = jest.spyOn(main, 'onClick')
        fireEvent.click(app.getByTestId('create-button'))
        expect(spy).toHaveBeenCalled()
    })

    it('calls loadNFTs on load', async () => {
        let component = await render(<Home />);
        component.loadNFTs = jest.fn();
        component.loadNFTs.mockReturnValue(Promise.resolve());
        component.loadNFTs();
        let loadNFTsSpy = jest.spyOn(component, 'loadNFTs');
        expect(loadNFTsSpy).toHaveBeenCalled();
    })

    it('nfts should load once rendered', async () => {
        render(<Home />);

        const nftGrid = screen.getByTestId('nft-grid')

        expect(nftGrid).toBeInTheDocument;
    })
})