"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGlobalContext } from "../../../../components/context/GlobalContext";
import Image from "next/image";
import Similar from "../../../../components/user/SimilarSuggestions";

import {
  PackageSearch,
  RefreshCcw,
  Factory,
  Sparkles,
  Info,
  Palette,
  Tags,
  ShieldCheck,
  ShoppingCart,
  CreditCard,
  Heart,
} from "lucide-react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const {
    refetchProductById,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    addToCart,
    setIsCartOpen,
    updateQty,
    cart,setAllCart,setIsAuthOpen,setAuthTab,setShowCheckout,setbuytypeCart
  } = useGlobalContext();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedtoCart,setAddedToCart] =useState(false)
const [selectedColorImage,setSelectedColorImage]=  useState()

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const [flipped, setFlipped] = useState([false, false, false]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [newImg,setnewImg]= useState()
  const [selectedQty, setSelectedQty] = useState(1);

  useEffect(() => {
    if (product?.colorVariants?.length > 0) {
      setSelectedColor(product.colorVariants[0]);
      setSelectedQty(1);
    }
  }, [product]);
useEffect(()=>{
  setSelectedImage(newImg?.[0])
},[newImg])


  const toggleFlip = (index) => {
    setFlipped((prev) => prev.map((f, i) => (i === index ? !f : f)));
  };


  const cards = [
    {
      img: "/Images/shipping.webp",
      frontTitle: "Shipping Policy",
      frontSubtitle: "Free shipping on orders above ₹799",
      backContent: (
        <div className="text-sm space-y-1">
    <div>Estimated Delivery Time: 3–7 business days </div>
    <div>All orders are carefully processed and packed</div>
    <div className="italic text-stone-700">
      *Delivery times may vary by location
    </div> 
  </div>
      ),
    },
    {
      img: "/Images/return.webp",
      frontTitle: "Exchange Policy",
      frontSubtitle: "Easy exchange within 24 hours",
      backContent: (
        <div className="list-disc list-inside text-sm space-y-1">
       <p>Products are eligible for exchange only if received damaged.</p>
<p>The issue must be reported within 24 hours of delivery with clear video proof.</p>
<p>Any exchange request raised after 24 hours will be rejected.</p>


        </div>
      ),
    },
    {
      img: "/Images/care.webp",
      frontTitle: "Care Instructions",
      frontSubtitle: "Handle with love & care",
      backContent: (
        <div className="list-disc list-inside text-sm space-y-1">
          <p>Avoid water, perfume, and hairspray</p>
          <p>Store in a dry, cool place separately</p>
          <p>Clean gently with a soft cloth</p>
          <p>Remove before physical activity</p>
        </div>
      ),
    },
  ];

  useEffect(()=>{
setSelectedColorImage(product?.images)
  },[ product])

  useEffect(() => {
    if (id) {
      (async () => {
        const data = await refetchProductById(id);
        if (data) {
          setProduct(data);
          setSelectedImage(data.images?.[0]);
        }
      })();
    }
  }, [id, refetchProductById]);
useEffect(()=>{
setSelectedImage(selectedColorImage?.[0])

},[selectedColorImage])
  if (!product)
    return (
      <div className="flex flex-col xl:flex-row gap-6 px-4 md:px-12 xl:px-40 py-12 ">
        {/* Left: Image Skeleton */}
        <div className="w-full xl:w-1/2 space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-24 h-24 bg-gray-200 animate-pulse rounded-lg"
                />
              ))}
            </div>
            <div className="flex-1 h-[400px] xl:h-[600px] bg-gray-200 animate-pulse rounded-md" />
          </div>
        </div>

        {/* Right: Details Skeleton */}
        <div className="w-full xl:w-1/2 flex flex-col gap-6">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 animate-pulse w-2/3 rounded" />
            <div className="h-4 bg-gray-200 animate-pulse w-1/3 rounded" />
          </div>
          <div className="h-6 bg-gray-200 animate-pulse w-1/4 rounded" />
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 animate-pulse flex-1 rounded" />
            <div className="h-10 bg-gray-200 animate-pulse flex-1 rounded" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 animate-pulse rounded w-full"
              />
            ))}
          </div>
          <div className="h-40 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );





    const handelAddtocart= async(buytype)=>{  
            // buytype ==="buy" ?   :  setbuytypeCart(true);

      const item = {productid:product._id,price:product.finalPrice,quantity:selectedQty,color:selectedColor._id}
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/cart/post`,{...item,buytype},{
        withCredentials:true
      })
     
      const data = await response.data;
   
      if(data.success){
            buytype ==="buy" ? "" :  toast.success(data.message)
        buytype ==="buy" ? " " :  setAddedToCart(true)
        // setbuytypeCart
             setAllCart(data.cart)
      }else{
      setAuthTab("login"); 
              setIsAuthOpen(true);
                setAddedToCart(false)

      }
    } catch (error) {
               setAuthTab("login"); 
              setIsAuthOpen(true);
           setAddedToCart(false)

    }
  

    }


const funshow=(title,incl)=>{

 return product?.hidethings?.includes(incl)? "" :title
}



const handelColorImage=(img)=>{
  
  const newimgset = product?.images.filter((item,index)=> img.includes(`${index}`)

  )
  
 setSelectedColorImage(newimgset)
  // setnewImg()
}

  return (
    <div>
      <div className="relative flex flex-col items-center xl:flex-row xl:items-start justify-center flex-wrap xl:flex-nowrap gap-6 px-4 md:px-12 xl:px-24 py-12 ">
        {/* Left: Sticky Images */}
        <div className="w-full xl:w-1/2 xl:sticky xl:top-24  ">
          <div className="flex flex-col md:flex-row items-center gap-4">
         
         <div className="max-h-[600px] max-w-screen  overflow-y-auto custom-scrollbar">
          <div className="flex md:flex-col gap-4 pr-1 w-fit">
  {(selectedColorImage)?.map((img, idx) => (
   <div key={idx} className="relative w-24 h-24 cursor-pointer">
    <Image
      src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${img}`}
      alt={`Thumbnail ${idx + 1}`}
      fill
      className={`object-cover object-center rounded-tl-2xl rounded-br-2xl transition-all duration-200 ${
        selectedImage === img ? "border-2 border-[#B67032]" : ""
      }`}
      onClick={() => setSelectedImage(img)}
      loading="lazy"
    />
  </div>
  ))}
