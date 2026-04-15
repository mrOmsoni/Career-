'use client';
import React from 'react';
import {SignInButton, SignedOut,SignedIn,UserButton, SignUpButton,} from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { BookOpen } from "lucide-react";
// passward = npg_u3Cj9HViPESX 
import { ChevronDown, FileText, GraduationCap, LayoutDashboard,StarsIcon } from 'lucide-react'
export default function Header() {
  return (
    <header className='position: fixed w-full border-b bg-background/80  backdrop-blur-md z-50 
    supports-[backdrop-filter]:bg-background/60'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href="/">
        <Image src="/logo.png" alt='Sansai-logo' width={200} height={60} priority
         className='h-12 py-1 w-auto object-contain'/>
        </Link>
        
      <div className='flex items-center space-x-2'>
        <SignedIn>
            <Link href={"/industry-insights"}>
             <Button>
                <LayoutDashboard className='h-4 w-4'/>
                <span className='block cursor-pointer '>Industry Insights</span>
             </Button>
            </Link>
         
     {/* DropdownMenu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <StarsIcon className='h-4 w-4'/>
             <span className='bolck '>Growth Tools</span>
             <ChevronDown className='h-4 w-4'/>
          </Button>

        </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href={"/resume"} className='flex items-center gap-2'>
                    <FileText className='h-4 w-4'/>
                    <span>Build Resume</span>
                    </Link>
                  <DropdownMenuItem>
                    <Link href={"/roadmap"} className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Study Roadmap
                    </Link>
                  </DropdownMenuItem>
                  </DropdownMenuItem>
                    <DropdownMenuItem>
                    <Link href={"/ai-cover-later"} className='flex items-center gap-2'>
                    <FileText className='h-4 w-4'/>
                    Cover later
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link href={"/interview"} className='flex items-center gap-2'>
                    <GraduationCap className='h-4 w-4'/>
                    Interview prep
                    </Link>
                  </DropdownMenuItem>
            
                </DropdownMenuContent>
              </DropdownMenu>
          </SignedIn>

          <SignedOut>
              <SignInButton>
              <Button > Sign_in</Button>
              </SignInButton>
          </SignedOut>
            <SignedIn>
              <UserButton 
              appearance={{
                elements:{avatarBox:"w-10 h-10",userButtonPopoverCard:"shadow-xl",userPreviewMainIdentifier:"font-semibold",},
              }} afterSignOutUrl='/'/>
              
            </SignedIn>
            {/* <SignInButton/>
            <UserButton/> */}
       
      </div>  
    </nav> 
    </header>
  )
}


