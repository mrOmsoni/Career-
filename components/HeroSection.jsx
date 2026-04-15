"use client"
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'



export default function HeroSection() {
    const imageref=useRef(null);

    useEffect(()=>{
     const imageElement=imageref.current;
     const handleScroll=()=>{
        const scrollPosition=window.scrollY;
        const scrollThreshold=100;
    
  
        if(scrollPosition>scrollThreshold){
            imageElement.classList.add("scrolled");
        }
        else{
            imageElement.classList.remove("scrolled")
        }
    }
    window.addEventListener("scroll",handleScroll);
    return()=> window.removeEventListener("scroll",handleScroll)
},[]);

 return (
    <section className='w-full pt-20 md:pt-20 pb-14'>
       <div className='space-y-6 text-center'>
        <div className='space-y-6 mx-auto'>
            <h1 className='text-5xl font-bold md:text-6xl lg:text-7xl xl:text-7xl gradient-title'>
                Your AI Career Coach for 
                <br/>
                Professional Success
            </h1>
            <p className='text-xl mx-auto max-w-[600px] text-muted-foreground md:text-xl'>
                Advance your career with personalized guidance,interview pre,and
                AI powered tools for job success..
            </p> 
        </div>

        <div className='justify-center sace-x-4'>
            <Link href="/dashboard">
            <Button size="lg" className=" px-8 m-4">Get Started</Button>
            </Link>

            <Link href="https://youtu.be/UbXpRv5ApKA?si=s7BpLbHgd5DnZ_pc" className='border-white'>
            <Button  size="lg" variant="outline" className="px-8">
                Get Started</Button>
            </Link>
        </div>

        <div className='hero-image-wrapper mt-5 md:mt-0'>
            <div ref={imageref} className='hero-image'>
                <Image  src={"/banner.jpeg"} width={1280} height={720}
                alt="Banner sensai"
                className='rounded-lg shadow-2xl border mx-auto'priority></Image>
            </div>
        </div>
       </div>
    </section>
 )
}