</div>
        </div>    
            <div
              className="relative w-full h-[400px]  lg:h-[700px] overflow-hidden  rounded-md  cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${selectedImage})`,
                backgroundSize: isZoomed ? "150%" : "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: isZoomed
                  ? `${zoomPos.x}% ${zoomPos.y}%`
                  : "center",
                transition: "background-size 0.3s ease",
              }}
            ></div>
          </div>
        </div>

       

        <div className="w-full xl:w-1/2 flex flex-col gap-2  ">
          {/* Title */}
          <div className="flex justify-between items-start">
            {/* LEFT SIDE (name + category) */}
            <div>
              <h1 className="text-2xl md:text-4xl font-serif text-stone-900">
                {funshow(product.name,"name")}
              </h1>
              <p className="xl:text-md text-stone-700 mt-2 capitalize">
                {product?.category?.name}{" "}
                {product.subcategory?.name && `→ ${product.subcategory.name}`}
              </p>
            </div>

            {/* RIGHT SIDE (wishlist icon) */}
            <button
              onClick={() =>
                wishlist?.some((w) => w._id === product._id)
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product._id)
              }
              className="cursor-pointer"
            >
              {wishlist?.some((w) => w._id === product._id) ? (
                <FaHeart className="w-6 h-6 text-red-500" /> // filled icon
              ) : (
                <Heart className="w-6 h-6 text-stone-700" /> // outline icon
              )}
            </button>
          </div>

          

          {/* Price, Discount & Quantity in one line */}
          <div className="flex items-center justify-between gap-6">
            {/* Price Section */}
            <div className="flex items-end gap-2">
              <span className="text-[#B67032] text-2xl font-bold tracking-wide">
                ₹{ funshow(Math.floor(product.finalPrice),"finalPrice")}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="line-through text-stone-600 text-lg">
                    ₹{funshow(product.price,"price")}
                  </span>
                  <span className="text-green-600 text-sm">
                     { funshow(`(${product.discount}% OFF)`,"discount")}
                  </span>
                </>
              )}
            </div>

