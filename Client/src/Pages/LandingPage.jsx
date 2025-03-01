import React from "react";
import { useState } from "react";
import { MdLanguage } from "react-icons/md";
import { IoIosLogIn } from "react-icons/io";
// import skydiving from "../assets/skydiving.mp4";
import { useNavigate } from "react-router-dom";
import  mock_adventure  from "../Data/mock_adventure";
export default function LandingPage () {
  const Navigate = useNavigate();
  const adventures = mock_adventure

  const [adventure, setadventure] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [openLaguage, setOpenLanguage] = useState(false);

  const handleNavigate = () => {
    Navigate(
      `/browse?adventure=${adventure}&location=${location}&date=${date}`
    );
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* <div className="bg absolute -z-50 ">
        <video
          src={skydiving}
          autoPlay
          loop
          muted
          className="w-full object-cover"
        />
      </div> */}
      <nav className="w-full fixed h-fit  z-50">
        <div className="bg-black w-[90%]  m-auto mt-5  text-white px-3 py-3 rounded-xl">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Logo</h1>
            <div className="links flex gap-10 items-center">
              <div className="language-selector">
                <MdLanguage
                  onClick={() => {
                    setOpenLanguage(!openLaguage);
                  }}
                  className="text-white text-2xl"
                />
                {openLaguage && (
                  <div className="language-dropdown bg-black text-white absolute top-[4rem] right-60 p-3 rounded-lg">
                    <select className="bg-black text-white">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                )}
              </div>
              <ul className="flex space-x-3 items-center text-lg">
                <li>Explore</li>
                <li>Mission</li>
                <li>
                  <a href="/login">
                    <IoIosLogIn className="text-3xl" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <section className="m-auto   flex bg-white px-8 py-6 flex-col w-[90%] h-fit rounded-3xl ">
        <div className="search-bar flex items-center justify-around w-full">
          <div className="location w-fit">
            <input
              onChange={(e) => {
                setLocation(e.target.value);
              }}
              className="bg-white text-black p-2 rounded-lg"
              type="text"
              placeholder="Search Location"
            >
            </input>
          </div>
          <div className="adventure">
            <select
              onChange={(e) => {
                setadventure(e.target.value);
              }}
              className="bg-white text-black p-2 rounded-lg"
            >
              <option value="all">Select Adventure</option>
              {adventures.map((adventure, index) => (
                <option key={index} value={adventure.name}>
                  {adventure.name}
                </option>
              ))}
            </select>
          </div>
          <div className="date">
            <input
              type="date"
              placeholder="Select Date"
              onChange={(e) => {
                setDate(e.target.value);
              }}
              className="bg-white text-black p-2 rounded-lg"
            />
          </div>
          <div className="size">
            <input
              type="number"
              placeholder="Group Size"
              className="bg-white text-black p-2 rounded-lg"
            />
          </div>
          <div className="search">
            <button
              onClick={handleNavigate}
              className="bg-black text-white p-2 rounded-lg"
            >
              Begin Adventure
            </button>
          </div>
        </div>
      </section>
      <div className="explore absolute mt-[100vh]  w-full bg-white px-8 py-8">
        <div className="content">
          <div className="title text-3xl">
            <h1 className="font-bold tracking-widest w-fit border-b border-gray-400">
              Explore Our Featured Adventures
            </h1>
          </div>
          <div className="adventures  flex">
            <div className="cards flex py-4">
              {/* {adventures.map((adventure, index) => (
                <div className="card p-4" key={index}>
                  <div className="img w-full">
                    <img
                      src={adventure.img}
                      className="w-full"
                      alt=""
                    />
                  </div>
                  <div className="title">
                    <h1 className="">{adventure.name}</h1>
                  </div>
                  <div className="desp">
                    <p>{adventure.description}</p>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
