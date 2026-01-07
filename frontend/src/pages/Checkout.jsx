import { useParams } from "react-router-dom";
import { useState } from "react";
import { checkout } from "../api/api";
import Title from "../components/Title";
import razorpay from '../assets/razorpay_logo.png'
import { validateCoupon } from "../api/api";
const currency = "₹"
export default function Checkout() {
    const { trainingId } = useParams();
    const BASE_PRICE = 45000;
    const [form, setForm] = useState({});
    const [coupon, setCoupon] = useState("FIRST10");
    const [method, setMethod] = useState("razorpay");
    const [loading, setLoading] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState("");

    const applyCoupon = async () => {
        try {
            const res = await validateCoupon({
                couponCode: coupon,
                trainingId
            });
            console.log(res.valid)
            if (res.valid) {
                const discountAmount = Math.round(BASE_PRICE * (res.discount_percent / 100));

                setDiscount(discountAmount);
                setIsCouponApplied(true);
                setCouponError("");
            }


        } catch (err) {
            setDiscount(0);
            setIsCouponApplied(false);
            setCouponError("Invalid or expired coupon");
        }
    };


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePayNow = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = await checkout({
            trainingId,
            couponCode: coupon,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            street: form.street,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
            country: form.country
        });

        const options = {
            key: data.razorpay_key,
            amount: data.amount,
            currency: "INR",
            order_id: data.order_id,
            name: "Company Trainings",
            description: "Course Payment",
            handler: () => {
                alert("Payment processing... Confirmation via webhook");
            },
            modal: {
                ondismiss: function() {
                    setLoading(false); 
                }
            }
        };
        console.log(options)
        const rzp = new window.Razorpay(options);
        console.log(rzp,"r")
        rzp.open();
        
    };

    const totalAmount = BASE_PRICE - discount;


    return (

        <form onSubmit={handlePayNow} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] p-10">
            {/* left side */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1={"DELIVERY"} text2={"INFORMATION"} />
                </div>
                <div className="flex gap-3">
                    <input onChange={handleChange} name="firstName" value={form.firstName} type="text" placeholder="First Name" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
                    <input onChange={handleChange} name="lastName" value={form.lastName} type="text" placeholder="Last Name" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
                </div>
                <input onChange={handleChange} name="email" value={form.email} type="email" placeholder="Enter Email" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
                <input onChange={handleChange} name="street" value={form.street} type="text" placeholder="Enter Street" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
                <div className="flex gap-3">
                    <input onChange={handleChange} name="city" value={form.city} type="text" placeholder="City" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
                    <input onChange={handleChange} name="state" value={form.state} type="text" placeholder="State" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
                </div>
                <div className="flex gap-3">
                    <input onChange={handleChange} name="zipCode" value={form.zipCode} type="Number" placeholder="Zip code" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
                    <input onChange={handleChange} name="country" value={form.country} type="text" placeholder="Country" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
                </div>
                <input onChange={handleChange} name="phone" value={form.phone} type="Number" placeholder="Phone" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
            </div>

            {/* Right Side */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <div className="w-full">
                        <div className="text-2xl">
                            <Title text1={"CART"} text2={"TOTALS"} />
                        </div>
                        <div className="flex flex-col gap-2 mt-2 text-sm">
                            <div className="flex justify-between">
                                <p>SubTotal</p>
                                <p>{currency} 45000</p>
                            </div>
                            <hr />
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                        placeholder="Enter Coupon Code"
                                        className="border border-gray-300 rounded py-1 px-2 w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={applyCoupon}
                                        className="bg-black text-white px-4 text-sm"
                                    >
                                        Apply
                                    </button>
                                </div>

                                {couponError && (
                                    <p className="text-red-500 text-xs">{couponError}</p>
                                )}

                                {isCouponApplied && (
                                    <p className="text-green-600 text-xs">
                                        Coupon applied! You saved ₹{discount}
                                    </p>
                                )}
                            </div>
                            {isCouponApplied && (
                                <div className="flex justify-between text-green-600">
                                    <p>Discount</p>
                                    <p>- {currency} {discount}</p>
                                </div>
                            )}

                            <hr />
                            <div className="flex justify-between">
                                <p>Total</p>
                                <p>{currency} {totalAmount}</p>

                            </div>
                        </div>

                    </div>
                </div>
                <div className="mt-12">
                    <Title text1={"PAYMENT"} text2={"METHOD"} />
                    {/* Payment Method Selection */}
                    <div className="flex gap-3 flex-col lg:flex-row">

                        <div className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p onClick={() => setMethod("razorpay")} className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}></p>
                            <img src={razorpay} alt="stripe" className="h-5 mx-4" />
                        </div>


                    </div>
                    <div className="w-full text-end mt-8">
                        <button type="submit" className="bg-black text-white px-16 py-3 text-sm cursor-pointer" >PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    );
}
