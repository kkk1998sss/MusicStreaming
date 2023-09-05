"use client"
import AuthModal from '@/components/AuthModal';
import UploadModal from '@/components/UploadModal';
import { useEffect, useState } from 'react'

const ModalProvider = () => {
    const [isMounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true);
    },[]);

    if(!isMounted) {
        return null;
    }

  return (
   <>
   <AuthModal/>
   <UploadModal/>
   </>
    
  )
}

export default ModalProvider