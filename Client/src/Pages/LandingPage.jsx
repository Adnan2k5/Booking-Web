"use client"
import { useState } from "react"
import { MdLanguage, MdMenu, MdClose } from "react-icons/md"
import { IoIosLogIn } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import mock_adventure from "../Data/mock_adventure"

export default function LandingPage() {
  const Navigate = useNavigate()
  const adventures = mock_adventure

  const [adventure, setadventure] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [openLaguage, setOpenLanguage] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavigate = () => {
    Navigate(`/browse?adventure=${adventure}&location=${location}&date=${date}`)
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Video - Fixed at 100vh */}
      <div className="bg absolute top-0 left-0 w-full h-screen overflow-hidden -z-50">
        <video
          src="https://res.cloudinary.com/dygmsxtsd/video/upload/v1740640091/skydiving_oh0ees.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {/* Responsive Navigation */}
      <nav className="w-full fixed h-fit z-50">
        <div className="bg-black w-[90%] m-auto mt-5 text-white px-3 py-3 rounded-xl">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">Logo</h1>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
                {mobileMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex links gap-10 items-center">
              <div className="language-selector relative">
                <MdLanguage
                  onClick={() => {
                    setOpenLanguage(!openLaguage)
                  }}
                  className="text-white text-2xl cursor-pointer"
                />
                {openLaguage && (
                  <div className="language-dropdown bg-black text-white absolute top-[2.5rem] right-0 p-3 rounded-lg">
                    <select className="bg-black text-white">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                )}
              </div>
              <ul className="flex space-x-5 items-center text-lg">
                <li className="cursor-pointer hover:text-gray-300">Explore</li>
                <li className="cursor-pointer hover:text-gray-300">Mission</li>
                <li>
                  <a href="/login">
                    <IoIosLogIn className="text-3xl" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2">
              <ul className="flex flex-col space-y-3">
                <li className="cursor-pointer hover:text-gray-300">Explore</li>
                <li className="cursor-pointer hover:text-gray-300">Mission</li>
                <li className="flex items-center">
                  <MdLanguage className="text-white text-xl mr-2" />
                  <select className="bg-black text-white">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </li>
                <li>
                  <a href="/login" className="flex items-center">
                    <IoIosLogIn className="text-2xl mr-2" />
                    Login
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content - First Section */}
      <section className="flex-1 flex items-center justify-center pt-36 lg:mt-[10rem]">
        <div className="bg-white mx-auto px-4 sm:px-6 md:px-8 py-6 flex-col w-[90%] rounded-3xl shadow-lg">
          <div className="search-bar flex flex-col sm:flex-row gap-4 flex-wrap items-center justify-around w-full">
            <div className="location w-full sm:w-[45%] md:w-fit">
              <input
                onChange={(e) => {
                  setLocation(e.target.value)
                }}
                className="bg-white text-black p-2 rounded-lg border border-gray-300 w-full"
                type="text"
                placeholder="Search Location"
              />
            </div>
            <div className="adventure w-full sm:w-[45%] md:w-fit">
              <select
                onChange={(e) => {
                  setadventure(e.target.value)
                }}
                className="bg-white text-black p-2 rounded-lg border border-gray-300 w-full"
              >
                <option value="all">Select Adventure</option>
                {adventures.map((adventure, index) => (
                  <option key={index} value={adventure.name}>
                    {adventure.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="date w-full sm:w-[45%] md:w-fit">
              <input
                type="date"
                placeholder="Select Date"
                onChange={(e) => {
                  setDate(e.target.value)
                }}
                className="bg-white text-black p-2 rounded-lg border border-gray-300 w-full"
              />
            </div>
            <div className="size w-full sm:w-[45%] md:w-fit">
              <input
                type="number"
                placeholder="Group Size"
                className="bg-white text-black p-2 rounded-lg border border-gray-300 w-full"
              />
            </div>
            <div className="search w-full sm:w-[45%] md:w-fit">
              <button onClick={handleNavigate} className="bg-black text-white cursor-pointer p-2 rounded-lg w-full">
                Begin Adventure
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section - Positioned after 100vh */}
      <div className="explore w-full bg-white px-4 sm:px-6 md:px-8 py-8 mt-[calc(100vh-16rem)]">
        <div className="content">
          <div className="title text-2xl md:text-3xl">
            <h1 className="font-bold tracking-widest w-fit border-b border-gray-400">
              Explore Our Featured Adventures
            </h1>
          </div>
          <div className="adventures flex overflow-x-auto md:overflow-visible py-4">
            <div className="cards flex flex-nowrap md:flex-wrap md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {/* Placeholder cards */}
              {[1, 2, 3].map((item) => (
                <div className="card p-4 min-w-[280px] md:min-w-0 bg-white rounded-lg shadow-md" key={item}>
                  <div className="img w-full h-48 bg-gray-200 rounded-lg"></div>
                  <div className="title mt-2">
                    <h1 className="text-xl font-semibold">Adventure {item}</h1>
                  </div>
                  <div className="desp mt-1">
                    <p className="text-gray-600">
                      Experience the thrill of this amazing adventure with friends and family.
                    </p>
                  </div>
                </div>
              ))}

              {/* Uncomment this when you have adventure data */}
              {/* {adventures.map((adventure, index) => (
                <div className="card p-4 min-w-[280px] md:min-w-0 bg-white rounded-lg shadow-md" key={index}>
                  <div className="img w-full h-48 overflow-hidden rounded-lg">
                    <img
                      src={adventure.img || "/placeholder.svg"}
                      className="w-full h-full object-cover"
                      alt={adventure.name}
                    />
                  </div>
                  <div className="title mt-2">
                    <h1 className="text-xl font-semibold">{adventure.name}</h1>
                  </div>
                  <div className="desp mt-1">
                    <p className="text-gray-600">{adventure.description}</p>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

