import { useRouter, withRouter } from "next/router";
import {ethers} from "ethers";
import {nftaddress, nftmarketaddress} from "../../config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/Market.sol/NFTMarket.json";
import axios from "axios";
import LoadingSpinner from "../../components/loading-spinner";
import { useState, useEffect } from "react";
import _ from 'lodash';
import Web3Modal from "web3modal";


export default function AssetDetails() {
    const router = useRouter();
    let id = router.query.tokenId;
    console.log('this is the id', id)
    const [nft, setNft] = useState({})
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()

        return () => {
            setNft();
            setNfts([]);
            setLoadingState('not-loaded');
        }
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        setLoadingState('loading');
        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
            }
            return item
        }))
        selectItem(items);
    }
    async function selectItem(items) {
        console.log('items in selectItem', items)
       let item = await _.find(items, function(o) { return o.itemId == id; });
        console.log('item', item)
       setNft(item);
       setLoadingState('loaded');
    }

    return (
    <div>
        {loadingState === 'loading' && <LoadingSpinner />}
        {loadingState === 'loaded' && !nft && <div>
            <LoadingSpinner />
            <h1>No item found</h1>
        </div>}
        {loadingState === 'loaded' && nft &&
        <div key={nft?.tokenId}>
            {console.log('this is the nft', nft)}
            <h1>{nft?.name}</h1>
            <img src={nft?.image} />
            <p>{nft?.description}</p>
            <p>{nft?.price}</p>
            <p>{nft?.seller}</p>
            <p>{nft?.owner}</p>
        </div>
        }
    </div>
  );
}