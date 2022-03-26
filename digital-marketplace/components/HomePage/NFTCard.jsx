const NFTCard = (props) => {
  const { nft, i } = props;

  return (
    <div
      key={i}
      className="rounded-md outline outline-1 outline-pink-500 shadow-xl"
    >
      <img src={nft.image} className={"max-h-fit"} />
      <div className=" border p-4 overflow-hidden">
        <div className={"max-h-fit overflow-auto"}>
          <p className="text-2xl font-semibold text-center pb-5">{nft.name}</p>
        </div>

        <hr className={"w-full border-b-2 border-black bg-black mb-4"} />
        <div className="max-h-fit overflow-auto hover:overflow-y-auto">
          <p className="text-gray-400 text-center">{nft.description}</p>
        </div>
      </div>
      <div className="p-4 bg-black">
        <p className="text-2xl mb-6 font-bold text-tahiti text-center">
          {nft.price} Matic
        </p>
        <button
          className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
          onClick={() => buyNft(nft)}
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default NFTCard;
