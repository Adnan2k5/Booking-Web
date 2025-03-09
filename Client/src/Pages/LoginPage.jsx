import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Eye, EyeClosed, Lock, LogInIcon, Phone } from "lucide-react";
import google from "../assets/google.png";
import { MdEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { ResendOtp, UserLogin, UserRegister, VerifyUser } from "../Auth/UserAuth";
import { Modal } from "antd";
import {
  InputOTPSlot,
  InputOTP,
  InputOTPGroup,
} from "../components/ui/input-otp";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [viewPassword, setViewPassword] = useState(false);
  const [usingPhone, setUsingPhone] = useState(false);
  const [signup, setSignup] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [openOtp, setopenOtp] = useState(false);
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const Navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      if (signup) {
        setEmail(data.email);
        const res = await UserRegister(data);
        if (res === 201) {
          setopenOtp(true);
        } else if (res === 409) {
          toast("User Already Exists");
        }
        reset();
      } else {
        const res = await UserLogin(data, dispatch);
        setEmail(data.email);
        if (res === 200) {
          toast("Login Successfull");
          Navigate("/browse")
        }
      }
    } catch (err) {
      if(err.response){
        if(err.response.status === 403){
          toast("User Not Verified", email);
          setEmail(data.email);
          setopenOtp(true);
          ResendOtp(data.email);
        }
      }
    }
  };
  const verifyOtp = async () => {
    const data = { email, otp: value };
    const res = await VerifyUser(data, dispatch);
    if (res === 200) {
      toast("Email Verified Successfully");
      setopenOtp(false);
      setValue("");
    } else if (res === 400) {
      toast("Invalid Otp");
    }
  };

  const cancel = () => {
    setopenOtp(false);
    setValue("");
  };

  const onGoogleLoginSucces = (response) => {
    console.log("Google Login Success:", response);
    axios.post("http://localhost:8080/api/auth/signInWithGoogle", { token: response.credential }, { withCredentials: true })
      .then(res => console.log("Backend response:", res.data))
      .catch(err => console.error("Error:", err));
  }


  const linkedInLogin = () => {
    const REDIRECT_URI = "http://localhost:5173/auth/signInWithLinkedin";
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email`;
    window.location.href = authUrl;
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
        <Modal open={openOtp} footer={null} onCancel={()=>{cancel}}>
          <div className="space-y-2 flex flex-col items-center gap-4">
            <h1>
              Enter One-Time Password sent on{" "}
              <span className="text-blue-500">{email}</span>
            </h1>
            <InputOTP
              maxLength={6}
              value={value}
              onChange={(value) => setValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <button
              onClick={verifyOtp}
              className="bg-black text-white rounded-2xl py-2 w-full"
            >
              Verify OTP
            </button>
          </div>
        </Modal>
        <div className="form w-full flex flex-col">
          <div className="header flex flex-col items-center gap-4">
            <div className="icon bg-white rounded-2xl shadow-[#a4e0f6] shadow-lg p-4">
              <LogInIcon className="text-black" />
            </div>
            <h1 className="text-2xl font-semibold w-full text-center ">
              {signup ? "Sign Up" : "Sign In"}
            </h1>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="Form md:px-12 px-5 py-4 gap-2 flex flex-col mt-5"
          >
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
                <div className="flex gap-6 items-center w-full">
                  <MdEmail className="text-gray-600 text-2xl" />
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    autoComplete="off"
                    className="w-full bg-transparent outline-none border-none"
                  />
                </div>
              )}
            </div>
            <button 
              type="button"
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
            <div className="forgot mt-1 flex flex-col items-center justify-between gap-2">
              <div
                onClick={() => setSignup(!signup)}
                className="text-gray-600 md:text-sm text-xs text-center"
              >
                {signup ? (
                  <p>
                    Already have an account?{" "}
                    <span className="text-blue-500 cursor-pointer">Sign In</span>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{" "}
                    <span className="text-blue-500 cursor-pointer">Sign Up</span>
                  </p>
                )}
              </div>
              {!signup && (
                <button type="button" onClick={()=>{Navigate('/reset')}} className="text-gray-600 md:text-sm w-fit text-xs text-center cursor-pointer">
                  Forgot password?
                </button>
              )}
            </div>
            {signup ? (
              <div className="button w-full bg-black rounded-2xl">
                <button type="submit" className=" w-full text-white cursor-pointer  py-2">Sign Up</button>
              </div>
            ) : (
              <div className="button w-full bg-black rounded-2xl ">
                <button type="submit" className=" w-full cursor-pointer text-white  py-2">Sign In</button>
              </div>
            )}
          </form>
        </div>
        <div className="alternate md:mt-3 ">
          <p className="text-gray-500 text-sm text-center">
            {signup ? "Or Sign Up with" : "Or Sign In with"}
          </p>
          <div className="google">
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLogin onSuccess={onGoogleLoginSucces}/>
            </GoogleOAuthProvider>
            <div onClick={linkedInLogin}>Login With Linkedin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
