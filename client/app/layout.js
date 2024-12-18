'use client'; // This marks the file as a Client Component

import { useEffect } from 'react';
import localFont from 'next/font/local';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'; // Import your global styles
import { Toaster } from 'react-hot-toast'; // Import the Toaster component
import { usePathname } from 'next/navigation'; // Import usePathname for conditional rendering
import { UnreadMessagesProvider } from '@/app/context/UnreadMessagesContext';
import HelpMatchPopUp from './components/HelpMatchPopUp';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export default function RootLayout({ children }) {
    const pathname = usePathname(); // Get the current route

    useEffect(() => {
        // Dynamically import Bootstrap's JavaScript when the document is available
        if (typeof document !== 'undefined') {
            require('bootstrap/dist/js/bootstrap.bundle.min.js');
        }
    }, []);

    // Specify the paths where the popup should appear
    const pathsWithPopup = ['/Strays', '/LostPets', '/FoundPets'];

    return (
        <html lang="en">
            <head>
                <title>Stray Finder 24</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <Toaster position="top-right" /> {/* Add the Toaster here */}
                <UnreadMessagesProvider>
                    {children}
                    {pathsWithPopup.includes(pathname) && <HelpMatchPopUp />} {/* Render popup only for specific pages */}
                </UnreadMessagesProvider>
            </body>
        </html>
    );
}
