"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopupModal from "../../components/admin/ConfirmPopup";
import Image from "next/image";
import { useGlobalContext } from "../../components/context/GlobalContext";
import { FaSearch } from "react-icons/fa";



const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup , setShowDeletePopup] = useState(false)
  const [productToDelete, setProductToDelete] = useState("")
  const [IdToDelete, setIdToDelete] = useState("")
  const router = useRouter();
  const { allProducts, refetchAllProducts } = useGlobalContext();
  const [searchVal,setSearchval]= useState("")
  const [newProduct,setnewPRoduct]=useState()
  useEffect(()=>{setnewPRoduct(allProducts)},[allProducts])


  useEffect(() => {
    // Trigger refetch on page load
    const loadData = async () => {
      setLoading(true);
      await refetchAllProducts();
      setLoading(false);
    };

    loadData();
  }, [refetchAllProducts]);

    const handleDelete = (product)=>{
      setShowDeletePopup(true)
      setIdToDelete(product._id)
      setProductToDelete(product.name)


    }
    const deleteProduct = useCallback( async ()=>{
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/product/id/${IdToDelete}`,{
        method:'DELETE',
      })
      if(res.ok){
        toast.success('Product Deleted Successfully!');
      await refetchAllProducts()
      }else{
        const data = await res.json();
     
        toast.error(data.message || 'Failed to delete Product.')
      }
    }catch(err){
      console.error('Error Deleting Product!',err)
        toast.error('Something went wrong.')

    }
    setShowDeletePopup(false)
 
  }
,[refetchAllProducts, IdToDelete])

useEffect(()=>{
if(!searchVal) setnewPRoduct(allProducts);

const newdata = allProducts?.filter((item)=> item.name.toLowerCase().includes(searchVal.toLowerCase()))

setnewPRoduct(newdata)


},[searchVal])



  return (
   <div className=" w-full">
    <ToastContainer className={'z-[9999]'}/>
      <div className="  flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold font-mosetta  text-[#99571d]  drop-shadow-sm">
          All Products
        </h2>
        <div className="relative">
<FaSearch  className="absolute right-2 top-2.5 text-gray-600/70" />
<input type="text" value={searchVal} onChange={(e)=>setSearchval(e.target.value)} placeholder="Search Products..." className="border px-2 rounded-md py-1 md:w-[30rem]" />

        </div>
        <Link
          href="/admin/products/add"
          className="bg-[#4d4c4b] hover:bg-[#272625] text-white px-4 py-2 rounded-xl shadow transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg ">
        {loading ? (
          <Skeleton count={5} height={40} className="mb-2 rounded" />
        ) : (
          <table className="min-w-full text-left  ">
            <thead className="bg-[#4d4c4b] text-white text-xl font-medium">
              <tr className="text-sm ">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Image</th>

                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">Barcode</th>
              
                <th className="px-4 py-3">ACTIONS</th>
              </tr>
            </thead>



            <tbody className="text-sm font-medium ">
              {newProduct.length === 0 ? (
    <tr>
      <td colSpan={6} className="text-center py-6 text-gray-500">
        No products found.
      </td>
    </tr>
  ) :(newProduct.map((product, idx) => (
                <tr key={product._id} className=" rounded-xl hover:bg-[#f3f2f1]  transition">
                  <td className="px-4 py-3">{idx + 1} </td>
                  <td className="px-4 py-3"><img alt=''  width={220} height={220}  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${product.images?.[0]}`} className="w-16 h-16 object-cover"/></td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3 capitalize">{product?.category?.name}</td>
                  
                  {/* <td className="px-4 py-3 capitalize">
              
{newProduct.subcategory?.name || null}
                  </td> */}
                                    <td className="px-4 py-3 text-black "><img  alt={`barcode`} width={220} height={220}  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/uploads/${product?.barcode}`} className="w-full h-12 object-cover "/></td>

                  
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                       <Link href={`/admin/products/view/${product._id}`}
                          className="bg-[#5f5e5e] text-white px-3 py-1 rounded hover:bg-[#333232] transition"
                      >
                        View
                      </Link>
                      <Link  href={`/admin/products/edit/${product._id}`}
                        className="bg-[#ddb461c9] text-black px-3 py-1 rounded hover:bg-[#e8b858] transition"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product)}
                        className="bg-[#dd4747e7] text-white cursor-pointer px-3 py-1 rounded hover:bg-[#ec4242e7] transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        )}
      </div>

      {
        showDeletePopup && (
          <PopupModal  title = {`Are you sure you want to delete product -'${productToDelete}'`}
  message = {""}
  onCancel={()=>{setShowDeletePopup(false)}}
  onConfirm={()=>{deleteProduct()}}
  confirmText = {"Delete"}
  cancelText = {"Cancel"}
  type = {"delete"} // options: default | delete | warning | info
  showCancel = {true}
  />
        )
      }
    </div>
  );
};

export default ProductsList;
