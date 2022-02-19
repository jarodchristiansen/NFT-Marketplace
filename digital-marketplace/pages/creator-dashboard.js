import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"


import {
    nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import LoadingSpinner from "../components/loading-spinner";

export default function CreatorDashboard() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded');

    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        });
        setLoadingState('loading');
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchItemsCreated()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                sold: i.sold,
                image: meta.data.image,
                description: meta.data.description,
                name: meta.data.name,
            }
            return item
        }))
        /* create a filtered array of items that have been sold */
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>);
    if (loadingState === 'loading') return (
        <LoadingSpinner />
    );
    return (
        <div>
            <div className="p-4">
                <h2 className="text-2xl py-2">Items Created</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        nfts.map((nft, i) => (
                            // <div key={i} className="border shadow rounded-xl overflow-hidden">
                            //     <img src={nft.image} className="rounded" />
                            //     <div className="p-4 bg-black">
                            //         <p className="text-2xl font-bold text-white">Price - {nft.price} Matic</p>
                            //     </div>
                            // </div>
                            <div key={i} className="rounded-md max-w-sm ">
                                <img src={nft.image} />
                                <div className=" border p-4 overflow-hidden">
                                    <p style={{ height: '64px' }} className="text-2xl font-semibold text-center">{nft.name}</p>
                                    <hr
                                        className={"w-full border-b-2 border-black bg-black mb-4"}
                                    />
                                    <div className="hover:overflow-y-auto">
                                        <p className="text-gray-400 text-center">{nft.description}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-black ">
                                    <p className="text-2xl mb-6 font-bold text-tahiti text-center">{nft.price} Matic</p>
                                    <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="px-4">
                {
                    Boolean(sold.length) && (
                        <div>
                            <h2 className="text-2xl py-2">Items sold</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                {
                                    sold.map((nft, i) => (
                                        <div key={i} className="border shadow rounded-xl overflow-hidden">
                                            <p style={{ height: '64px' }} className="text-2xl font-semibold text-center">{nft.name}</p>
                                            <img src={nft.image} className="rounded" />
                                            <div className="p-4 bg-black">
                                                <p className="text-2xl font-bold text-white">Price - {nft.price} Matic</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}