{/* Quantity Selector */}
<div className="flex items-center gap-6 border border-gray-200 rounded-full px-4 py-2 text-gray-700 font-medium">
  {/* Decrease */}
  <button
    disabled={selectedQty === 1}
    className={`cursor-pointer text-lg rounded px-2 ${
      selectedQty === 1
        ? "opacity-40 cursor-not-allowed"
        : ""
    }`}
    onClick={() => {
      if (selectedQty > 1) {
        const newQty = selectedQty - 1;
        setSelectedQty(newQty);

        const inCart = cart.find(
          (item) =>
            item._id === product._id &&
            item.color === selectedColor?.colorName
        );
        if (inCart) updateQty(product._id, newQty, selectedColor?.colorName);
      }
    }}
  >
    -
  </button>

  <span className="text-md font-semibold">{selectedQty}</span>

  {/* Increase */}
  <button
    disabled={selectedQty >= (selectedColor?.quantity ?? 1)}
    className={`cursor-pointer text-lg rounded px-2 ${
      selectedQty >= (selectedColor?.quantity ?? 1)
        ? "opacity-40 cursor-not-allowed"
        : ""
    }`}
    onClick={() => {
      if (selectedQty < (selectedColor?.quantity ?? 1)) {
        const newQty = selectedQty + 1;
        setSelectedQty(newQty);

        const inCart = cart.find(
          (item) =>
            item._id === product._id &&
            item.color === selectedColor?.colorName
        );
        if (inCart) updateQty(product._id, newQty, selectedColor?.colorName);
      }
    }}
  >
    +
  </button>
</div>



          </div>

          {/* Inclusive of taxes */}
          <span className="text-sm text-stone-700 block mt-1">
            Inclusive of all taxes
          </span>

          {/* Colors */}
          {product.colorVariants?.length > 0 && selectedColor && (
            <div className="space-y-2 mt-4">
              <h3 className="text-lg font-mosetta font-semibold text-[#B67032] tracking-wide">
                Available Colors
              </h3>

              {/* <div className="flex flex-wrap gap-2">
                {product.colorVariants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedColor(v);
                      setSelectedQty(1);
                    }}
                    style={{ backgroundColor: v.colorName.toLowerCase() }}
                    className={`w-6 h-6 rounded-full  transition ${
                      selectedColor?.colorName === v.colorName
                        ? "ring-2 ring-[#B67032] ring-offset-1"
                        : "border-gray-300"
                    }`}
                    title={v.colorName} // tooltip for accessibility
                  />
                ))}
              </div> */}
              <div className="flex flex-wrap gap-2">
  {product.colorVariants.map((v, i) => (
    <button
      key={i}
      onClick={() => {
        v.images.length &&  handelColorImage(v.images) 
        setSelectedColor(v);
        setSelectedQty(1);
       setAddedToCart(false)
      }}
      className={`px-3 py-1 rounded-md border text-sm transition ${
        selectedColor?.colorName === v?.colorName
          ? "ring-2 ring-[#B67032] border-[#B67032] text-[#B67032] font-medium"
          : "border-gray-300 text-gray-700"
      }`}
    >
      {v?.colorName}
    </button>
  ))}
</div>


              {/* Stock Info */}
              {/* <p className="text-sm text-stone-600">
                {selectedColor?.quantity > 0 ? (
                  <>
                    Only{" "}
                    <span className="font-semibold">
                      {selectedColor?.quantity}
                    </span>{" "}
                    left - order fast!
                  </>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Out of Stock
                  </span>
                )}
              </p> */}
            </div>
          )}

