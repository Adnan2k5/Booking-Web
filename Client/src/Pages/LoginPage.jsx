import React, { useState } from "react";
import { Eye, EyeClosed, Lock, LogInIcon, Phone } from "lucide-react";
import google from "../assets/google.png";
import { MdEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
// import bgvideo from "../assets/skydiving.mp4"
export default function LoginPage() {
  const [viewPassword, setViewPassword] = useState(false);
  const [usingPhone, setUsingPhone] = useState(false);
  const [signup, setSignup] = useState(false);
  const {register, handleSubmit, reset} = useForm();
  
  const onSubmit = (data) => {
    if(signup){
      console.log(data, "User Signed Up");
      reset();
    }
    else{
      console.log(data, "User Signed In");
      reset();
    }
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="bg absolute w-full object-cover">
        {/* <video
          src={bgvideo} 
          autoPlay
          loop
          muted
          className="w-full object-cover"
        /> */}
      </div>
      <div className="login relative  bg-gradient-to-b from-[#CEF2FF] to-white rounded-xl shadow-lg flex flex-col items-center justify-items-end  md:py-8 md:px-10 lg:w-1/2 py-4">
        <div className="form w-full flex flex-col">
          <div className="header flex flex-col items-center gap-4">
            <div className="icon bg-white rounded-2xl shadow-[#a4e0f6] shadow-lg p-4">
              <LogInIcon className="text-black" />
            </div>
            <h1 className="text-2xl font-semibold w-full text-center ">
              {signup ? "Sign Up" : "Sign In"}
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="Form md:px-12 px-5 py-4 gap-2 flex flex-col mt-5">
            <div className="email px-4 md:py-5 py-3 bg-gray-200 flex gap-6 items-center rounded-2xl">
              {usingPhone ? (
                <div className="flex gap-6 items-center">
                  <Phone className="text-gray-600 text-2xl" />
                  <input
                    type="number"
                    placeholder="Phone Number"
                    {...register("phone")}
                    className="w-full bg-transparent h-full outline-none border-none"
                  />
                </div>
              ) : (
                <div className="flex gap-6 items-center">
                  <MdEmail className="text-gray-600 text-2xl" />
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className="w-full bg-transparent h-full outline-none border-none"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => setUsingPhone(!usingPhone)}
              className="text-gray-600 cursor-pointer w-fit md:text-sm text-xs text-left"
            >
              {usingPhone ? "Use Email instead" : "Use Phone instead"}
            </button>
            <div className="password px-4 md:py-5 py-3 bg-gray-200 flex gap-6 items-center rounded-2xl">
              <Lock className="text-gray-600 text-2xl" />
              <input
                type={viewPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full bg-transparent outline-none border-none"
              />
              {!viewPassword ? (
                <EyeClosed
                  className="text-gray-600 text-2xl cursor-pointer"
                  onClick={() => setViewPassword(true)}
                />
              ) : (
                <Eye
                  className="text-gray-600 text-2xl cursor-pointer"
                  onClick={() => setViewPassword(false)}
                />
              )}
            </div>
            {signup && (
              <div className="password px-4 md:py-5 py-3 bg-gray-200 flex gap-6 items-center rounded-2xl">
                <Lock className="text-gray-600 text-2xl" />
                <input
                  type={viewPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className="w-full bg-transparent outline-none border-none"
                />
              </div>
            )}
            <div className="forgot mt-1 flex flex-col lg:flex-row justify-between">
              <div
                onClick={() => setSignup(!signup)}
                className="text-gray-600 md:text-sm text-xs text-center lg:text-left"
              >
                {signup ? <p>Already have an account? <span className="text-blue-500">Sign In</span></p> : <p>Don't have an account? <span className="text-blue-500">Sign Up</span></p>}
              </div>
              {!signup && (
                <p className="text-gray-600 md:text-sm text-xs text-center lg:text-right">
                  Forgot password?
                </p>
              )}
            </div>
            {signup ? (
              <div className="button w-full bg-black rounded-2xl">
                <button className=" w-full text-white  py-2">Sign Up</button>
              </div>
            ) : (
              <div className="button w-full bg-black rounded-2xl">
                <button className=" w-full text-white  py-2">Sign In</button>
              </div>
            )}
          </form>
        </div>
        <div className="alternate md:mt-3 ">
          <p className="text-gray-500 text-sm">
            {signup ? "Or Sign Up with" : "Or Sign In with"}
          </p>
          <div className="google flex items-center justify-center mt-2">
            <img src={google} alt="" className="md:w-10 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
