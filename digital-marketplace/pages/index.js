/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Loader from 'react-loader-spinner'
import { useRouter } from 'next/router'


import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import LoadingSpinner from "../components/loading-spinner";
import ImageFrame from "../components/commons/ImageFrame";
import Button from "../components/commons/Button";
import Link from "next/link";

export default function Home() {
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [nfts, setNfts] = useState([])


  const router = useRouter();

  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    setLoadingState('loading')
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today/')
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format
    *  them as well as fetch their token metadata
    */
    try {
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
        return item
      }))
      setNfts(items)
    } catch (e){
      console.log(e)
    }
    setLoadingState('loaded')
  }

  async function redirectToCreate(event) {
    event.preventDefault();
    router.push('/create-item');
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  if (loadingState === 'loading') return (
      <>
        <button className={"w-0 h-0"} onClick={() => setLoadingState('loaded')} data-testid="set-loaded-button" />
        <LoadingSpinner />
      </>

  )
  return (
      <div className="space-y-24 md:space-y-48 mt-10" data-testid="home-main">

        <div className="flex justify-center flex flex-col md:flex-row md:space-x-60">
          <div className="flex justify-center ml-6" data-testid={"image-holder"}>
            {/*<img src={nfts[0].image} alt={nfts[0].name} className="w-64 h-64" />*/}
            {nfts && nfts.length > 1 && (
                <ImageFrame image={nfts[0].image} className={"md:max-w-lg"}/>
            )}

          </div>
          <div className="flex justify-center flex-col">
            <h1 className={"text-2xl text-center"}>Disover, collect and sell extraordinary NFTS</h1>
            <div className="sm:flex-col md:flex-row self-center">
              <Button label={"Explore"} className={"font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg w-auto mr-2.5"} datatestId='explore-button'/>
                <Button label={"Create"} className={"font-bold mt-4 text-pink-500 outline outline-1 outline-pink-500 rounded p-4 shadow-lg w-auto ml-2.5"} datatestId='create-button' onClick={redirectToCreate}/>
            </div>
          </div>
        </div>
        <div className="h-fit w-full">
          <div className="px-4" style={{ maxWidth: '1600px' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4" data-testid='nft-grid'>
              {
                nfts.map((nft, i) => (
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
        </div>
      </div>


  )
}