{/* CTA Buttons */}
<div className="flex flex-col md:flex-row gap-4 mt-4">
  {addedtoCart ? (
    
    <button
      onClick={() => setIsCartOpen(true)}
      className="cursor-pointer w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition text-sm font-medium tracking-wide"
    >
      <ShoppingCart className="w-4 h-4" />
      Go to Cart
    </button>
  ) : (
    // If not in cart → Add to Cart
    <button

onClick={()=>{handelAddtocart("cart"),setbuytypeCart(true)}}

      // onClick={() => {
      //   addToCart({
      //     ...product,
      //     color: selectedColor?.colorName, // 👈 हमेशा "color" नाम से save करो
      //     qty: selectedQty,
      //   });
      //   setSelectedQty(1);
      // }}
      className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#B67032] text-white px-4 py-3 rounded hover:bg-[#a95c2e] transition text-sm font-medium tracking-wide"
    >
      <ShoppingCart className="w-4 h-4" />
      Add to Cart
    </button>
  )}

  {/* Buy Now */}
  <button
    onClick={() => {
      if (
        !cart.some(
          (item) =>
            item._id === product._id &&
            item.color === selectedColor?.colorName
        )
      ) 
      // {
      //   addToCart({
      //     ...product,
      //     color: selectedColor?.colorName, 
      //     qty: selectedQty,
      //   });
      // }

     
                {setbuytypeCart(false) ,handelAddtocart("buy"),  setShowCheckout(true)}
          
    }}
    className="w-full flex items-center justify-center gap-2 border border-[#B67032] text-[#B67032] px-4 py-3 rounded hover:bg-[#fff4ed] transition text-sm font-medium tracking-wide"
  >
    <CreditCard className="w-4 h-4" />
    Buy Now
  </button>
</div>



          
          
          {/* <div className="flex flex-col md:flex-row gap-4">
           <button
  onClick={() => {
    addToCart({ ...product, selectedColor, selectedQty });
    setSelectedQty(1);
  }}
              className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#B67032] text-white px-4 py-3 rounded hover:bg-[#a95c2e] transition text-sm font-medium tracking-wide"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button className="w-full flex items-center justify-center gap-2 border border-[#B67032] text-[#B67032] px-4 py-3 rounded hover:bg-[#fff4ed] transition text-sm font-medium tracking-wide">
              <CreditCard className="w-4 h-4" />
              Buy Now
            </button>
          </div> */}
          {/* Description */}
          {(product.description?.paragraphs?.length > 0 ||
            product.description?.bulletPoints?.length > 0) && (
            <div className="my-4">
              <h3 className="text-lg font-mosetta font-semibold text-[#B67032] ">
                Description
              </h3>

              {/* Paragraphs */}
              {product.description?.paragraphs?.map((para, idx) => (
                <p key={idx} className="xl:text-md  text-stone-800 my-4">
                  {para}
                </p>
              ))}

              {/* Bullet Points */}
              {product.description?.bulletPoints?.length > 0 && (
                <div className=" xl:text-md text-stone-800 marker:text-[#B67032]  space-y-2">
                  {product.description.bulletPoints.map((point, idx) => (
                    <h6 key={idx}>{point}</h6>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shipping Info Section */}
          <div
            className="relative bg-cover md:bg-contain py-4"
            // style={{ backgroundImage: "url('/Images/bg4.png')" }}
          >
            {/* Overlay for readability */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ffffff1c]"></div> */}

            {/* Content */}
            <div className="relative z-10 grid md:grid-cols-3 mx-auto">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="group perspective cursor-pointer"
                  onClick={() => toggleFlip(i)}
                >
                  <div
                    className={`relative w-full h-52  lg:h-72 2xl:h-52  transition-transform duration-700 preserve-3d ${
                      flipped[i] ? "rotate-y-180" : ""
                    } md:group-hover:rotate-y-180`}
                  >
                    {/* Front */}
               <div className="absolute inset-0 flex flex-col items-center justify-end rounded-2xl backface-hidden p-6 text-center text-white">
  <div className="relative w-24 h-24 mb-4">
    <Image
      src={`${card.img}`}
      alt={card.frontTitle || "Card Image"}
      fill
      className="object-cover rounded"
      loading="lazy"
    />
  </div>
  <h3 className="text-md md:text-lg font-mosetta text-black tracking-wide">
    {card.frontTitle}
  </h3>
  <p className="mt-2 text-sm text-gray-800">
    {card.frontSubtitle}
  </p>
</div>

                    {/* Back */}
                    <div className="absolute inset-0  rounded-2xl backface-hidden rotate-y-180 p-6 flex flex-col items-center justify-end text-white">
                
                      <h3 className="text-lg  font-mosetta text-black tracking-wide">
                        {card.frontTitle}
                      </h3>
                      <div className="text-sm leading-relaxed text-gray-800">
                        {card.backContent}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {product?.category && (
        <Similar
          categoryId={product?.category}
        />
      )}
    </div>
  );
}
