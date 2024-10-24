'use client'

import Navbar from '../components/layouts/Navbar'
import Footer from '../components/layouts/Footer'
import styles from './about.module.css'; // Import your CSS module



import React from 'react';
import { Parallax } from 'react-parallax';

// Sample image URLs for parallax background
const image1 = "/stray1.jpeg";
const image2 = "/stray3.avif";
const image3 = "/stray8.webp";


<Navbar />
const ParallaxComponent = () => {
  return (

    <div>

        <Navbar />

      {/* First Parallax Slide */}
      <Parallax bgImage={image1} strength={300}>
        <div style={{ height: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: '5rem' }}>About Us</h1>
        </div>
      </Parallax>

      {/* Content between slides */}
      <div style={{ height: '200px', textAlign: 'center', padding: '60px' }}>
        <p style={{ fontSize: '1.25rem' }}>Welcome to The Stray Registry! We are dedicated to a platform designed to help lost pets reunite with their owners. Our mission is to create a simple and effective way to report and find missing pets in your area. </p>
      </div>

      {/* Second Parallax Slide */}
      <Parallax bgImage={image2} strength={200}>
        <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: '5rem' }}>Our Vision</h1>
        </div>
      </Parallax>

      {/* More content below */}
      <div style={{ height: '200px', textAlign: 'center', padding: '60px' }}>
        <p style={{ fontSize: '1.25rem' }}>We believe that every pet deserves to be home. Our goal is to assist communities in creating a network where lost pets are spotted, reported, and reunited with their families. </p>
      </div>


        {/* Third Parallax Slide */}
        <Parallax bgImage={image3} strength={200}>
        <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ color: '#fff', fontSize: '5rem' }}>Our Team</h1>
        </div>
        </Parallax>

        {/* More content below */}
        <div style={{ height: '100px', textAlign: 'center', padding: '50px' }}>
            <p style={{ fontSize: '1.25rem' }}>Our team consists of members: Raed, Rodney, Andy, Alejandro, Nicholas and Divine! Also known as RRAAND!</p>
        </div>

        <Footer />
    </div>




  );
};

export default ParallaxComponent;
