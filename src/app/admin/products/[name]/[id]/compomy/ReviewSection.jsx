"use client"
import { base_url } from '@/app/components/store/utile';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const ReviewSection = ({product}) => {
  // 1. Manage form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    review: '',
    rating: '5',
    product,

  });


const [fullReviews,setFullReviews]= useState([ ])



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log('Submitted Review Data:', formData);
  
try {
    const response = await axios.post(`${base_url}/review/create`,formData);
    const data = await response.data;
    if(data.success){
        setFullReviews(prev=>([...prev,data.data]))
        toast.success(data.message)
        setFormData({ name: '', email: '', title: '', review: '', rating: '5',product });
    }
} catch (error) {
    toast.error(error.response.data.message)
}
  };



const fetchRevies = async(productid)=>{
    try {
        const response = await axios.get(`${base_url}/review/get/${productid}`);
        const data = await response.data;
        if(data.success){
            setFullReviews(data.data)
        }
    } catch (error) {
        setFullReviews([ ])
    }
}


useEffect(()=>{
    fetchRevies(product)
},[  ])


const handleDelete = async(id)=>{
    try {
const response = await axios.delete(`${base_url}/review/delete/${id}`)
const data = await response.data;
if(data.success){

toast.success(data.message)

    setFullReviews(prev => prev.filter(review => review._id !== id));

}



    } catch (error) {
        toast.error(error.response.data.message)
    }
}

  return (
    <div className=" ">
    
      
      <div  className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Review Title (Added missing name attribute from original) */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
          <input 
            type="text" 
            name="title" 
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Summarize your experience"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Rating Dropdown */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <select 
            name="rating" 
            id="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
        </div>

        {/* Review Textarea */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <textarea 
            name="review" 
            id="review"
            rows="4"
            value={formData.review}
            onChange={handleChange}
            placeholder="Tell us what you thought..."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button 
      onClick={(e)=>handleSubmit(e)}
          className="w-full bg-[#99571d]  text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-0.5"
        >
          Submit Review
        </button>

      </div>

<table className="w-full text-left text-sm border-collapse">
      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="p-3">User</th>
          <th className="p-3">Rating</th>
          <th className="p-3">Review</th>
          <th className="p-3">Date</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {fullReviews.map(item => (
          <tr key={item._id} className="border-b hover:bg-gray-50">
            <td className="p-3 font-medium">{item.name}</td>
            <td className="p-3">{item.rating} ⭐</td>
            <td className="p-3 truncate max-w-xs">{item.review}</td>
            <td className="p-3">{item.createdAt.substring(0, 10)}</td>
            <td className="p-3">
              <button 
                onClick={() => handleDelete(item._id)} 
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    </div>
  )
}

export default ReviewSection